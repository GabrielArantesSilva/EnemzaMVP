# Glossário de Domínio — Enemza

## Entidades principais

- **Módulo**: disciplina do ENEM (ex: Matemática, Biologia). 11 fixos no
  MVP, independentes entre si, sem pré-requisito. Tem `ordem` de exibição
  seguindo a área do ENEM (Linguagens → Matemática → Humanas → Natureza) e
  `corHex` de identificação fixa na UI.
- **Aula**: videoaula individual do YouTube, pertence a um único Módulo.
  Tem `canalOrigem` ("Curso Enem Gratuito" ou "ProEnem"), `ordem` dentro do
  módulo e `xpRecompensa` fixo (padrão 10).
- **Progresso (ProgressoAula)**: relação usuário↔aula indicando se foi
  concluída e quando. Único por par (usuário, aula).
- **Nota**: anotação em markdown do usuário, vinculada a **exatamente um**
  de Módulo ou Aula (nunca os dois, nunca nenhum — ver `boundaries.md`).
- **Prova**: conjunto de Questões associado a um Módulo, gerado ao final
  do módulo como fixação.
- **Questão**: item de uma Prova. `fonte` é `"INEP"` (banco público,
  gabarito confiável) ou `"LLM"` (gerada, requer `validadaDouble = true`
  antes de ser usável).
- **Usuário**: conta pessoal com `xpTotal` (soma geral) e `nivel` (=
  número de módulos completados).
- **XpMateria**: XP acumulado por usuário e por módulo — granularidade
  exibida na tela de Perfil.

## Termos de negócio

- **Double-check**: validação de uma Questão gerada por LLM através de uma
  segunda chamada independente (sem ver o gabarito da primeira) que
  resolve a questão do zero. Divergência → descarta e regenera.
- **Fonte mista**: estratégia de montagem de Prova que prioriza banco INEP
  para disciplinas exatas (Matemática, Física, Química) e usa geração LLM
  para completar as demais.
- **Canal de origem**: um dos 2 canais do YouTube curados manualmente
  ("Curso Enem Gratuito", "ProEnem"). É o único filtro de qualidade antes
  da classificação por LLM — não há revisão humana adicional no pipeline.
- **Nível**: contador de módulos 100% concluídos pelo usuário — não é um
  cálculo de XP acumulado, é literal contagem de módulos finalizados.
- **XP**: pontuação fixa por aula concluída, sem peso por duração ou
  dificuldade. Não alimenta nenhum ranking — é estritamente individual.

## O que este glossário deliberadamente NÃO cobre

- Redação: fora de escopo do MVP, sem modelo de dados ainda.
- Qualquer conceito de competição/ranking entre usuários: não existe no
  domínio do produto.
