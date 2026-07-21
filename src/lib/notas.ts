"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { lerSessao } from "@/lib/sessao";

// Espelha a CHECK constraint "nota_referencia_exclusiva" do banco (rede de
// segurança final) — ver .harness/boundaries.md.
const CriarNotaSchema = z
  .object({
    conteudo: z.string().min(1, "A nota não pode ficar vazia."),
    moduloId: z.string().min(1).nullish(),
    aulaId: z.string().min(1).nullish(),
  })
  .refine((dados) => Boolean(dados.moduloId) !== Boolean(dados.aulaId), {
    message: "Informe exatamente um entre módulo e aula.",
  });

type CriarNotaInput = z.infer<typeof CriarNotaSchema>;

// usuarioId vem só da sessão — nunca de parâmetro do client (ver TD-0009 / ADR-001).
export async function criarNota(input: CriarNotaInput) {
  const sessao = await lerSessao();
  if (!sessao) {
    throw new Error("Sessão inválida.");
  }

  const dados = CriarNotaSchema.parse(input);

  const nota = await prisma.nota.create({
    data: {
      usuarioId: sessao.usuarioId,
      conteudo: dados.conteudo,
      moduloId: dados.moduloId ?? null,
      aulaId: dados.aulaId ?? null,
    },
  });

  revalidatePath("/anotacoes");
  if (dados.aulaId) revalidatePath(`/aulas/${dados.aulaId}`);

  return nota;
}
