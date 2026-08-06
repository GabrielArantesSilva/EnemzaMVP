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

## Histórico de estudos

- `HistoricoEstudo` registra uma linha por aula concluída (`tipo = "aula"`,
  gravado em `concluirAula`, só na primeira conclusão) e por prova submetida
  (`tipo = "prova"`, gravado em `submeterProva` com `acertos`/
  `totalQuestoes`).
- Alimenta o Perfil: seção "Histórico de estudos" (últimos 20 eventos) e
  estatísticas (aulas concluídas, provas feitas, taxa de acerto).
- `titulo` é snapshot (não é FK): permanece correto se o nome da fonte
  mudar.

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
- Paleta (azul do ENEM como identidade): azul-noite (fundo dark), azul como
  cor principal/CTA, amarelo como accent de XP/conquista, e as demais cores
  de apoio como identificação fixa de cada um dos 11 módulos (ver
  `src/core/styles/enemza.css`).
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
