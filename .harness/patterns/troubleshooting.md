# Padrão — Troubleshooting (Enemza)

## "Too many connections" no Postgres (Neon) via Vercel

**Sintoma**: erros intermitentes de conexão ao banco em produção,
piorando sob tráfego.

**Causa provável**: Prisma abrindo conexão direta tradicional em função
serverless da Vercel — cada invocação pode abrir uma nova conexão, e
Postgres tradicional tem pool fixo baixo. É exatamente o motivo pelo qual
o projeto usa Neon (serverless) em vez de Postgres tradicional.

**Verificar**:
- A `DATABASE_URL` está apontando para o endpoint **pooled** do Neon (ou
  Prisma Accelerate), não a conexão direta.
- `PrismaClient` está sendo instanciado como singleton (padrão recomendado
  do Prisma para Next.js) e não recriado a cada invocação sem necessidade.

## Rate limit do Gemini durante o pipeline em lote

**Sintoma**: pipeline de categorização de vídeo ou geração de questões
falha no meio da execução com erro 429/quota.

**Causa provável**: free tier do Gemini tem cota diária e rate limit por
minuto baixos — lote grande (ex: 150 vídeos, ou centenas de questões com 2
chamadas cada) pode estourar isso numa única execução.

**Ação**: aplicar backoff/retry (ver `patterns/error-handling.md`),
considerar rodar o lote em múltiplas execuções ao longo do dia em vez de
uma corrida única, e monitorar consumo de cota (ver
`patterns/monitoring.md`) antes de disparar um lote grande.

## Vídeo embutido não carrega

**Sintoma**: player de uma Aula específica não carrega o iframe do
YouTube.

**Causa provável**: vídeo removido/tornado privado pelo canal de origem
após a curadoria inicial, ou restrição de região.

**Ação**: tratar como estado esperado (ver `patterns/error-handling.md`),
não como bug do app. Não tentar contornar baixando/cacheando uma cópia —
proibido por ToS (ver `boundaries.md`).

## Nota criada sem módulo nem aula (ou com os dois)

**Sintoma**: erro 500 vindo da constraint `nota_referencia_exclusiva` do
banco, não um 400 de validação.

**Causa provável**: alguma rota está inserindo `Nota` sem passar pela
validação Zod da camada de aplicação (bug de implementação, não de
schema). A constraint SQL está fazendo seu trabalho de rede de segurança.

**Ação**: localizar o caminho de código que fez o insert sem validação
Zod e corrigir ali — nunca remover ou afrouxar a constraint do banco para
"resolver" o erro.
