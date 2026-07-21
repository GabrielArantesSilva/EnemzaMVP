import { afterEach, describe, expect, it, vi } from "vitest";

import { obterTranscript } from "./youtube-transcript";

function respostaTexto(corpo: string, ok = true): Response {
  return new Response(corpo, { status: ok ? 200 : 404 });
}

describe("obterTranscript", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("extrai e concatena o texto da legenda em pt", async () => {
    const xml =
      '<?xml version="1.0" encoding="utf-8" ?><transcript>' +
      '<text start="0" dur="2">Olá pessoal, hoje vamos falar de fun&#39;coes</text>' +
      '<text start="2" dur="3">e equa&amp;coes do segundo grau</text>' +
      "</transcript>";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respostaTexto(xml)));

    await expect(obterTranscript("abc123")).resolves.toBe(
      "Olá pessoal, hoje vamos falar de fun'coes e equa&coes do segundo grau",
    );
  });

  it("tenta pt-BR quando pt não tem legenda", async () => {
    const xmlPtBr =
      '<transcript><text start="0" dur="1">conteúdo em pt-BR</text></transcript>';
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(respostaTexto("", false))
      .mockResolvedValueOnce(respostaTexto(xmlPtBr));
    vi.stubGlobal("fetch", fetchMock);

    await expect(obterTranscript("abc123")).resolves.toBe("conteúdo em pt-BR");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("retorna null quando não há legenda em nenhum idioma tentado", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(respostaTexto("", false)));

    await expect(obterTranscript("sem-legenda")).resolves.toBeNull();
  });
});
