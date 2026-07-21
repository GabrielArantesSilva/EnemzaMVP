import "dotenv/config";

import { listarQuestoesInep } from "@/lib/enem-api";
import { escreverJsonAtomico, lerJsonSeExiste } from "@/lib/arquivo-json";
import type { QuestaoInep } from "@/lib/enem-api.types";

const CAMINHO_SAIDA = "scripts/output/questoes-inep-brutas.json";
const QUANTIDADE_ANOS = 5;
// api.enem.dev tem lag em relação ao ano corrente — 2023 é o ano mais
// recente confirmado disponível em GET /v1/exams (checado manualmente).
const ULTIMO_ANO_DISPONIVEL = 2023;

function anosRecentes(quantidade: number): number[] {
  return Array.from({ length: quantidade }, (_, indice) => ULTIMO_ANO_DISPONIVEL - indice);
}

async function main() {
  const anos = anosRecentes(QUANTIDADE_ANOS);
  const resultado = lerJsonSeExiste<QuestaoInep[]>(CAMINHO_SAIDA, []);
  const anosJaBaixados = new Set(resultado.map((questao) => questao.ano));

  const anosPendentes = anos.filter((ano) => !anosJaBaixados.has(ano));
  console.log(`Anos pendentes: ${anosPendentes.join(", ") || "nenhum"} (${anosJaBaixados.size} já baixados).`);

  for (const ano of anosPendentes) {
    const questoesDoAno = await listarQuestoesInep([ano], ["matematica", "ciencias-natureza"]);
    resultado.push(...questoesDoAno);
    escreverJsonAtomico(CAMINHO_SAIDA, resultado);
    console.log(`${ano}: ${questoesDoAno.length} questões (matematica + ciencias-natureza).`);
  }

  const semImagem = resultado.filter((questao) => !questao.temImagem);
  console.log(
    `Total: ${resultado.length} questões, ${semImagem.length} sem dependência de imagem (schema atual não suporta imagem).`,
  );
}

main().catch((erro) => {
  console.error(erro);
  process.exitCode = 1;
});
