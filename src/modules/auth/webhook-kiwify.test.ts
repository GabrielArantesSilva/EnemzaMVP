import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/lib/prisma";
import { gerarHashSenha } from "@/lib/senha";
import { criarUsuario, limparBanco } from "@test/db-utils";
import { enviarEmail } from "@/lib/email";
import { processarCompraAprovada } from "@/modules/auth/webhook-kiwify";

vi.mock("@/lib/email", () => ({
  enviarEmail: vi.fn(),
}));

const PAYLOAD_COMPRA_APROVADA = {
  webhook_event_type: "compra_aprovada",
  Customer: { full_name: "Ana Compradora", email: "ana@compradora.local" },
};

describe("processarCompraAprovada", () => {
  beforeEach(async () => {
    await limparBanco();
    vi.mocked(enviarEmail).mockReset();
  });

  it("cria usuário novo com senhaHash null, registra outbox e envia e-mail de primeiro acesso", async () => {
    await processarCompraAprovada(PAYLOAD_COMPRA_APROVADA);

    const usuario = await prisma.usuario.findUniqueOrThrow({ where: { email: "ana@compradora.local" } });
    expect(usuario.senhaHash).toBeNull();
    expect(usuario.nome).toBe("Ana Compradora");

    const outbox = await prisma.emailPrimeiroAcesso.findUniqueOrThrow({ where: { usuarioId: usuario.id } });
    expect(outbox.status).toBe("enviado");
    expect(outbox.tentativas).toBe(0);

    expect(enviarEmail).toHaveBeenCalledTimes(1);
    expect(enviarEmail).toHaveBeenCalledWith(expect.objectContaining({ para: "ana@compradora.local" }));
  });

  it("é idempotente — compra repetida pro mesmo e-mail não cria outra conta nem reenvia e-mail quando já tem senha", async () => {
    const senhaHash = await gerarHashSenha("jasenha123");
    await criarUsuario({ email: "ana@compradora.local", senhaHash });

    await processarCompraAprovada(PAYLOAD_COMPRA_APROVADA);

    const usuarios = await prisma.usuario.findMany({ where: { email: "ana@compradora.local" } });
    expect(usuarios).toHaveLength(1);
    expect(usuarios[0].senhaHash).toBe(senhaHash);
    expect(enviarEmail).not.toHaveBeenCalled();
    expect(await prisma.emailPrimeiroAcesso.count()).toBe(0);
  });

  it("reenvia e-mail de primeiro acesso se a compra repetir antes do comprador definir senha", async () => {
    const usuario = await criarUsuario({ email: "ana@compradora.local", senhaHash: null });

    await processarCompraAprovada(PAYLOAD_COMPRA_APROVADA);

    expect(enviarEmail).toHaveBeenCalledTimes(1);
    const outbox = await prisma.emailPrimeiroAcesso.findUniqueOrThrow({ where: { usuarioId: usuario.id } });
    expect(outbox.status).toBe("enviado");
  });

  it("ignora eventos que não sejam compra aprovada — não cria conta nem envia e-mail", async () => {
    await processarCompraAprovada({
      webhook_event_type: "compra_recusada",
      Customer: { full_name: "Ana Compradora", email: "ana@compradora.local" },
    });

    expect(enviarEmail).not.toHaveBeenCalled();
    expect(await prisma.usuario.count()).toBe(0);
    expect(await prisma.emailPrimeiroAcesso.count()).toBe(0);
  });

  it("falha de envio de e-mail não lança — registra pendente com erro no outbox pra reenviar depois", async () => {
    vi.mocked(enviarEmail).mockRejectedValueOnce(new Error("smtp fora do ar"));

    await expect(processarCompraAprovada(PAYLOAD_COMPRA_APROVADA)).resolves.toBeUndefined();

    const usuario = await prisma.usuario.findUniqueOrThrow({ where: { email: "ana@compradora.local" } });
    const outbox = await prisma.emailPrimeiroAcesso.findUniqueOrThrow({ where: { usuarioId: usuario.id } });
    expect(outbox.status).toBe("pendente");
    expect(outbox.tentativas).toBe(1);
    expect(outbox.ultimoErro).toContain("smtp fora do ar");
    expect(outbox.proximaTentativaEm.getTime()).toBeGreaterThan(Date.now());
  });

  it("rejeita payload sem Customer.email", async () => {
    await expect(
      processarCompraAprovada({ Customer: { full_name: "Sem email" } }),
    ).rejects.toThrow();
  });
});
