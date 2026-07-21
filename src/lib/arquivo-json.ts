import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";

export function lerJsonSeExiste<T>(caminho: string, padrao: T): T {
  if (!existsSync(caminho)) return padrao;
  return JSON.parse(readFileSync(caminho, "utf8")) as T;
}

// Escreve em ${caminho}.tmp e renomeia — evita JSON truncado se o processo
// morrer no meio do write (renameSync é atômico no mesmo volume).
export function escreverJsonAtomico(caminho: string, dados: unknown): void {
  const caminhoTemporario = `${caminho}.tmp`;
  writeFileSync(caminhoTemporario, JSON.stringify(dados, null, 2));
  renameSync(caminhoTemporario, caminho);
}

export function mesclarPorChave<T>(existentes: T[], novos: T[], obterChave: (item: T) => string): T[] {
  const mapa = new Map(existentes.map((item) => [obterChave(item), item]));
  for (const item of novos) {
    mapa.set(obterChave(item), item);
  }
  return [...mapa.values()];
}
