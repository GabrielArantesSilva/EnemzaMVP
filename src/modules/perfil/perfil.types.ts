export type XpPorMateria = {
  id: string;
  nome: string;
  corHex: string;
  xp: number;
  xpMaximo: number;
};

export type PerfilUsuario = {
  nome: string;
  xpTotal: number;
  nivel: number;
  xpPorMateria: XpPorMateria[];
};
