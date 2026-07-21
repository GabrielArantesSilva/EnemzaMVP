import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/lib/prisma";
import { gerarHashSenha } from "@/lib/senha";
import { criarUsuario, limparBanco } from "@test/db-utils";
import { enviarEmail } from "@/lib/email";
import { processarCompraAprovada } from "@/modules/auth/webhook-kiwify";

vi.mock("@/lib/email", () => ({
  enviarEmail: vi.fn(),
}));

describe("processarCompraAprovada", () => {
  beforeEach(async () => {
    await limparBanco();
    vi.mocked(enviarEmail).mockClear();
  });

  it("cria usuário novo com senhaHash null e envia e-mail de primeiro acesso", async () => {
    await processarCompraAprovada({
      Customer: { full_name: "Ana Compradora", email: "ana@compradora.local" },
    });

    const usuario = await prisma.usuario.findUniqueOrThrow({ where: { email: "ana@compradora.local" } });
    expect(usuario.senhaHash).toBeNull();
    expect(usuario.nome).toBe("Ana Compradora");
    expect(enviarEmail).toHaveBeenCalledTimes(1);
    expect(enviarEmail).toHaveBeenCalledWith(expect.objectContaining({ para: "ana@compradora.local" }));
  });

  it("é idempotente — compra repetida pro mesmo e-mail não cria outra conta nem reenvia e-mail quando já tem senha", async () => {
    const senhaHash = await gerarHashSenha("jasenha123");
    await criarUsuario({ email: "ana@compradora.local", senhaHash });

    await processarCompraAprovada({
      Customer: { full_name: "Ana Compradora", email: "ana@compradora.local" },
    });

    const usuarios = await prisma.usuario.findMany({ where: { email: "ana@compradora.local" } });
    expect(usuarios).toHaveLength(1);
    expect(usuarios[0].senhaHash).toBe(senhaHash);
    expect(enviarEmail).not.toHaveBeenCalled();
  });

  it("reenvia e-mail de primeiro acesso se a compra repetir antes do comprador definir senha", async () => {
    await criarUsuario({ email: "ana@compradora.local", senhaHash: null });

    await processarCompraAprovada({
      Customer: { full_name: "Ana Compradora", email: "ana@compradora.local" },
    });

    expect(enviarEmail).toHaveBeenCalledTimes(1);
  });

  it("rejeita payload sem Customer.email", async () => {
    await expect(
      processarCompraAprovada({ Customer: { full_name: "Sem email" } }),
    ).rejects.toThrow();
  });
});
