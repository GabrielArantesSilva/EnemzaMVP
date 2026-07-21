import { prisma } from "@/lib/prisma";
import type { ModuloProgresso } from "./inicio.types";

export async function getModulosComProgresso(
  usuarioId: string,
): Promise<ModuloProgresso[]> {
  const modulos = await prisma.modulo.findMany({
    orderBy: { ordem: "asc" },
    select: {
      id: true,
      nome: true,
      corHex: true,
      aulas: {
        select: {
          progressoAulas: {
            where: { usuarioId },
            select: { concluida: true },
          },
        },
      },
    },
  });

  return modulos.map((modulo) => ({
    id: modulo.id,
    nome: modulo.nome,
    corHex: modulo.corHex,
    totalAulas: modulo.aulas.length,
    aulasConcluidas: modulo.aulas.filter((aula) => aula.progressoAulas[0]?.concluida)
      .length,
  }));
}

export async function getResumoUsuario(usuarioId: string) {
  // Nivel = contagem de módulos 100% concluídos (não é XP) — ver domain-glossary.md.
  const usuario = await prisma.usuario.findUniqueOrThrow({
    where: { id: usuarioId },
    select: { nivel: true },
  });

  return { nivel: usuario.nivel, modulosConcluidos: usuario.nivel };
}
