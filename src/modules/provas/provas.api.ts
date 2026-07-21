import { prisma } from "@/lib/prisma";
import type { Alternativa, ProvaParaResponder } from "./provas.types";

export async function getProvaParaResponder(
  provaId: string,
): Promise<ProvaParaResponder> {
  const prova = await prisma.prova.findUniqueOrThrow({
    where: { id: provaId },
    select: {
      id: true,
      questoes: {
        select: { id: true, enunciado: true, alternativas: true },
      },
    },
  });

  return {
    id: prova.id,
    questoes: prova.questoes.map((questao) => ({
      id: questao.id,
      enunciado: questao.enunciado,
      alternativas: questao.alternativas as unknown as Alternativa[],
    })),
  };
}
