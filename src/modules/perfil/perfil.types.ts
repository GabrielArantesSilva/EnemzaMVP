export type XpPorMateria = {
  id: string;
  nome: string;
  corHex: string;
  xp: number;
  xpMaximo: number;
};

export type EstatisticasEstudo = {
  aulasConcluidas: number;
  provasFeitas: number;
  taxaAcerto: number | null; // 0–100 (arredondado); null = nenhuma prova ainda
};

export type ItemHistorico = {
  id: string;
  tipo: "aula" | "prova";
  titulo: string;
  acertos: number | null;
  totalQuestoes: number | null;
  criadoEm: Date;
};

export type PerfilUsuario = {
  nome: string;
  email: string;
  xpTotal: number;
  nivel: number;
  planoExpiraEm: Date | null; // null = nunca comprou — ver src/lib/plano.ts
  xpPorMateria: XpPorMateria[];
  estatisticas: EstatisticasEstudo;
  historico: ItemHistorico[];
};
