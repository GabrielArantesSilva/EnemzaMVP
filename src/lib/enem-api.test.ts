import { afterEach, describe, expect, it, vi } from "vitest";

import { listarQuestoesInep } from "./enem-api";

function respostaJson(corpo: unknown, status = 200): Response {
  return new Response(JSON.stringify(corpo), { status });
}

describe("listarQuestoesInep", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("pagina até hasMore ficar falso e filtra pela disciplina pedida", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        respostaJson({
          metadata: { hasMore: true },
          questions: [
            {
              index: 1,
              discipline: "matematica",
              context: "Questão 1",
              files: [],
              correctAlternative: "A",
              alternatives: [{ letter: "A", text: "certa", file: null }],
            },
            {
              index: 2,
              discipline: "linguagens",
              context: "Questão de linguagens (não deve entrar)",
              files: [],
              correctAlternative: "B",
              alternatives: [{ letter: "B", text: "certa", file: null }],
            },
          ],
        }),
      )
      .mockResolvedValueOnce(
        respostaJson({
          metadata: { hasMore: false },
          questions: [
            {
              index: 3,
              discipline: "matematica",
              context: "Questão 2",
              files: [],
              correctAlternative: "C",
              alternatives: [{ letter: "C", text: "certa", file: null }],
            },
          ],
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const resultado = await listarQuestoesInep([2023], ["matematica"]);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(resultado).toHaveLength(2);
    expect(resultado.every((q) => q.disciplina === "matematica")).toBe(true);
    expect(resultado.map((q) => q.indice)).toEqual([1, 3]);
  });

  it("marca temImagem quando a questão ou alguma alternativa tem arquivo", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        respostaJson({
          metadata: { hasMore: false },
          questions: [
            {
              index: 1,
              discipline: "matematica",
              context: "Questão com gráfico",
              files: ["https://exemplo/imagem.png"],
              correctAlternative: "A",
              alternatives: [{ letter: "A", text: "certa", file: null }],
            },
            {
              index: 2,
              discipline: "matematica",
              context: "Questão só texto",
              files: [],
              correctAlternative: "A",
              alternatives: [{ letter: "A", text: "certa", file: null }],
            },
          ],
        }),
      ),
    );

    const resultado = await listarQuestoesInep([2023], ["matematica"]);

    expect(resultado.find((q) => q.enunciado === "Questão com gráfico")?.temImagem).toBe(true);
    expect(resultado.find((q) => q.enunciado === "Questão só texto")?.temImagem).toBe(false);
  });

  it("marca temImagem quando o enunciado referencia imagem via markdown (ex: ![](url))", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        respostaJson({
          metadata: { hasMore: false },
          questions: [
            {
              index: 1,
              discipline: "matematica",
              context: "Observe a figura ![](https://enem.dev/imagem.svg) e responda.",
              files: [],
              correctAlternative: "A",
              alternatives: [{ letter: "A", text: "certa", file: null }],
            },
          ],
        }),
      ),
    );

    const resultado = await listarQuestoesInep([2023], ["matematica"]);

    expect(resultado[0].temImagem).toBe(true);
  });

  it("descarta questão com enunciado nulo (dado real da api.enem.dev pode vir assim)", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        respostaJson({
          metadata: { hasMore: false },
          questions: [
            {
              index: 1,
              discipline: "matematica",
              context: null,
              files: [],
              correctAlternative: "A",
              alternatives: [{ letter: "A", text: "certa", file: null }],
            },
            {
              index: 2,
              discipline: "matematica",
              context: "Questão válida",
              files: [],
              correctAlternative: "A",
              alternatives: [{ letter: "A", text: "certa", file: null }],
            },
          ],
        }),
      ),
    );

    const resultado = await listarQuestoesInep([2023], ["matematica"]);

    expect(resultado).toHaveLength(1);
    expect(resultado[0].enunciado).toBe("Questão válida");
  });
});
