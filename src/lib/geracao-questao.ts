import { gerarConteudoEstruturado } from "./gemini";
import type { QuestaoGerada, QuestaoValidada } from "./geracao-questao.types";

const MODELO = process.env.GEMINI_MODEL_GERACAO ?? "gemini-flash-lite-latest";
const LETRAS = ["A", "B", "C", "D"];

const SCHEMA_QUESTAO = {
  type: "OBJECT",
  properties: {
    enunciado: { type: "STRING" },
    alternativas: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          letra: { type: "STRING", enum: LETRAS },
          texto: { type: "STRING" },
        },
        required: ["letra", "texto"],
      },
    },
    gabarito: { type: "STRING", enum: LETRAS },
  },
  required: ["enunciado", "alternativas", "gabarito"],
};

export async function gerarQuestaoBruta(moduloNome: string): Promise<QuestaoGerada> {
  const prompt = [
    `Crie uma questão de múltipla escolha no estilo ENEM sobre ${moduloNome}, nível médio de dificuldade.`,
    "4 alternativas (A a D), só uma correta. Enunciado claro e autocontido — não dependa de imagem, gráfico ou tabela.",
  ].join("\n\n");

  return gerarConteudoEstruturado<QuestaoGerada>({ modelo: MODELO, prompt, schema: SCHEMA_QUESTAO });
}

export async function resolverQuestaoIndependente(
  enunciado: string,
  alternativas: { letra: string; texto: string }[],
): Promise<{ letraEscolhida: string }> {
  const prompt = [
    "Resolva a questão abaixo do zero e escolha a alternativa correta.",
    enunciado,
    alternativas.map((alt) => `${alt.letra}) ${alt.texto}`).join("\n"),
  ].join("\n\n");

  return gerarConteudoEstruturado<{ letraEscolhida: string }>({
    modelo: MODELO,
    prompt,
    schema: {
      type: "OBJECT",
      properties: { letraEscolhida: { type: "STRING", enum: alternativas.map((alt) => alt.letra) } },
      required: ["letraEscolhida"],
    },
  });
}

interface DependenciasDoubleCheck {
  gerar?: typeof gerarQuestaoBruta;
  resolver?: typeof resolverQuestaoIndependente;
}

// Ver .harness/boundaries.md — esgotar tentativas retorna null, nunca persiste sem validadaDouble.
export async function gerarQuestaoComDoubleCheck(
  moduloNome: string,
  maxTentativas = 3,
  dependencias: DependenciasDoubleCheck = {},
): Promise<QuestaoValidada | null> {
  const gerar = dependencias.gerar ?? gerarQuestaoBruta;
  const resolver = dependencias.resolver ?? resolverQuestaoIndependente;

  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    const gerada = await gerar(moduloNome);
    const { letraEscolhida } = await resolver(gerada.enunciado, gerada.alternativas);

    if (letraEscolhida === gerada.gabarito) {
      return { ...gerada, validadaDouble: true };
    }

    console.warn(
      `Double-check divergiu para "${moduloNome}" (gabarito ${gerada.gabarito}, resolvido ${letraEscolhida}) — tentativa ${tentativa}/${maxTentativas}.`,
    );
  }

  return null;
}
