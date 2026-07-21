import { describe, expect, it, vi } from "vitest";

vi.mock("./gemini", () => ({
  gerarConteudoEstruturado: vi.fn().mockResolvedValue({ moduloNome: "Física" }),
}));

import { gerarConteudoEstruturado } from "./gemini";
import { classificarDisciplinaNatureza } from "./classificacao-questao-natureza";

describe("classificarDisciplinaNatureza", () => {
  it("restringe o schema às 3 disciplinas de ciências da natureza", async () => {
    const resultado = await classificarDisciplinaNatureza("Um corpo em queda livre...");

    expect(resultado).toEqual({ moduloNome: "Física" });
    expect(gerarConteudoEstruturado).toHaveBeenCalledWith(
      expect.objectContaining({
        schema: expect.objectContaining({
          properties: expect.objectContaining({
            moduloNome: expect.objectContaining({ enum: ["Física", "Química", "Biologia"] }),
          }),
        }),
      }),
    );
  });
});
