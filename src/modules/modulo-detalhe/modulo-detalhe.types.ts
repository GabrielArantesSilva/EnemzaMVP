export type AulaDaLista = {
  id: string;
  titulo: string;
  concluida: boolean;
};

export type ModuloComAulas = {
  id: string;
  nome: string;
  corHex: string;
  aulas: AulaDaLista[];
  provaId: string | null;
};
