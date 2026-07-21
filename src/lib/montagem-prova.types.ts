import type { QuestaoValidada } from "./geracao-questao.types";

export interface QuestaoInepParaMontagem {
  enunciado: string;
  alternativas: { letra: string; texto: string }[];
  gabarito: string;
}

export interface QuestaoParaPersistir {
  fonte: "INEP" | "LLM";
  enunciado: string;
  alternativas: { letra: string; texto: string }[];
  gabarito: string;
  validadaDouble: boolean;
}

export interface MontarProvaFinalInput {
  moduloNome: string;
  questoesInep: QuestaoInepParaMontagem[];
  questoesLlmValidadas: QuestaoValidada[];
}

export type ResultadoMontagem =
  | { ok: true; questoes: QuestaoParaPersistir[] }
  | { ok: false; erro: string; deficit: number };
