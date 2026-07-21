import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { escreverJsonAtomico, lerJsonSeExiste, mesclarPorChave } from "./arquivo-json";

describe("arquivo-json", () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(path.join(tmpdir(), "enemza-arquivo-json-"));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  describe("lerJsonSeExiste", () => {
    it("retorna o padrão quando o arquivo não existe", () => {
      const caminho = path.join(dir, "inexistente.json");
      expect(lerJsonSeExiste(caminho, [])).toEqual([]);
    });

    it("lê o conteúdo quando o arquivo existe", () => {
      const caminho = path.join(dir, "dados.json");
      escreverJsonAtomico(caminho, { a: 1 });
      expect(lerJsonSeExiste(caminho, null)).toEqual({ a: 1 });
    });
  });

  describe("escreverJsonAtomico", () => {
    it("escreve o arquivo final e não deixa .tmp órfão", () => {
      const caminho = path.join(dir, "saida.json");
      escreverJsonAtomico(caminho, { ok: true });

      expect(existsSync(caminho)).toBe(true);
      expect(existsSync(`${caminho}.tmp`)).toBe(false);
      expect(JSON.parse(readFileSync(caminho, "utf8"))).toEqual({ ok: true });
    });

    it("sobrescreve um arquivo já existente", () => {
      const caminho = path.join(dir, "saida.json");
      escreverJsonAtomico(caminho, { versao: 1 });
      escreverJsonAtomico(caminho, { versao: 2 });

      expect(JSON.parse(readFileSync(caminho, "utf8"))).toEqual({ versao: 2 });
    });
  });

  describe("mesclarPorChave", () => {
    it("não duplica quando a chave já existe — o novo substitui o antigo", () => {
      const existentes = [
        { id: "a", valor: 1 },
        { id: "b", valor: 2 },
      ];
      const novos = [
        { id: "b", valor: 20 },
        { id: "c", valor: 3 },
      ];

      const resultado = mesclarPorChave(existentes, novos, (item) => item.id);

      expect(resultado).toEqual([
        { id: "a", valor: 1 },
        { id: "b", valor: 20 },
        { id: "c", valor: 3 },
      ]);
    });

    it("mantém a lista original quando não há itens novos", () => {
      const existentes = [{ id: "a", valor: 1 }];
      expect(mesclarPorChave(existentes, [], (item) => item.id)).toEqual(existentes);
    });
  });
});
