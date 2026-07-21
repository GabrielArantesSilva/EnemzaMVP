import { describe, expect, it, vi } from "vitest";

import { gerarQuestaoComDoubleCheck } from "./geracao-questao";
import type { QuestaoGerada } from "./geracao-questao.types";

const QUESTAO_BASE: QuestaoGerada = {
  enunciado: "Quanto é 2+2?",
  alternativas: [
    { letra: "A", texto: "3" },
    { letra: "B", texto: "4" },
  ],
  gabarito: "B",
};

describe("gerarQuestaoComDoubleCheck", () => {
  it("valida e retorna a questão quando o double-check concorda com o gabarito", async () => {
    const gerar = vi.fn().mockResolvedValue(QUESTAO_BASE);
    const resolver = vi.fn().mockResolvedValue({ letraEscolhida: "B" });

    const resultado = await gerarQuestaoComDoubleCheck("Matemática", 3, { gerar, resolver });

    expect(resultado).toEqual({ ...QUESTAO_BASE, validadaDouble: true });
    expect(gerar).toHaveBeenCalledTimes(1);
    expect(resolver).toHaveBeenCalledTimes(1);
  });

  it("descarta e gera de novo quando o double-check diverge, até validar", async () => {
    const gerar = vi.fn().mockResolvedValue(QUESTAO_BASE);
    const resolver = vi
      .fn()
      .mockResolvedValueOnce({ letraEscolhida: "A" }) // diverge
      .mockResolvedValueOnce({ letraEscolhida: "B" }); // valida

    const resultado = await gerarQuestaoComDoubleCheck("Matemática", 3, { gerar, resolver });

    expect(resultado).toEqual({ ...QUESTAO_BASE, validadaDouble: true });
    expect(gerar).toHaveBeenCalledTimes(2);
    expect(resolver).toHaveBeenCalledTimes(2);
  });

  it("retorna null (nunca persiste sem validação) quando esgota as tentativas divergindo", async () => {
    const gerar = vi.fn().mockResolvedValue(QUESTAO_BASE);
    const resolver = vi.fn().mockResolvedValue({ letraEscolhida: "A" }); // sempre diverge

    const resultado = await gerarQuestaoComDoubleCheck("Matemática", 3, { gerar, resolver });

    expect(resultado).toBeNull();
    expect(gerar).toHaveBeenCalledTimes(3);
    expect(resolver).toHaveBeenCalledTimes(3);
  });

  it("propaga erro transitório da chamada subjacente sem consumir tentativa nem virar divergência", async () => {
    const gerar = vi.fn().mockRejectedValue(new Error("Gemini (modelo) retornou 500"));
    const resolver = vi.fn();

    await expect(gerarQuestaoComDoubleCheck("Matemática", 3, { gerar, resolver })).rejects.toThrow(/500/);
    expect(gerar).toHaveBeenCalledTimes(1);
    expect(resolver).not.toHaveBeenCalled();
  });
});
