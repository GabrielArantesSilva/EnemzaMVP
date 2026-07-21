import { prisma } from "@/lib/prisma";
import type { NotaComMateria } from "./anotacoes.types";

export async function getNotasComMateria(
  usuarioId: string,
): Promise<NotaComMateria[]> {
  const notas = await prisma.nota.findMany({
    where: { usuarioId },
    orderBy: { atualizadoEm: "desc" },
    include: {
      modulo: { select: { id: true, nome: true, corHex: true } },
      aula: {
        select: {
          id: true,
          titulo: true,
          modulo: { select: { id: true, nome: true, corHex: true } },
        },
      },
    },
  });

  // Nota tem moduloId XOR aulaId (regra de negócio — ver .harness/boundaries.md).
  // Quando vinculada à aula, a matéria de agrupamento vem do módulo da aula.
  return notas.map((nota) => {
    const materia = nota.modulo ?? nota.aula!.modulo;

    return {
      id: nota.id,
      conteudo: nota.conteudo,
      atualizadoEm: nota.atualizadoEm,
      materia,
      aula: nota.aula ? { id: nota.aula.id, titulo: nota.aula.titulo } : null,
    };
  });
}
