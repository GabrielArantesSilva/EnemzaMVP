export type AreaEnem = "Linguagens" | "Matemática" | "Humanas" | "Natureza";

export type ModuloProgresso = {
  id: string;
  nome: string;
  corHex: string;
  totalAulas: number;
  aulasConcluidas: number;
  area: AreaEnem;
  incidencia: "Essencial" | "Alta" | "Média";
  ordem: number;
};

export type ProximaAula = {
  id: string;
  titulo: string;
  moduloId: string;
  moduloNome: string;
  moduloCorHex: string;
  ordem: number;
};

export type ResumoUsuario = {
  nivel: number;
  modulosConcluidos: number;
  xpTotal: number;
  nome: string;
  totalAulasConcluidas: number;
  totalAulasGeral: number;
  proximaAula: ProximaAula | null;
};
