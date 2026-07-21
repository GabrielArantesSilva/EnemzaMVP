# ADR-001: Autenticação por e-mail/senha com sessão via cookie assinado

- **Status**: aceita
- **Data**: 2026-07-20
- **Decisor(es)**: Gabriel (Origami Lab)

## Contexto

O Enemza nunca teve autenticação real — `getUsuarioAtual()` sempre retornava
o usuário fixo do seed (`dev@enemza.local`), rastreado como dívida consciente
em `TD-0006`. A condição registrada para revisitar essa dívida era "antes de
qualquer deploy com mais de um usuário real" — e essa condição foi atingida:
o produto vai começar a ser vendido via Kiwify, o que significa múltiplos
compradores reais precisando de contas isoladas (progresso, XP, notas por
usuário).

Restrições relevantes:
- Deploy é Vercel serverless free tier — evitar dependências pesadas ou que
  exijam infraestrutura adicional (ex: serviço de e-mail transacional só
  para login).
- Sem orçamento para provider de e-mail nesta fase (descarta magic link como
  primeira opção).
- Stack já confirmada é Next.js 15 App Router — sem middleware Edge em uso
  hoje; adicionar dependência de sessão compatível com Edge runtime não é
  necessário se a validação de sessão continuar rodando em Server
  Components/Server Actions (runtime Node).

## Decisão

- **Autenticação**: e-mail + senha. Senha nunca armazenada em texto puro —
  hash via `scrypt` do módulo nativo `node:crypto` (sem dependência nova tipo
  bcrypt/argon2), formato persistido `salt:hash` em hex.
- **Sessão**: cookie httpOnly assinado com HMAC-SHA256 (`node:crypto`,
  segredo em `SESSION_SECRET`), contendo `usuarioId` e expiração. Sem
  biblioteca externa (NextAuth/Auth.js) — superfície pequena o suficiente
  para não justificar a dependência agora.
- **Vínculo com a Kiwify**: fora do escopo desta ADR (decisão futura), mas o
  desenho já assume que o fluxo será "webhook da Kiwify cria a `Usuario` pelo
  e-mail do comprador" — por isso o cadastro/login usam sempre o e-mail como
  identificador único (já é `@unique` no schema).
- **Exclusão de conta**: implementada junto (não é uma ADR separada) porque
  `patterns/security.md` exige suporte a exclusão desde o MVP e só fazia
  sentido construir isso quando autenticação passou a existir de fato.

## Alternativas consideradas

- **NextAuth.js (Auth.js v5)** — mais robusto e com suporte pronto a OAuth
  futuro (Google), mas adiciona uma dependência com configuração própria de
  sessão/adapter para um caso de uso hoje simples (e-mail/senha). Reavaliar
  se/quando login social for pedido.
- **Magic link (sem senha)** — remove gestão de senha, mas exige contratar
  provider de e-mail transacional (custo novo, fora do que está confirmado
  em `context.md`) e adiciona fricção de login recorrente. Descartado nesta
  fase.
- **Middleware Next.js para proteção de rota** — mais robusto a esquecer de
  proteger uma rota nova, mas cookies assinados com `node:crypto` exigem
  runtime Node; middleware roda em Edge por padrão. Como toda página já
  chama `getUsuarioAtual()` como primeira linha (padrão já estabelecido no
  código), a proteção por página foi suficiente e mais simples.

## Consequências

- Fica possível vender o produto sem todo comprador compartilhar a mesma
  conta — desbloqueia o uso da Kiwify.
- Fica mais fácil, no futuro, o webhook da Kiwify criar contas diretamente
  (mesma tabela `Usuario`, mesmo campo `email` único).
- Fica mais difícil adicionar login social sem revisar a decisão de sessão
  caseira (se isso for pedido, reabrir como novo ADR em vez de estender essa
  implementação).
- Nenhum custo novo de infraestrutura (scrypt e HMAC são nativos do Node,
  sem serviço externo).
- `TD-0006` é fechada por esta ADR.

## Referências

- `.harness/tech-debt/log.md` — TD-0006.
- `.harness/patterns/security.md` — exigência de exclusão de conta desde o
  MVP.
- `.harness/context.md` — Kiwify como canal de venda (contexto desta sessão).
