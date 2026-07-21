import { randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it } from "vitest";

import { prisma } from "@/lib/prisma";
import { criarModulo, limparBanco } from "@test/db-utils";

// Bypassa a camada de aplicação de propósito, simulando um insert que não
// passou por montarProvaFinal/geracao-questao.ts.
describe("constraint SQL questao_double_check_obrigatorio", () => {
  let provaId: string;

  beforeEach(async () => {
    await limparBanco();
    const modulo = await criarModulo();
    const prova = await prisma.prova.create({ data: { moduloId: modulo.id } });
    provaId = prova.id;
  });

  it("rejeita insert raw com fonte='LLM' e validadaDouble=false", async () => {
    const id = randomUUID();

    await expect(
      prisma.$executeRaw`
        INSERT INTO "Questao" (id, "provaId", fonte, enunciado, alternativas, gabarito, "validadaDouble")
        VALUES (${id}, ${provaId}, 'LLM', 'bypass', '[]'::jsonb, 'A', false)
      `,
    ).rejects.toThrow();
  });

  it("aceita insert raw com fonte='LLM' e validadaDouble=true", async () => {
    const id = randomUUID();

    await prisma.$executeRaw`
      INSERT INTO "Questao" (id, "provaId", fonte, enunciado, alternativas, gabarito, "validadaDouble")
      VALUES (${id}, ${provaId}, 'LLM', 'ok', '[]'::jsonb, 'A', true)
    `;

    const questao = await prisma.questao.findUnique({ where: { id } });
    expect(questao).not.toBeNull();
  });

  it("aceita insert raw com fonte='INEP' e validadaDouble=false", async () => {
    const id = randomUUID();

    await prisma.$executeRaw`
      INSERT INTO "Questao" (id, "provaId", fonte, enunciado, alternativas, gabarito, "validadaDouble")
      VALUES (${id}, ${provaId}, 'INEP', 'ok', '[]'::jsonb, 'A', false)
    `;

    const questao = await prisma.questao.findUnique({ where: { id } });
    expect(questao).not.toBeNull();
  });
});
