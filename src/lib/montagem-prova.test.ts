import { describe, expect, it } from "vitest";

import { montarProvaFinal, QUESTOES_ALVO_POR_PROVA, QUESTOES_MINIMAS_POR_PROVA } from "./montagem-prova";
import type { QuestaoValidada } from "./geracao-questao.types";

function criarQuestoesInep(quantidade: number) {
  return Array.from({ length: quantidade }, (_, indice) => ({
    enunciado: `Questão INEP ${indice + 1}`,
    alternativas: [
      { letra: "A", texto: "a" },
      { letra: "B", texto: "b" },
    ],
    gabarito: "A",
  }));
}

function criarQuestoesLlm(quantidade: number): QuestaoValidada[] {
  return Array.from({ length: quantidade }, (_, indice) => ({
    enunciado: `Questão LLM ${indice + 1}`,
    alternativas: [
      { letra: "A", texto: "a" },
      { letra: "B", texto: "b" },
    ],
    gabarito: "A",
    validadaDouble: true as const,
  }));
}

describe("montarProvaFinal", () => {
  it("usa só INEP quando há questões suficientes pra disciplina exata", () => {
    const resultado = montarProvaFinal({
      moduloNome: "Matemática",
      questoesInep: criarQuestoesInep(QUESTOES_ALVO_POR_PROVA + 5),
      questoesLlmValidadas: criarQuestoesLlm(3),
    });

    expect(resultado.ok).toBe(true);
    if (resultado.ok) {
      expect(resultado.questoes).toHaveLength(QUESTOES_ALVO_POR_PROVA);
      expect(resultado.questoes.every((q) => q.fonte === "INEP")).toBe(true);
    }
  });

  it("completa com LLM quando INEP não é suficiente pra disciplina exata", () => {
    const resultado = montarProvaFinal({
      moduloNome: "Física",
      questoesInep: criarQuestoesInep(4),
      questoesLlmValidadas: criarQuestoesLlm(10),
    });

    expect(resultado.ok).toBe(true);
    if (resultado.ok) {
      expect(resultado.questoes).toHaveLength(QUESTOES_ALVO_POR_PROVA);
      expect(resultado.questoes.filter((q) => q.fonte === "INEP")).toHaveLength(4);
      expect(resultado.questoes.filter((q) => q.fonte === "LLM")).toHaveLength(6);
    }
  });

  it("é 100% LLM pra disciplinas fora da lista de INEP, mesmo se questoesInep vier preenchido por engano", () => {
    const resultado = montarProvaFinal({
      moduloNome: "Português",
      questoesInep: criarQuestoesInep(20),
      questoesLlmValidadas: criarQuestoesLlm(QUESTOES_ALVO_POR_PROVA),
    });

    expect(resultado.ok).toBe(true);
    if (resultado.ok) {
      expect(resultado.questoes.every((q) => q.fonte === "LLM")).toBe(true);
    }
  });

  it("recusa (ok:false) quando fica abaixo do piso mínimo, em vez de persistir prova incompleta", () => {
    const resultado = montarProvaFinal({
      moduloNome: "Sociologia",
      questoesInep: [],
      questoesLlmValidadas: criarQuestoesLlm(QUESTOES_MINIMAS_POR_PROVA - 1),
    });

    expect(resultado.ok).toBe(false);
    if (!resultado.ok) {
      expect(resultado.deficit).toBe(1);
    }
  });

  it("aceita exatamente no piso mínimo", () => {
    const resultado = montarProvaFinal({
      moduloNome: "Sociologia",
      questoesInep: [],
      questoesLlmValidadas: criarQuestoesLlm(QUESTOES_MINIMAS_POR_PROVA),
    });

    expect(resultado.ok).toBe(true);
  });
});
