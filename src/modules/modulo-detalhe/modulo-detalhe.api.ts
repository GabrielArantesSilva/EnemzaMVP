import { prisma } from "@/lib/prisma";
import type { ModuloComAulas } from "./modulo-detalhe.types";

export async function getModuloComAulas(
  moduloId: string,
  usuarioId: string,
): Promise<ModuloComAulas> {
  const [modulo, prova] = await Promise.all([
    prisma.modulo.findUniqueOrThrow({
      where: { id: moduloId },
      select: {
        id: true,
        nome: true,
        corHex: true,
        aulas: {
          orderBy: { ordem: "asc" },
          select: {
            id: true,
            titulo: true,
            progressoAulas: { where: { usuarioId }, select: { concluida: true } },
          },
        },
      },
    }),
    prisma.prova.findFirst({ where: { moduloId }, select: { id: true } }),
  ]);

  return {
    id: modulo.id,
    nome: modulo.nome,
    corHex: modulo.corHex,
    aulas: modulo.aulas.map((aula) => ({
      id: aula.id,
      titulo: aula.titulo,
      concluida: aula.progressoAulas[0]?.concluida ?? false,
    })),
    provaId: prova?.id ?? null,
  };
}
