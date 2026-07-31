# Enemza

PWA de estudo para o ENEM — videoaulas curadas do YouTube organizadas por
módulo, provas de fixação (INEP + geração via LLM com double-check
obrigatório) e anotações em markdown. Progresso via XP/nível pessoal, sem
ranking. Ver `.harness/context.md` para a visão completa de produto e
`.harness/adr/` para as decisões arquiteturais já tomadas.

## Stack

Next.js 15 (App Router) · Postgres serverless via Neon · Prisma · PWA
(next-pwa/Serwist) · autenticação e-mail/senha caseira (scrypt + cookie
HMAC, ver ADR-001) · Kiwify (checkout + webhook, ver ADR-002) · Gemini
(pipeline de conteúdo, ver ADR-003).

## Setup local

1. `pnpm install`
2. Copie `.env.example` para `.env` e preencha:
   - `DATABASE_URL`/`DIRECT_URL`: connection strings do Neon (dashboard →
     Connection Details). `DATABASE_URL` é o endpoint **pooled**
     (`-pooler`), usado em runtime; `DIRECT_URL` é o endpoint direto, usado
     só por `prisma migrate`.
   - `SESSION_SECRET`: gerar com `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
   - `GEMINI_API_KEY`/`YOUTUBE_API_KEY`: só necessários pra rodar o pipeline
     de conteúdo (`pipeline:*`), não pro app em si.
   - `KIWIFY_CHECKOUT_URL`/`KIWIFY_WEBHOOK_TOKEN`/`RESEND_API_KEY`/
     `EMAIL_REMETENTE`/`APP_URL`: só necessários pro fluxo de venda
     (webhook Kiwify → e-mail de primeiro acesso). Sem eles, o app roda
     normalmente, só o botão de venda em `/cadastro` mostra um aviso.
   - `NEXT_PUBLIC_POSTHOG_KEY`/`NEXT_PUBLIC_POSTHOG_HOST`: analytics de
     produto (PostHog Cloud, região EU). Opcional — sem a key, o app roda
     normal sem trackear nada.
3. `pnpm prisma:generate`
4. `pnpm prisma:migrate` (aplica as migrations no Neon)
5. `pnpm exec tsx prisma/seed.ts` (cria os 11 módulos + usuário demo —
   login impresso no console após rodar)
6. `pnpm dev` → http://localhost:3000

## Scripts

| Comando | O que faz |
|---|---|
| `pnpm dev` / `build` / `start` | Next.js dev/build/produção |
| `pnpm lint` / `typecheck` | ESLint / `tsc --noEmit` |
| `pnpm test` / `test:watch` | Vitest (sobe Postgres efêmero via testcontainers — precisa de Docker rodando) |
| `pnpm prisma:migrate` / `prisma:generate` / `prisma:studio` | Prisma |
| `pnpm seed:dev-fixtures` | Fixtures de dev (aulas/prova de teste) — **nunca rodar em produção** |

### Pipeline de conteúdo (`pipeline:*`)

Popula `Aula`/`Prova`/`Questao` reais a partir de fontes externas. Roda em
lote/offline (nunca em request de usuário — ver `boundaries.md`), é
resumível (interrompe e retoma sem duplicar) e depende de cota do Gemini
free tier, que é **por projeto Google**, não por chave — se travar em 429,
esperar o reset diário ou usar uma chave de outro projeto.

Ordem de execução:

1. `pipeline:buscar-videos` — metadata de vídeo dos canais curados (YouTube Data API).
2. `pipeline:extrair-transcripts` — transcript via endpoint não-oficial do YouTube (pode falhar por bloqueio de IP em lotes grandes — nesse caso, classificação cai pra usar só o título).
3. `pipeline:classificar-videos` — classifica cada vídeo num dos 11 módulos (Gemini).
4. `pipeline:persistir-aulas` — grava `Aula` (top N por módulo, por view count).
5. `pipeline:baixar-questoes-inep` — questões reais do ENEM via api.enem.dev (Matemática/Física/Química).
6. `pipeline:classificar-questoes-natureza` — sub-classifica "ciências da natureza" em Física/Química/Biologia (Gemini).
7. `pipeline:gerar-questoes-llm` — gera questões pras disciplinas sem INEP suficiente, com double-check obrigatório (Gemini).
8. `pipeline:persistir-provas` — monta `Prova` por módulo (fonte mista INEP+LLM, piso mínimo de 6 questões) e grava `Questao`.

Ver `.harness/adr/ADR-003-pipeline-conteudo.md` e `.harness/integrations/`
pros detalhes de cada fonte externa (api.enem.dev, YouTube timedtext,
Gemini).

## Harness

Contexto de produto, decisões arquiteturais (ADRs), padrões do time e
dívida técnica registrada vivem em `.harness/` — ler antes de qualquer
mudança de regra de negócio ou decisão arquitetural nova.
