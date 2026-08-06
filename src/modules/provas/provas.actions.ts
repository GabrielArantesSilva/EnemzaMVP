"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { lerSessao } from "@/lib/sessao";
import type { ResultadoProva } from "./provas.types";

const SubmeterProvaSchema = z.object({
  provaId: z.string().min(1),
  respostas: z.record(z.string(), z.string()),
});

// usuarioId vem só da sessão — nunca de parâmetro do client (ver TD-0009 / ADR-001).
export async function submeterProva(
  input: z.infer<typeof SubmeterProvaSchema>,
): Promise<ResultadoProva> {
  const sessao = await lerSessao();
  if (!sessao) {
    throw new Error("Sessão inválida.");
  }
  const { usuarioId } = sessao;

  const { provaId, respostas } = SubmeterProvaSchema.parse(input);

  const prova = await prisma.prova.findUniqueOrThrow({
    where: { id: provaId },
    select: { modulo: { select: { nome: true } } },
  });

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

  const acertos = detalhe.filter((item) => item.correta).length;
  const total = questoes.length;

  // Persiste a tentativa no histórico — alimenta o feed e as estatísticas do
  // Perfil (taxa de acerto). `titulo` é snapshot com o nome do módulo.
  await prisma.historicoEstudo.create({
    data: {
      usuarioId,
      tipo: "prova",
      referenciaId: provaId,
      titulo: `Prova de ${prova.modulo.nome}`,
      acertos,
      totalQuestoes: total,
    },
  });

  revalidatePath("/perfil");

  return {
    total,
    acertos,
    detalhe,
  };
}
