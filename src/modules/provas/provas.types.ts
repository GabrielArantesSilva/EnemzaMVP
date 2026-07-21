export type Alternativa = { letra: string; texto: string };

export type QuestaoParaResponder = {
  id: string;
  enunciado: string;
  alternativas: Alternativa[];
};

export type ProvaParaResponder = {
  id: string;
  questoes: QuestaoParaResponder[];
};

export type ResultadoQuestao = {
  questaoId: string;
  correta: boolean;
  gabarito: string;
  escolhida: string | null;
};

export type ResultadoProva = {
  total: number;
  acertos: number;
  detalhe: ResultadoQuestao[];
};
