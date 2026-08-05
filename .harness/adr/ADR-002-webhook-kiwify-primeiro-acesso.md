# ADR-002: Webhook da Kiwify cria conta; primeiro acesso via e-mail assinado

- **Status**: aceita
- **Data**: 2026-07-20
- **Decisor(es)**: Gabriel (Origami Lab)

## Contexto

`TD-0007` (ver ADR-001): sem integração com a Kiwify, `/cadastro` virou só um
botão pro checkout (decisão de produto — sem cadastro aberto, senão qualquer
um teria acesso de graça). Falta o outro lado: quando alguém compra de
verdade, como a conta é criada e como o comprador recebe uma senha de forma
segura.

Pesquisei a documentação pública da Kiwify antes de desenhar isso. Achados:
- O webhook "clássico" (o que se configura em Apps → Webhooks, escolhendo
  produto + evento "compra aprovada") envia um payload JSON com um objeto
  `Customer` (`full_name`, `email`) e um `order_status`. Confirmado via
  exemplos de integração de terceiros, não há um schema oficial completo
  publicado.
- A Kiwify **não documenta publicamente** um mecanismo de assinatura
  criptográfica para esse webhook clássico (ao contrário de Stripe/GitHub).
  A validação de autenticidade viável é um token secreto embutido na própria
  URL do webhook (só o vendedor e a Kiwify conhecem essa URL).
- Não há confirmação pública de quais parâmetros a Kiwify anexaria num
  redirecionamento pós-compra de volta pro app — depender disso pra
  autenticar o comprador seria inseguro (qualquer um poderia tentar "reivindicar"
  uma conta só sabendo o e-mail de quem comprou).

Restrição de custo (ver `context.md`): infra é free tier. Um serviço de
e-mail transacional é uma dependência nova, mas justificável agora — o
produto passou a gerar receita real, e o Resend tem free tier (~3 mil
e-mails/mês) muito acima do volume esperado do MVP.

## Decisão

- **Webhook** (`POST /api/webhooks/kiwify?token=...`): valida um token
  secreto (`KIWIFY_WEBHOOK_TOKEN`) via query string, comparado em tempo
  constante. Sem esse mecanismo de assinatura documentado pela Kiwify, é a
  defesa disponível — mitigada por ser uma URL não pública e HTTPS.
- Ao receber `order_status` de compra aprovada, faz upsert de `Usuario` pelo
  `email` do `Customer`. Conta nova é criada com `senhaHash = null`
  (significa "aguardando primeiro acesso" — nunca pode ser usada pra login
  até a senha ser definida).
- Gera um token assinado (mesma infraestrutura de `src/lib/sessao.ts`,
  generalizada com um campo `tipo` pra não ser intercambiável com o cookie de
  sessão) e envia por e-mail via Resend (`fetch` direto na API REST deles,
  sem SDK — mesma filosofia do ADR-001 de evitar dependência desnecessária)
  um link para `/primeiro-acesso?token=...`.
- Comprador define a senha nessa página; token expira e é de uso único
  (verificado por `tipo: "primeiro_acesso"` + expiração; não há re-uso
  porque definir a senha tira a conta do estado "aguardando").
- Se o e-mail já tem conta com senha definida (ex: recompra/renovação), o
  webhook faz upsert sem mexer na senha nem reenviar e-mail de primeiro
  acesso.

## Alternativas consideradas

- **Confiar no redirecionamento pós-compra da Kiwify com parâmetros na URL**
  — mais simples, mas a documentação pública não confirma quais parâmetros
  são enviados nem garante que sejam autenticáveis (ex: só e-mail, sem prova
  de posse). Um atacante poderia tentar "resgatar" a conta de outra pessoa
  sabendo o e-mail dela. Descartada por insegurança.
- **Senha temporária gerada e mostrada em algum lugar sem e-mail** — não há
  "lugar" pra mostrar, já que o webhook é server-to-server, sem UI. Não
  resolve o problema.
- **NextAuth/Auth.js com provider de e-mail** — resolveria mas traz a
  dependência maior descartada no ADR-001 pelos mesmos motivos.

## Consequências

- Fica possível vender de verdade: comprou → webhook cria conta → e-mail →
  comprador define senha → loga.
