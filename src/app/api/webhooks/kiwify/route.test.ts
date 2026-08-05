import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { ZodError } from "zod";

vi.mock("@/modules/auth/webhook-kiwify", () => ({
  processarCompraAprovada: vi.fn(),
}));

import { processarCompraAprovada } from "@/modules/auth/webhook-kiwify";
import { POST } from "./route";

const TOKEN_ORIGINAL = process.env.KIWIFY_WEBHOOK_TOKEN;

function criarRequest(url: string, body: unknown) {
  return new NextRequest(url, { method: "POST", body: JSON.stringify(body) });
}

describe("POST /api/webhooks/kiwify", () => {
  beforeEach(() => {
    process.env.KIWIFY_WEBHOOK_TOKEN = "segredo-teste";
    vi.mocked(processarCompraAprovada).mockClear();
  });

  afterAll(() => {
    process.env.KIWIFY_WEBHOOK_TOKEN = TOKEN_ORIGINAL;
  });

  it("rejeita requisição sem token", async () => {
    const resposta = await POST(criarRequest("http://localhost/api/webhooks/kiwify", {}));

    expect(resposta.status).toBe(401);
    expect(processarCompraAprovada).not.toHaveBeenCalled();
  });

  it("rejeita requisição com token errado", async () => {
    const resposta = await POST(criarRequest("http://localhost/api/webhooks/kiwify?token=errado", {}));

    expect(resposta.status).toBe(401);
    expect(processarCompraAprovada).not.toHaveBeenCalled();
  });

  it("aceita com o token correto e repassa o payload", async () => {
    const payload = { Customer: { full_name: "Ana", email: "ana@x.local" } };
    const resposta = await POST(criarRequest("http://localhost/api/webhooks/kiwify?token=segredo-teste", payload));

    expect(resposta.status).toBe(200);
    expect(processarCompraAprovada).toHaveBeenCalledWith(payload);
  });

  it("retorna 400 pra corpo que não é JSON válido", async () => {
    const resposta = await POST(
      new NextRequest("http://localhost/api/webhooks/kiwify?token=segredo-teste", {
        method: "POST",
        body: "isto não é json",
      }),
    );

    expect(resposta.status).toBe(400);
    expect(processarCompraAprovada).not.toHaveBeenCalled();
  });

  it("retorna 400 quando o payload foge do schema (erro permanente, não re-tentável)", async () => {
    vi.mocked(processarCompraAprovada).mockRejectedValueOnce(new ZodError([]));

    const resposta = await POST(
      criarRequest("http://localhost/api/webhooks/kiwify?token=segredo-teste", { sem: "customer" }),
    );

    expect(resposta.status).toBe(400);
  });
});
