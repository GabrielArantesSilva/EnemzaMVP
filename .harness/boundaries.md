# Boundaries — Enemza

Limites que qualquer agente de IA (Claude Code ou outro) deve respeitar
neste projeto, independente do que for pedido numa tarefa pontual.

## Nunca implementar

- **Cache/download offline de vídeo do YouTube.** Não é decisão de
  produto — é restrição de ToS da API/embed do YouTube. Vídeo sempre via
  iframe/YouTube IFrame API. Se uma tarefa pedir "salvar vídeo para
  assistir offline", recusar e explicar a restrição, apontando para
  `context.md`.
- **Ranking ou qualquer exposição social entre usuários** (leaderboard,
  comparação de XP, perfis públicos). XP e nível são estritamente pessoais.
- **Correção de redação.** Fora de escopo do MVP — não iniciar essa
  feature mesmo que pareça natural encaixar (ex: ao mexer em `Prova`).

## Sempre respeitar

- **Regra de exclusividade da `Nota`**: exatamente um entre `moduloId` e
  `aulaId` preenchido, nunca os dois, nunca nenhum. Isso é validado em
  **duas camadas** — Zod na aplicação **e** `CHECK` constraint via SQL raw
  na migration. Nunca remover uma camada assumindo que a outra basta; são
  redes de segurança independentes (aplicação pode ter bug; constraint
  protege o dado mesmo com bypass da API).
- **Pipeline de LLM roda em lote, nunca em tempo real por ação de usuário
  final.** Categorização de vídeo e geração de questões têm custo variável
  por chamada — nunca disparar essas chamadas a partir de uma rota
  acessada por usuário final sem revisão explícita de custo/rate limit.
- **Double-check de questões geradas por LLM é obrigatório e não pode ser
  pulado.** Toda questão com `fonte = "LLM"` só é persistida com
  `validadaDouble = true`. Se a segunda chamada divergir da primeira, a
  questão é descartada e regenerada — nunca persistida "mesmo assim".
- **Dados pessoais (`nome`, `email`) sob LGPD**: não logar em plaintext,
  não expor em endpoints que não precisem deles, considerar exclusão de
  conta desde o desenho de schema/API (ver `patterns/security.md`).
- **Conexão com Postgres em ambiente serverless (Vercel)**: usar sempre o
  pooler do Neon (ou Prisma Accelerate) — nunca uma conexão direta
  tradicional, que estoura limite de conexões em function serverless.

## Decisões já tomadas — não reabrir sem novo ADR

- Next.js 15 (App Router) + Vercel + Neon + Prisma é a stack confirmada.
  Não propor troca de stack numa tarefa pontual — isso exige ADR.
- Gemini (free tier) é o provider de LLM do pipeline de conteúdo nesta
  fase. Trocar de provider é decisão arquitetural, não um detalhe de
  implementação — passar por `adr-skill.md` se for cogitado.
- Fonte mista de questões (INEP prioritário para exatas, LLM para o
  resto) é intencional, não um atalho temporário.

## Quando escalar em vez de decidir sozinho

- Qualquer mudança que reintroduza cache de vídeo, ranking ou redação no
  MVP.
- Qualquer chamada de LLM fora do fluxo de lote batch (ex: um endpoint
  novo que chama Gemini síncrono por request de usuário).
- Qualquer alteração na regra de exclusividade de `Nota` ou remoção da
  constraint SQL.
