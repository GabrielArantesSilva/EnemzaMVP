import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";

import { prisma } from "@/lib/prisma";
import { criarAula, criarModulo, criarUsuario, limparBanco } from "@test/db-utils";

// Bypassa a camada Zod de propósito, simulando um insert que não passou pela aplicação.
describe("constraint SQL nota_referencia_exclusiva", () => {
  let usuarioId: string;
  let moduloId: string;
  let aulaId: string;

  beforeEach(async () => {
    await limparBanco();
    const usuario = await criarUsuario();
    const modulo = await criarModulo();
    const aula = await criarAula(modulo.id);
    usuarioId = usuario.id;
    moduloId = modulo.id;
    aulaId = aula.id;
  });

  it("rejeita insert raw com moduloId e aulaId preenchidos", async () => {
    const id = randomUUID();

    await expect(
      prisma.$executeRaw`
        INSERT INTO "Nota" (id, "usuarioId", "moduloId", "aulaId", conteudo, "atualizadoEm")
        VALUES (${id}, ${usuarioId}, ${moduloId}, ${aulaId}, 'bypass', now())
      `,
    ).rejects.toThrow();
  });

  it("rejeita insert raw sem moduloId nem aulaId", async () => {
    const id = randomUUID();

    await expect(
      prisma.$executeRaw`
        INSERT INTO "Nota" (id, "usuarioId", "moduloId", "aulaId", conteudo, "atualizadoEm")
        VALUES (${id}, ${usuarioId}, NULL, NULL, 'bypass', now())
      `,
    ).rejects.toThrow();
  });

  it("aceita insert raw com exatamente um dos dois preenchido", async () => {
    const id = randomUUID();

    await prisma.$executeRaw`
      INSERT INTO "Nota" (id, "usuarioId", "moduloId", "aulaId", conteudo, "atualizadoEm")
      VALUES (${id}, ${usuarioId}, NULL, ${aulaId}, 'ok', now())
    `;

    const nota = await prisma.nota.findUnique({ where: { id } });
    expect(nota).not.toBeNull();
  });
});
