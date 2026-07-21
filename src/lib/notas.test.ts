import { beforeEach, describe, expect, it } from "vitest";
import { ZodError } from "zod";

import { criarNota } from "@/lib/notas";
import { abrirSessao, encerrarSessao } from "@/lib/sessao";
import { criarAula, criarModulo, criarUsuario, limparBanco } from "@test/db-utils";

describe("criarNota — regra de exclusividade (moduloId XOR aulaId)", () => {
  let usuarioId: string;
  let moduloId: string;
  let aulaId: string;

  beforeEach(async () => {
    await limparBanco();
    const usuario = await criarUsuario();
    const modulo = await criarModulo();
    const aula = await criarAula(modulo.id);
    usuarioId = usuario.id;
    moduloId = modulo.id;
    aulaId = aula.id;
    await abrirSessao(usuarioId);
  });

  it("rejeita quando moduloId e aulaId estão preenchidos", async () => {
    await expect(criarNota({ conteudo: "nota", moduloId, aulaId })).rejects.toThrow(ZodError);
  });

  it("rejeita quando nem moduloId nem aulaId estão preenchidos", async () => {
    await expect(
      criarNota({ conteudo: "nota", moduloId: null, aulaId: null }),
    ).rejects.toThrow(ZodError);
  });

  it("cria nota vinculada apenas à aula, com usuarioId da sessão", async () => {
    const nota = await criarNota({
      conteudo: "nota de aula",
      aulaId,
      moduloId: null,
    });

    expect(nota.usuarioId).toBe(usuarioId);
    expect(nota.aulaId).toBe(aulaId);
    expect(nota.moduloId).toBeNull();
  });

  it("cria nota vinculada apenas ao módulo", async () => {
    const nota = await criarNota({
      conteudo: "nota de módulo",
      moduloId,
      aulaId: null,
    });

    expect(nota.moduloId).toBe(moduloId);
    expect(nota.aulaId).toBeNull();
  });

  it("rejeita sem sessão válida", async () => {
    await encerrarSessao();

    await expect(criarNota({ conteudo: "nota", moduloId, aulaId: null })).rejects.toThrow(/sessão/i);
  });
});
