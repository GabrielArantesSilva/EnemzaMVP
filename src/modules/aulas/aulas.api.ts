import { prisma } from "@/lib/prisma";
import type { AulaDetalhe } from "./aulas.types";

export async function getAulaDetalhe(
  aulaId: string,
  usuarioId: string,
): Promise<AulaDetalhe> {
  const aula = await prisma.aula.findUniqueOrThrow({
    where: { id: aulaId },
    select: {
      id: true,
      titulo: true,
      youtubeUrl: true,
      xpRecompensa: true,
      ordem: true,
      modulo: { select: { id: true, nome: true, corHex: true } },
      progressoAulas: {
        where: { usuarioId },
        select: { concluida: true },
      },
      notas: {
        where: { usuarioId },
        orderBy: { atualizadoEm: "desc" },
        select: { id: true, conteudo: true, atualizadoEm: true },
      },
    },
  });

  const aulasDoModulo = await prisma.aula.findMany({
    where: { moduloId: aula.modulo.id },
    orderBy: { ordem: "asc" },
    select: { id: true },
  });
  const indiceAtual = aulasDoModulo.findIndex((item) => item.id === aula.id);

  return {
    id: aula.id,
    titulo: aula.titulo,
    youtubeUrl: aula.youtubeUrl,
    xpRecompensa: aula.xpRecompensa,
    concluida: aula.progressoAulas[0]?.concluida ?? false,
    modulo: aula.modulo,
    notas: aula.notas,
    aulaAnteriorId: aulasDoModulo[indiceAtual - 1]?.id ?? null,
    aulaProximaId: aulasDoModulo[indiceAtual + 1]?.id ?? null,
  };
}
