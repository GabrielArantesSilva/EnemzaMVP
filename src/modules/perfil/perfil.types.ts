export type XpPorMateria = {
  id: string;
  nome: string;
  corHex: string;
  xp: number;
  xpMaximo: number;
};

export type PerfilUsuario = {
  nome: string;
  email: string;
  xpTotal: number;
  nivel: number;
  planoExpiraEm: Date | null; // null = nunca comprou — ver src/lib/plano.ts
  xpPorMateria: XpPorMateria[];
};
