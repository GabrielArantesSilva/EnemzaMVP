import "dotenv/config";

import { gerarQuestaoComDoubleCheck } from "@/lib/geracao-questao";
import { DISCIPLINAS_COM_INEP, QUESTOES_ALVO_POR_PROVA } from "@/lib/montagem-prova";
import { escreverJsonAtomico, lerJsonSeExiste } from "@/lib/arquivo-json";
import type { QuestaoValidada } from "@/lib/geracao-questao.types";

interface QuestaoInepClassificada {
  moduloNome: string;
}

const MODULOS = [
  "Português",
  "Literatura",
  "Inglês",
  "Matemática",
  "História",
  "Geografia",
  "Filosofia",
  "Sociologia",
  "Física",
  "Química",
  "Biologia",
];

const CAMINHO_INEP_CLASSIFICADO = "scripts/output/questoes-inep-classificadas.json";
const CAMINHO_SAIDA = "scripts/output/questoes-llm-geradas.json";
const MAX_TENTATIVAS_DOUBLE_CHECK = 3;
// Trava de segurança contra divergência persistente — não é loop infinito.
const MAX_TENTATIVAS_TOTAIS_POR_MODULO = 20;
// 2 chamadas Gemini por tentativa — gemini.ts já faz retry/backoff em 429 como rede de segurança.
const DELAY_MS = 5000;

type RegistroPorModulo = Record<string, QuestaoValidada[]>;

function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function contarInepDisponivelPorModulo(): Map<string, number> {
  const classificadas = lerJsonSeExiste<QuestaoInepClassificada[]>(CAMINHO_INEP_CLASSIFICADO, []);
  const contagem = new Map<string, number>();
  for (const questao of classificadas) {
    contagem.set(questao.moduloNome, (contagem.get(questao.moduloNome) ?? 0) + 1);
  }
  return contagem;
}

async function main() {
  const inepDisponivel = contarInepDisponivelPorModulo();
  const resultados: RegistroPorModulo = lerJsonSeExiste<RegistroPorModulo>(CAMINHO_SAIDA, {});

  for (const moduloNome of MODULOS) {
    const alvo = DISCIPLINAS_COM_INEP.includes(moduloNome)
      ? Math.max(QUESTOES_ALVO_POR_PROVA - (inepDisponivel.get(moduloNome) ?? 0), 0)
      : QUESTOES_ALVO_POR_PROVA;

    const validas = [...(resultados[moduloNome] ?? [])];

    if (validas.length >= alvo) {
      console.log(`${moduloNome}: já tem ${validas.length}/${alvo} questões LLM — pulando.`);
      continue;
    }

    console.log(`${moduloNome}: gerando até ${alvo - validas.length} questão(ões) nova(s)...`);

    let tentativasTotais = 0;
    while (validas.length < alvo && tentativasTotais < MAX_TENTATIVAS_TOTAIS_POR_MODULO) {
      tentativasTotais += 1;
      const questao = await gerarQuestaoComDoubleCheck(moduloNome, MAX_TENTATIVAS_DOUBLE_CHECK);

      if (questao) {
        validas.push(questao);
        resultados[moduloNome] = validas;
        escreverJsonAtomico(CAMINHO_SAIDA, resultados);
        console.log(`${moduloNome}: ${validas.length}/${alvo} válidas.`);
      } else {
        console.warn(`${moduloNome}: double-check esgotou tentativas nesta rodada — sem questão nova.`);
      }

      await esperar(DELAY_MS);
    }

    if (validas.length < alvo) {
      console.warn(
        `${moduloNome}: ficou com ${validas.length}/${alvo} após ${tentativasTotais} tentativas totais.`,
      );
    }
  }

  console.log("Geração de questões via LLM concluída.");
}

main().catch((erro) => {
  console.error(erro);
  process.exitCode = 1;
});
