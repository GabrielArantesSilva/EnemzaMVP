import "dotenv/config";

import { classificarDisciplinaNatureza } from "@/lib/classificacao-questao-natureza";
import { escreverJsonAtomico, lerJsonSeExiste } from "@/lib/arquivo-json";
import type { QuestaoInep } from "@/lib/enem-api.types";

interface QuestaoClassificada extends QuestaoInep {
  moduloNome: string;
}

const CAMINHO_ENTRADA = "scripts/output/questoes-inep-brutas.json";
const CAMINHO_SAIDA = "scripts/output/questoes-inep-classificadas.json";
// ~14 chamadas/min — abaixo do limite de 15 RPM do free tier do modelo usado.
const DELAY_MS = 4300;
const GRAVAR_A_CADA = 5;

function chave(questao: QuestaoInep): string {
  return `${questao.ano}-${questao.indice}`;
}

function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const todas = lerJsonSeExiste<QuestaoInep[]>(CAMINHO_ENTRADA, []);
  if (todas.length === 0) {
    throw new Error(`Nenhuma questão encontrada em ${CAMINHO_ENTRADA} — rode baixar-questoes-inep.ts antes.`);
  }
  // Schema de Questao não suporta imagem — filtra fora aqui (baixar-questoes-inep.ts salva o bruto pra ficar resumível).
  const brutas = todas.filter((questao) => !questao.temImagem);

  const resultados = lerJsonSeExiste<QuestaoClassificada[]>(CAMINHO_SAIDA, []);
  const jaClassificadas = new Set(resultados.map(chave));

  const pendentes = brutas.filter((questao) => !jaClassificadas.has(chave(questao)));
  console.log(`${pendentes.length} questões pendentes (${jaClassificadas.size} já classificadas).`);

  let processadasNestaExecucao = 0;
  for (const questao of pendentes) {
    if (questao.disciplina === "matematica") {
      resultados.push({ ...questao, moduloNome: "Matemática" });
    } else {
      try {
        const { moduloNome } = await classificarDisciplinaNatureza(questao.enunciado);
        resultados.push({ ...questao, moduloNome });
      } catch (erro) {
        console.error(`Falha ao classificar questão ${chave(questao)} — tentará de novo na próxima execução.`, erro);
        continue;
      }

      processadasNestaExecucao += 1;
      if (processadasNestaExecucao % GRAVAR_A_CADA === 0) {
        escreverJsonAtomico(CAMINHO_SAIDA, resultados);
        console.log(`${resultados.length} questões classificadas até agora...`);
      }

      await esperar(DELAY_MS);
    }
  }

  escreverJsonAtomico(CAMINHO_SAIDA, resultados);
  console.log(`Concluído: ${resultados.length} questões classificadas.`);
}

main().catch((erro) => {
  console.error(erro);
  process.exitCode = 1;
});
