"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { lerSessao } from "@/lib/sessao";

// usuarioId vem só da sessão — nunca de parâmetro do client (ver TD-0009 / ADR-001).
export async function concluirAula(aulaId: string) {
  const sessao = await lerSessao();
  if (!sessao) {
    throw new Error("Sessão inválida.");
  }
  const { usuarioId } = sessao;

  await prisma.$transaction(async (tx) => {
    const progresso = await tx.progressoAula.findUnique({
      where: { usuarioId_aulaId: { usuarioId, aulaId } },
    });

    if (progresso?.concluida) return;

    const aula = await tx.aula.findUniqueOrThrow({
      where: { id: aulaId },
      select: { moduloId: true, xpRecompensa: true },
    });

    await tx.progressoAula.upsert({
      where: { usuarioId_aulaId: { usuarioId, aulaId } },
      update: { concluida: true, concluidaEm: new Date() },
      create: { usuarioId, aulaId, concluida: true, concluidaEm: new Date() },
    });

    await tx.usuario.update({
      where: { id: usuarioId },
      data: { xpTotal: { increment: aula.xpRecompensa } },
    });

    await tx.xpMateria.upsert({
      where: { usuarioId_moduloId: { usuarioId, moduloId: aula.moduloId } },
      update: { xp: { increment: aula.xpRecompensa } },
      create: { usuarioId, moduloId: aula.moduloId, xp: aula.xpRecompensa },
    });

    const aulasDoModulo = await tx.aula.findMany({
      where: { moduloId: aula.moduloId },
      select: { id: true },
    });

    const concluidas = await tx.progressoAula.count({
      where: {
        usuarioId,
        concluida: true,
        aulaId: { in: aulasDoModulo.map((a) => a.id) },
      },
    });

    if (concluidas === aulasDoModulo.length) {
      await tx.usuario.update({
        where: { id: usuarioId },
        data: { nivel: { increment: 1 } },
      });
    }
  });

  revalidatePath("/");
  revalidatePath(`/aulas/${aulaId}`);
  revalidatePath("/perfil");
}
