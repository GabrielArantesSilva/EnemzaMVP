export interface QuestaoInep {
  ano: number;
  indice: number;
  disciplina: string;
  enunciado: string;
  temImagem: boolean;
  alternativas: { letra: string; texto: string }[];
  gabarito: string;
}
