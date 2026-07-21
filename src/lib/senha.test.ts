import { describe, expect, it } from "vitest";

import { gerarHashSenha, verificarSenha } from "./senha";

describe("hash de senha", () => {
  it("gera hashes diferentes para a mesma senha (salt aleatório)", async () => {
    const hash1 = await gerarHashSenha("minhasenha123");
    const hash2 = await gerarHashSenha("minhasenha123");

    expect(hash1).not.toBe(hash2);
  });

  it("verifica corretamente a senha certa", async () => {
    const hash = await gerarHashSenha("minhasenha123");

    await expect(verificarSenha("minhasenha123", hash)).resolves.toBe(true);
  });

  it("rejeita senha errada", async () => {
    const hash = await gerarHashSenha("minhasenha123");

    await expect(verificarSenha("outrasenha", hash)).resolves.toBe(false);
  });

  it("rejeita hash sem separador, sem lançar erro", async () => {
    await expect(verificarSenha("qualquer", "formato-invalido")).resolves.toBe(false);
  });

  it("rejeita hash com salt/chave de tamanho incorreto, sem lançar erro", async () => {
    await expect(verificarSenha("qualquer", "ab:cd")).resolves.toBe(false);
  });
});