- Fica mais fácil, no futuro, reusar o mesmo token de "primeiro acesso" para
  um fluxo de "esqueci minha senha" (mesma infraestrutura).
- Nova dependência externa: Resend (free tier). Falha ao enviar e-mail (rate
  limit, API fora do ar) deixa a conta criada mas sem e-mail enviado — sem
  reenvio automático nesta versão (ver tech-debt).
- Sem teste automatizado que valide o payload real da Kiwify (documentação
  pública incompleta) — testado com o formato inferido de exemplos de
  terceiros; validar com o botão "Testar Webhook" da Kiwify antes do
  primeiro lançamento real.

## Referências

- `.harness/tech-debt/log.md` — TD-0007.
- `.harness/adr/ADR-001-autenticacao-e-sessao.md` — infraestrutura de token
  reaproveitada aqui.
- Pesquisa: `docs.kiwify.com.br`, `ajuda.kiwify.com.br`, exemplos de
  integração de terceiros (payload `Customer.full_name`/`Customer.email`).

## Amendment — 2026-07-21: Resend trocado por Gmail SMTP

Na hora de configurar o envio real, faltava um domínio próprio verificado —
o Resend exige registros DNS (SPF/DKIM) que só o dono do domínio consegue
cadastrar, e um subdomínio `*.vercel.app` não permite isso (DNS não é do
usuário). Sem domínio disponível no momento do lançamento, trocado o
provider de e-mail transacional de Resend para **Gmail SMTP**, usando a
caixa já existente `enemzasuporte@gmail.com` com uma "Senha de app" (exige
verificação em duas etapas). `src/lib/email.ts` agora usa `nodemailer` via
`smtp.gmail.com:465` em vez de `fetch` na API REST do Resend — a assinatura
da função (`enviarEmail({para, assunto, html})`) não mudou, então
`webhook-kiwify.ts` e os testes que mockam `@/lib/email` não precisaram de
alteração.

Trade-off aceito conscientemente: limite prático do Gmail (~500 e-mails/dia
por conta, bem acima do volume esperado do MVP) e deliverability um pouco
mais sujeita a spam-filtering do que um domínio próprio autenticado — ver
`.harness/tech-debt/log.md` (TD-0010, atualizado). Reavaliar Resend (ou
outro provider) quando houver domínio próprio verificado.

## Amendment — 2026-08-05: outbox de e-mail de primeiro acesso (TD-0010)

Antes, o envio do e-mail era inline no webhook: falhou o SMTP e a conta
ficava criada **sem** e-mail e **sem** registro de tentativa — o comprador
pagou e nunca recebeu o link. Agora todo envio passa por um outbox:

- **Tabela nova `EmailPrimeiroAcesso`** (1 registro por usuário): `status`
  (`pendente`/`enviado`/`falhou`), `tentativas`, `proximaTentativaEm`,
  `ultimoErro`. Status validado em duas camadas (Zod + `CHECK` constraint
  `email_primeiro_acesso_status_valido`), seguindo a filosofia de
  `.harness/boundaries.md`.
- **Webhook**: valida `webhook_event_type` (`compra_aprovada`) — eventos
  diferentes são reconhecidos e descartados com 2xx (rede de segurança além
  do filtro no painel da Kiwify). Registra o outbox, tenta enviar 1x e
  **responde 2xx sempre**; falha de e-mail não lança mais 500. Payload fora
  do schema retorna 400 (erro permanente — a Kiwify para de retentar); erro
  transitório (banco) segue 500 e a Kiwify reenvia.
- **Dreno**: reenvia os `pendente` vencidos com backoff exponencial
  (1, 2, 4... min, teto 2^8) até `MAX_TENTATIVAS = 5`, quando vira DLQ
  (`falhou`), retomada só por novo evento de webhook. O dreno roda no
  próprio webhook (self-healing, funciona no plano gratuito da Vercel) e na
  rota `/api/cron/reenviar-emails` (Vercel Cron, `vercel.json` — só executa
  no plano Pro; protegida por `CRON_SECRET`).
- **Idempotência**: a mensagem da Kiwify reenviada tem `id` que muda a cada
  retry, então a deduplicação é por `usuarioId`/e-mail (upsert do usuário +
  outbox único), não pelo `id` do payload.

