export type NotaComMateria = {
  id: string;
  conteudo: string;
  atualizadoEm: Date;
  materia: { id: string; nome: string; corHex: string };
  aula: { id: string; titulo: string } | null;
};
