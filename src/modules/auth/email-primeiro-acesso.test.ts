import { beforeEach, describe, expect, it, vi } from "vitest";

import { prisma } from "@/lib/prisma";
import { criarUsuario, limparBanco } from "@test/db-utils";
import { enviarEmail } from "@/lib/email";
import {
  MAX_TENTATIVAS,
  StatusEmailPrimeiroAcesso,
  garantirEmailPrimeiroAcesso,
  reenviarEmailsPendentes,
} from "@/modules/auth/email-primeiro-acesso";

vi.mock("@/lib/email", () => ({
  enviarEmail: vi.fn(),
}));

async function criarOutbox(usuarioId: string, status: string, tentativas: number, vencido: boolean) {
  return prisma.emailPrimeiroAcesso.create({
    data: {
      usuarioId,
      status,
      tentativas,
      proximaTentativaEm: vencido ? new Date(Date.now() - 60_000) : new Date(Date.now() + 60_000),
    },
  });
}

describe("email-primeiro-acesso (outbox)", () => {
  beforeEach(async () => {
    await limparBanco();
    vi.mocked(enviarEmail).mockReset();
  });

  it("registra o outbox e envia uma vez — sucesso marca como enviado", async () => {
    const usuario = await criarUsuario({ email: "ana@compradora.local", senhaHash: null });

    await garantirEmailPrimeiroAcesso(usuario.id);

    expect(enviarEmail).toHaveBeenCalledTimes(1);
    expect(enviarEmail).toHaveBeenCalledWith(expect.objectContaining({ para: "ana@compradora.local" }));
    const outbox = await prisma.emailPrimeiroAcesso.findUniqueOrThrow({ where: { usuarioId: usuario.id } });
    expect(outbox.status).toBe(StatusEmailPrimeiroAcesso.ENVIADO);
    expect(outbox.tentativas).toBe(0);
  });

  it("dreno reenvia só registros pendentes já vencidos", async () => {
    const usuario = await criarUsuario({ email: "ana@compradora.local", senhaHash: null });
    await criarOutbox(usuario.id, StatusEmailPrimeiroAcesso.PENDENTE, 0, true);

    const processados = await reenviarEmailsPendentes();

    expect(processados).toBe(1);
    expect(enviarEmail).toHaveBeenCalledTimes(1);
  });

  it("dreno não reenvia registro cuja proximaTentativaEm ainda não chegou (backoff)", async () => {
    const usuario = await criarUsuario({ email: "ana@compradora.local", senhaHash: null });
    await criarOutbox(usuario.id, StatusEmailPrimeiroAcesso.PENDENTE, 1, false);

    const processados = await reenviarEmailsPendentes();

    expect(processados).toBe(0);
    expect(enviarEmail).not.toHaveBeenCalled();
  });

  it("falha no dreno incrementa tentativas, guarda o erro e agenda nova tentativa no futuro", async () => {
    vi.mocked(enviarEmail).mockRejectedValue(new Error("smtp fora do ar"));
    const usuario = await criarUsuario({ email: "ana@compradora.local", senhaHash: null });
    await criarOutbox(usuario.id, StatusEmailPrimeiroAcesso.PENDENTE, 0, true);

    await reenviarEmailsPendentes();
    await reenviarEmailsPendentes();

    const outbox = await prisma.emailPrimeiroAcesso.findUniqueOrThrow({ where: { usuarioId: usuario.id } });
    expect(outbox.status).toBe(StatusEmailPrimeiroAcesso.PENDENTE);
    expect(outbox.tentativas).toBe(1);
    expect(outbox.ultimoErro).toContain("smtp fora do ar");
    expect(outbox.proximaTentativaEm.getTime()).toBeGreaterThan(Date.now());
    expect(enviarEmail).toHaveBeenCalledTimes(1);

    await prisma.emailPrimeiroAcesso.update({
      where: { usuarioId: usuario.id },
      data: { proximaTentativaEm: new Date(Date.now() - 60_000) },
    });
    await reenviarEmailsPendentes();

    expect(enviarEmail).toHaveBeenCalledTimes(2);
  });

  it("esgota o teto de tentativas e encaminha pra DLQ (status falhou) — dreno não pega mais", async () => {
    vi.mocked(enviarEmail).mockRejectedValue(new Error("smtp fora do ar"));
    const usuario = await criarUsuario({ email: "ana@compradora.local", senhaHash: null });
    await criarOutbox(usuario.id, StatusEmailPrimeiroAcesso.PENDENTE, MAX_TENTATIVAS - 1, true);

    await reenviarEmailsPendentes();

    const outbox = await prisma.emailPrimeiroAcesso.findUniqueOrThrow({ where: { usuarioId: usuario.id } });
    expect(outbox.status).toBe(StatusEmailPrimeiroAcesso.FALHOU);
    expect(outbox.tentativas).toBe(MAX_TENTATIVAS);

    await reenviarEmailsPendentes();
    expect(enviarEmail).toHaveBeenCalledTimes(1);
  });

  it("re-ativação por novo evento (garantirEmailPrimeiroAcesso) tenta de novo registro falho — e mantém o teto", async () => {
    vi.mocked(enviarEmail).mockRejectedValueOnce(new Error("smtp fora do ar"));
    const usuario = await criarUsuario({ email: "ana@compradora.local", senhaHash: null });
    await criarOutbox(usuario.id, StatusEmailPrimeiroAcesso.FALHOU, MAX_TENTATIVAS, true);

    await garantirEmailPrimeiroAcesso(usuario.id);

    expect(enviarEmail).toHaveBeenCalledTimes(1);
    const outbox = await prisma.emailPrimeiroAcesso.findUniqueOrThrow({ where: { usuarioId: usuario.id } });
    expect(outbox.status).toBe(StatusEmailPrimeiroAcesso.FALHOU);
    expect(outbox.tentativas).toBe(MAX_TENTATIVAS + 1);
    expect(outbox.ultimoErro).toContain("smtp fora do ar");
  });
});
