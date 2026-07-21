# ADR-003: Pipeline de conteúdo — fontes externas e integridade de dados

- **Status**: aceita
- **Data**: 2026-07-20
- **Decisor(es)**: Gabriel (Origami Lab)

## Contexto

`TD-0008`: o Enemza não tinha conteúdo real — só módulos (seed) e fixtures
de dev. Faltava implementar as duas metades do pipeline descrito em
`context.md`: vídeo → transcript → classificação por módulo (Gemini) →
`Aula`; e banco de questões (INEP prioritário pra Matemática/Física/Química,
LLM com double-check pro resto) → `Prova`/`Questao`.

Três integrações externas novas, nenhuma com código prévio no projeto — ver
`.harness/integrations/youtube-timedtext.md`, `enem-dev-api.md`,
`gemini-api.md` para o contrato completo de cada uma.

## Decisão

- **Fonte do banco INEP**: `api.enem.dev`, API pública/open-source (GPL-2.0)
  com questões reais do ENEM por ano — não é o INEP diretamente, é um
  wrapper de terceiro sobre dado público. Escolhida por já vir estruturada
  (enunciado/alternativas/gabarito em JSON) em vez de exigir OCR/parsing de
  PDF das provas oficiais do INEP.
- **Transcript de vídeo**: endpoint não-oficial `timedtext` do YouTube (sem
  chave/OAuth). Sem alternativa oficial viável — a Data API só permite
  baixar legenda de vídeo que o usuário autenticado possui.
- **Classificação e geração via Gemini**: REST direto (`generateContent`),
  sem SDK, usando `response_schema` pra forçar JSON estruturado — elimina
  parsing frágil de texto livre. Mesma filosofia dos ADR-001/002 (evitar
  dependência nova quando a API é simples o bastante pra `fetch` puro).
- **Correção de integridade de schema** (ver migration
  `20260720020000_integridade_conteudo`):
  - `Prova` ganhou `@@unique([moduloId])` — o read-side
    (`modulo-detalhe.api.ts`) já fazia `findFirst` sem `orderBy`, ou seja,
    não-determinístico com mais de uma Prova por módulo. Sem essa
    constraint, o próprio pipeline exporia esse bug na primeira vez que
    rodasse mais de uma vez.
  - `Aula` ganhou `@@unique([moduloId, youtubeUrl])` — mesma classe de
    risco, necessária pra `persistir-aulas.ts` fazer upsert idempotente.
  - `Questao` ganhou `CHECK (fonte <> 'LLM' OR "validadaDouble" = true)` —
    mesma dupla camada (Zod/aplicação + SQL) que `Nota` já tinha por
    precedente do próprio projeto (`nota_referencia_exclusiva`); antes desta
    ADR, a garantia de double-check dependia inteiramente de nenhum bug
    existir em `persistir-provas.ts`.
- **Piso mínimo de questões por prova**: 10 questões-alvo, mínimo 6. Abaixo
  disso, `persistir-provas.ts` recusa persistir/sobrescrever aquele módulo
  e loga como pendente — nunca cria prova incompleta silenciosamente.
- **Scripts resumíveis**: escrita atômica (`*.tmp` + rename) e incremental
  nos JSONs intermediários em `scripts/output/`, com resumability por chave
  natural (vídeo/questão já processado) ou por contagem de válidas já
  geradas (questão LLM, que não tem id prévio) — necessário porque o rate
  limit do free tier do Gemini pode cortar um lote no meio.

## Alternativas consideradas

- **Usar diretamente PDFs oficiais do INEP** — mais "primário", mas exige
  parsing de PDF/OCR, esforço muito maior pro MVP. Descartado por agora;
  `api.enem.dev` já resolve o mesmo problema com dado estruturado.
- **Ignorar o gap de unicidade em `Prova`/`Aula`** e confiar só em disciplina
  do pipeline pra nunca duplicar — rejeitado porque contradiz o próprio
  precedente do projeto (`Nota` já tem essa dupla camada) e porque rate
  limit baixo torna reruns parciais o cenário normal, não uma exceção.

## Consequências

- Produto passa a ter aulas e provas reais — desbloqueia o uso comercial
  pela Kiwify.
- `api.enem.dev` é uma dependência de terceiro sem SLA — se sair do ar ou
  mudar de formato, `baixar-questoes-inep.ts` quebra (ver
  `enem-dev-api.md`).
- `timedtext` é não-documentado — pode parar de funcionar sem aviso (ver
  `youtube-timedtext.md`); nesse caso, classificação de vídeo cai pra usar
  só o título.
- `Prova`/`Aula`/`Questao` agora têm proteção de integridade equivalente à
  de `Nota` — reduz a superfície de bugs "silenciosos" em reruns futuros do
  pipeline.

## Referências

- `.harness/tech-debt/log.md` — TD-0008.
- `.harness/context.md` — descrição original do pipeline de conteúdo.
- `.harness/boundaries.md` — regra de double-check obrigatório e fonte
  mista intencional.
