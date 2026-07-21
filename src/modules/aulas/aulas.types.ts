export type NotaDaAula = {
  id: string;
  conteudo: string;
  atualizadoEm: Date;
};

export type AulaDetalhe = {
  id: string;
  titulo: string;
  youtubeUrl: string;
  xpRecompensa: number;
  concluida: boolean;
  modulo: { id: string; nome: string; corHex: string };
  notas: NotaDaAula[];
  aulaAnteriorId: string | null;
  aulaProximaId: string | null;
};
