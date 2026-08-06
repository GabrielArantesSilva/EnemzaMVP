import { prisma } from "@/lib/prisma";
import type { PerfilUsuario } from "./perfil.types";

export async function getPerfilUsuario(usuarioId: string): Promise<PerfilUsuario> {
  const usuario = await prisma.usuario.findUniqueOrThrow({
    where: { id: usuarioId },
    select: { nome: true, email: true, xpTotal: true, nivel: true, planoExpiraEm: true },
  });

  const modulos = await prisma.modulo.findMany({
    orderBy: { ordem: "asc" },
    select: {
      id: true,
      nome: true,
      corHex: true,
      aulas: { select: { xpRecompensa: true } },
      xpMateria: { where: { usuarioId }, select: { xp: true } },
    },
  });

  const xpPorMateria = modulos.map((modulo) => ({
    id: modulo.id,
    nome: modulo.nome,
    corHex: modulo.corHex,
    xp: modulo.xpMateria[0]?.xp ?? 0,
    xpMaximo: modulo.aulas.reduce((soma, aula) => soma + aula.xpRecompensa, 0),
  }));

  return {
    nome: usuario.nome,
    email: usuario.email,
    xpTotal: usuario.xpTotal,
    nivel: usuario.nivel,
    planoExpiraEm: usuario.planoExpiraEm,
    xpPorMateria,
  };
}
