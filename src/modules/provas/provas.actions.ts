"use server";

import { z } from "zod";

import { prisma } from "@/lib/prisma";
import type { ResultadoProva } from "./provas.types";

const SubmeterProvaSchema = z.object({
  provaId: z.string().min(1),
  respostas: z.record(z.string(), z.string()),
});

export async function submeterProva(
  input: z.infer<typeof SubmeterProvaSchema>,
): Promise<ResultadoProva> {
  const { provaId, respostas } = SubmeterProvaSchema.parse(input);

  const questoes = await prisma.questao.findMany({
    where: { provaId },
    select: { id: true, gabarito: true },
  });

  const detalhe = questoes.map((questao) => {
    const escolhida = respostas[questao.id] ?? null;
    return {
      questaoId: questao.id,
      correta: escolhida === questao.gabarito,
      gabarito: questao.gabarito,
      escolhida,
    };
  });

  return {
    total: questoes.length,
    acertos: detalhe.filter((item) => item.correta).length,
    detalhe,
  };
}
