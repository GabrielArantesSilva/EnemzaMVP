import { describe, expect, it, vi } from "vitest";

vi.mock("./gemini", () => ({
  gerarConteudoEstruturado: vi.fn().mockResolvedValue({ moduloNome: "Matemática" }),
}));

import { gerarConteudoEstruturado } from "./gemini";
import { classificarVideoPorModulo } from "./classificacao-video";

describe("classificarVideoPorModulo", () => {
  it("passa o enum de módulos no schema e retorna o resultado do Gemini", async () => {
    const modulos = ["Matemática", "Física", "Química"];

    const resultado = await classificarVideoPorModulo(
      { titulo: "Equações do 2º grau", transcript: "hoje vamos resolver equações..." },
      modulos,
    );

    expect(resultado).toEqual({ moduloNome: "Matemática" });
    expect(gerarConteudoEstruturado).toHaveBeenCalledWith(
      expect.objectContaining({
        schema: expect.objectContaining({
          properties: expect.objectContaining({
            moduloNome: expect.objectContaining({ enum: modulos }),
          }),
        }),
      }),
    );
  });

  it("funciona sem transcript (classifica só pelo título)", async () => {
    await classificarVideoPorModulo({ titulo: "Aula de matemática", transcript: null }, ["Matemática"]);

    const prompt = vi.mocked(gerarConteudoEstruturado).mock.calls.at(-1)?.[0].prompt;
    expect(prompt).toContain("Transcrição indisponível");
  });
});
