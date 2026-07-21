import type {
  MontarProvaFinalInput,
  QuestaoParaPersistir,
  ResultadoMontagem,
} from "./montagem-prova.types";

export const QUESTOES_ALVO_POR_PROVA = 10;
export const QUESTOES_MINIMAS_POR_PROVA = 6;

// Ver .harness/context.md — INEP prioritário só nestas 3, decisão que não
// deve ser reaberta sem novo ADR (ver .harness/boundaries.md).
export const DISCIPLINAS_COM_INEP = ["Matemática", "Física", "Química"];

export function montarProvaFinal({
  moduloNome,
  questoesInep,
  questoesLlmValidadas,
}: MontarProvaFinalInput): ResultadoMontagem {
  const usaInep = DISCIPLINAS_COM_INEP.includes(moduloNome);
  const inepSelecionadas = usaInep ? questoesInep.slice(0, QUESTOES_ALVO_POR_PROVA) : [];

  const faltam = QUESTOES_ALVO_POR_PROVA - inepSelecionadas.length;
  const llmSelecionadas = questoesLlmValidadas.slice(0, Math.max(faltam, 0));

  const questoes: QuestaoParaPersistir[] = [
    ...inepSelecionadas.map((questao) => ({
      fonte: "INEP" as const,
      enunciado: questao.enunciado,
      alternativas: questao.alternativas,
      gabarito: questao.gabarito,
      validadaDouble: false,
    })),
    ...llmSelecionadas.map((questao) => ({
      fonte: "LLM" as const,
      enunciado: questao.enunciado,
      alternativas: questao.alternativas,
      gabarito: questao.gabarito,
      validadaDouble: true as const,
    })),
  ];

  if (questoes.length < QUESTOES_MINIMAS_POR_PROVA) {
    return {
      ok: false,
      erro: `Módulo "${moduloNome}" ficou com ${questoes.length} questão(ões), abaixo do mínimo de ${QUESTOES_MINIMAS_POR_PROVA}.`,
      deficit: QUESTOES_MINIMAS_POR_PROVA - questoes.length,
    };
  }

  return { ok: true, questoes };
}
