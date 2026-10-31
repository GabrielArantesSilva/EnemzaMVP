import { prisma } from "@/lib/prisma";
import type { ModuloProgresso, ResumoUsuario, ProximaAula } from "./inicio.types";
import { AREA_POR_MODULO, INCIDENCIA_POR_MODULO } from "./inicio.constants";

export async function getModulosComProgresso(
  usuarioId: string,
): Promise<ModuloProgresso[]> {
  const modulos = await prisma.modulo.findMany({
    orderBy: { ordem: "asc" },
    select: {
      id: true,
      nome: true,
      corHex: true,
      ordem: true,
      aulas: {
        select: {
          id: true,
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
    ordem: modulo.ordem,
    area: AREA_POR_MODULO[modulo.nome] ?? "Linguagens",
    incidencia: INCIDENCIA_POR_MODULO[modulo.nome] ?? "Alta",
    totalAulas: modulo.aulas.length,
    aulasConcluidas: modulo.aulas.filter((aula) => aula.progressoAulas[0]?.concluida)
      .length,
  }));
}

export async function getResumoUsuario(usuarioId: string): Promise<ResumoUsuario> {
  const usuario = await prisma.usuario.findUniqueOrThrow({
    where: { id: usuarioId },
    select: {
      id: true,
      nome: true,
      nivel: true,
      xpTotal: true,
      progressoAulas: {
        where: { concluida: true },
        select: { aulaId: true },
      },
    },
  });

  // Busca a primeira aula não concluída para recomendar como "Próxima Aula"
  const aulasNaoConcluidas = await prisma.aula.findFirst({
    where: {
      progressoAulas: {
        none: {
          usuarioId,
          concluida: true,
        },
      },
    },
    orderBy: [
      { modulo: { ordem: "asc" } },
      { ordem: "asc" },
    ],
    select: {
      id: true,
      titulo: true,
      ordem: true,
      modulo: {
        select: {
          id: true,
          nome: true,
          corHex: true,
        },
      },
    },
  });

  const totalAulasGeral = await prisma.aula.count();

  let proximaAula: ProximaAula | null = null;
  if (aulasNaoConcluidas) {
    proximaAula = {
      id: aulasNaoConcluidas.id,
      titulo: aulasNaoConcluidas.titulo,
      moduloId: aulasNaoConcluidas.modulo.id,
      moduloNome: aulasNaoConcluidas.modulo.nome,
      moduloCorHex: aulasNaoConcluidas.modulo.corHex,
      ordem: aulasNaoConcluidas.ordem,
    };
  }

  return {
    nome: usuario.nome,
    nivel: usuario.nivel,
    xpTotal: usuario.xpTotal,
    modulosConcluidos: usuario.nivel,
    totalAulasConcluidas: usuario.progressoAulas.length,
    totalAulasGeral,
    proximaAula,
  };
}
