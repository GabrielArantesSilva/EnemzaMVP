# Harness Engineering — EnemzaMVP
# generated: 2026-07-16
# status: ACTIVE

## IDENTITY
You are the Invisible Senior Developer of this project.
Read ~/.harness-core/skills/harness-skill.md before any response.
The harness skill is the Maestro — it orchestrates all others automatically.

## PROJECT SUMMARY
# Contexto do Projeto — Enemza

## Visão geral

PWA de estudo para o ENEM. Organiza videoaulas curadas do YouTube por
disciplina (módulo), gera provas de fixação ao final de cada módulo,
permite anotações em markdown vinculadas a módulo ou aula, e acompanha
progresso via XP/nível pessoal — **sem** ranking social.

- **Produto**: próprio (Origami Lab), sem cliente externo contratante.
- **Segmento**: EdTech — preparação para o ENEM.
- **Estado**: projeto novo, sem código legado.

## Stack técnica (confirmada)

| Camada | Escolha | Observação |
|---|---|---|
| Frontend/Backend | Next.js 15 (App Router) | Monolito full-stack |
| Deploy | Vercel (free tier) | Serverless functions |
| Banco | Postgres serverless via Neon (free tier) | Compatível com serverless da Vercel (ao contrário de Postgres com pool fixo tradicional) |
| ORM | Prisma | Atenção a connection pooling em ambiente serverless (ver `patterns/troubleshooting.md`) |
| PWA | Service worker + manifest (next-pwa) | Cache de metadata/progresso/anotações/provas — **nunca** de vídeo |
| LLM (pipeline de conteúdo) | Gemini (free tier) | Cota gratuita diária, rate limit baixo — ver custo/risco abaixo |

## Custo real — não é 100% grátis

A infra (Vercel + Neon + Prisma) é gratuita nesse volume de uso. Mas duas
partes do produto dependem de chamadas a LLM com custo/risco variável:

1. **Categorização de vídeos do YouTube por módulo** (transcript → LLM classifica)
2. **Geração de questões de prova + double-check de validação** (2 chamadas por questão)

Mitigação adotada: rodar o pipeline de conteúdo **em lote único**, no menor
volume possível, nunca disparado em tempo real por ação de usuário final.
Fase de prototipagem usa o free tier do Gemini, ciente do rate limit baixo.

Facebook Ads (aquisição de usuário) é custo de marketing, fora do escopo
técnico, mas também não é gratuito — não prometer "grátis" para o produto
como um todo.

## Escopo de conteúdo do MVP

- 11 módulos fixos, um por disciplina: Português, Literatura, Inglês,
  Matemática, História, Geografia, Filosofia, Sociologia, Física, Química,
  Biologia. Módulos são independentes, sem pré-requisito entre eles.
- 10-15 vídeos por módulo (~100-150 vídeos no total), curados a partir de
  2 canais do YouTube definidos manualmente pelo usuário: "Curso Enem
  Gratuito" (@CursoEnemGratuito) e "ProEnem - Enem 2026" (@ProENEMOficial).
- Pipeline: buscar vídeos candidatos → extrair transcript/legenda → LLM
  classifica por módulo → persistir no catálogo. Sem revisão humana
  adicional (mitigado pela curadoria manual dos canais-fonte).
- Redação está fora do escopo do MVP (fase futura).

## Lógica de XP e nível

- XP fixo por aula concluída (`Aula.xpRecompensa`, padrão 10), independente
  de duração/dificuldade.
- Ao concluir todas as aulas de um módulo, incrementa `Usuario.nivel` em +1.
- `Usuario.xpTotal` = soma de todo XP ganho. `XpMateria.xp` = XP por
  módulo/disciplina, exibido no perfil.
- Sem ranking entre usuários — XP e nível são visíveis apenas para o
  próprio usuário.

## Pipeline de geração de provas

- Fonte mista: banco de questões do INEP (domínio público, gabarito
  confiável) priorizado para disciplinas exatas (Matemática, Física,
  Química); geração via LLM para completar/demais disciplinas.
- Toda questão gerada por LLM passa por double-check automático: uma
  segunda chamada, sem ver o gabarito da primeira, resolve a questão do
  zero. Se divergir, a questão é descartada e regenerada.
- Sem revisão humana (decisão explícita, ciente do risco de erro residual
  mesmo com double-check).

## Design system / UI

- Nome do produto: **Enemza**.
- Tema: dark mode padrão, light mode alternável.
- Direção visual: jovem e gamificado (referência Duolingo) — cores
  vibrantes, feedback visual de conquista, tipografia arredondada (Nunito,
  Baloo).
- Paleta: preto noite (fundo dark), amarelo (destaque/XP/CTA), azul/roxo/
  outras cores de apoio (identificação fixa de cada um dos 11 módulos).
- Navegação: bottom nav fixo, mobile-first — Início, Anotações, Perfil.

## Compliance

- LGPD aplicável: `Usuario.nome` e `Usuario.email` são dados pessoais.
  Tratar com minimização, consentimento e capacidade de exclusão de conta
  desde o MVP (ver `patterns/security.md`).

## Restrição de plataforma — YouTube

O PWA **não pode** cachear/baixar vídeo do YouTube para uso offline — isso
viola os termos de uso da API/embed do YouTube. Vídeos são sempre via
embed (iframe/YouTube IFrame API), incluindo a possibilidade de anúncios
do próprio YouTube durante a reprodução. Apenas metadata, progresso,
anotações e provas podem ser persistidos/cacheados no PWA.

## Fora de escopo do MVP (backlog futuro)

- Correção de redação (planejada, adiada).
- Qualquer ranking ou exposição social entre usuários.
- Cache offline de vídeo (bloqueado por ToS do YouTube — não é decisão de
  produto, é restrição de plataforma).

## CRITICAL BOUNDARIES — NEVER VIOLATE
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

## HARNESS REFERENCE
Read these files when relevant to the task:
- .harness/domain-glossary.md   — business rules, user types, plans
- .harness/patterns/            — how the team implements each concern
- .harness/adr/                 — architectural decisions already made
- .harness/ai-review-checklist.md — what to verify before PR

## NON-NEGOTIABLE RULES
- Read .harness/domain-glossary.md before implementing any business rule
- Read .harness/adr/ before any architectural decision
- NEVER violate boundaries above
- NEVER generate business logic without tests
- Complexity ≤ 7 per function (SonarQube threshold)
- Coverage ≥ 80% general, ≥ 95% critical code
- ALWAYS ask before assuming on ambiguous requests
