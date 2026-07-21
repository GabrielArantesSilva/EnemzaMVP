export interface QuestaoGerada {
  enunciado: string;
  alternativas: { letra: string; texto: string }[];
  gabarito: string;
}

export interface QuestaoValidada extends QuestaoGerada {
  validadaDouble: true;
}
