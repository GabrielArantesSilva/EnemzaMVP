import { beforeEach, describe, expect, it } from "vitest";

import { submeterProva } from "@/modules/provas/provas.actions";
import { prisma } from "@/lib/prisma";
import { limparBanco } from "@test/db-utils";

describe("submeterProva — correção", () => {
  let provaId: string;
  let questaoCertaId: string;
  let questaoErradaId: string;

  beforeEach(async () => {
    await limparBanco();

    const modulo = await prisma.modulo.create({
      data: { nome: "Módulo Teste", ordem: 1, corHex: "#000000" },
    });
    const prova = await prisma.prova.create({ data: { moduloId: modulo.id } });
    const questaoCerta = await prisma.questao.create({
      data: {
        provaId: prova.id,
        fonte: "SEED",
        enunciado: "2 + 2 = ?",
        alternativas: [
          { letra: "A", texto: "3" },
          { letra: "B", texto: "4" },
        ],
        gabarito: "B",
      },
    });
    const questaoErrada = await prisma.questao.create({
      data: {
        provaId: prova.id,
        fonte: "SEED",
        enunciado: "3 + 3 = ?",
        alternativas: [
          { letra: "A", texto: "6" },
          { letra: "B", texto: "7" },
        ],
        gabarito: "A",
      },
    });

    provaId = prova.id;
    questaoCertaId = questaoCerta.id;
    questaoErradaId = questaoErrada.id;
  });

  it("conta acerto quando a resposta bate com o gabarito e erro quando diverge", async () => {
    const resultado = await submeterProva({
      provaId,
      respostas: { [questaoCertaId]: "B", [questaoErradaId]: "B" },
    });

    expect(resultado.total).toBe(2);
    expect(resultado.acertos).toBe(1);
    expect(resultado.detalhe.find((d) => d.questaoId === questaoCertaId)?.correta).toBe(true);
    expect(resultado.detalhe.find((d) => d.questaoId === questaoErradaId)?.correta).toBe(false);
  });

  it("trata questão não respondida como incorreta, sem quebrar a correção", async () => {
    const resultado = await submeterProva({
      provaId,
      respostas: { [questaoCertaId]: "B" },
    });

    const semResposta = resultado.detalhe.find((d) => d.questaoId === questaoErradaId);
    expect(semResposta?.correta).toBe(false);
    expect(semResposta?.escolhida).toBeNull();
    expect(resultado.acertos).toBe(1);
    expect(resultado.total).toBe(2);
  });
});
