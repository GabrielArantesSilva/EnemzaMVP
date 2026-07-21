import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GeminiBloqueadoError, gerarConteudoEstruturado } from "./gemini";

function respostaJson(corpo: unknown, status = 200): Response {
  return new Response(JSON.stringify(corpo), { status });
}

describe("gerarConteudoEstruturado", () => {
  const SEGREDO_ORIGINAL = process.env.GEMINI_API_KEY;

  beforeEach(() => {
    process.env.GEMINI_API_KEY = "chave-de-teste";
  });

  afterEach(() => {
    process.env.GEMINI_API_KEY = SEGREDO_ORIGINAL;
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("retorna o JSON estruturado quando a resposta é bem-sucedida", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      respostaJson({
        candidates: [{ content: { parts: [{ text: JSON.stringify({ ok: true }) }] } }],
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const resultado = await gerarConteudoEstruturado({
      modelo: "gemini-2.5-flash",
      prompt: "oi",
      schema: {},
    });

    expect(resultado).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("tenta de novo em 429 e tem sucesso na segunda tentativa", async () => {
    vi.useFakeTimers();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(respostaJson({}, 429))
      .mockResolvedValueOnce(
        respostaJson({ candidates: [{ content: { parts: [{ text: JSON.stringify({ ok: true }) }] } }] }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const promessa = gerarConteudoEstruturado({ modelo: "gemini-2.5-flash", prompt: "oi", schema: {} });
    await vi.runAllTimersAsync();

    await expect(promessa).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("lança GeminiBloqueadoError quando o prompt é bloqueado por segurança (promptFeedback)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(respostaJson({ promptFeedback: { blockReason: "SAFETY" } })),
    );

    await expect(
      gerarConteudoEstruturado({ modelo: "gemini-2.5-flash", prompt: "oi", schema: {} }),
    ).rejects.toBeInstanceOf(GeminiBloqueadoError);
  });

  it("lança GeminiBloqueadoError quando finishReason é SAFETY", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respostaJson({ candidates: [{ finishReason: "SAFETY" }] })));

    await expect(
      gerarConteudoEstruturado({ modelo: "gemini-2.5-flash", prompt: "oi", schema: {} }),
    ).rejects.toBeInstanceOf(GeminiBloqueadoError);
  });

  it("lança erro claro em resposta de erro HTTP não relacionada a rate limit", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respostaJson({}, 500)));

    await expect(
      gerarConteudoEstruturado({ modelo: "gemini-2.5-flash", prompt: "oi", schema: {} }),
    ).rejects.toThrow(/500/);
  });

  it("lança erro claro quando a resposta não tem texto", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respostaJson({ candidates: [{ content: { parts: [] } }] })));

    await expect(
      gerarConteudoEstruturado({ modelo: "gemini-2.5-flash", prompt: "oi", schema: {} }),
    ).rejects.toThrow(/sem texto/);
  });
});
