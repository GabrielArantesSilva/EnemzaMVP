import { gerarConteudoEstruturado } from "./gemini";

const MODELO = process.env.GEMINI_MODEL_CLASSIFICACAO ?? "gemini-flash-lite-latest";
const DISCIPLINAS_NATUREZA = ["Física", "Química", "Biologia"];

// api.enem.dev agrupa Física+Química+Biologia em "ciencias-natureza" — esta
// função sub-classifica pelo conteúdo do enunciado.
export async function classificarDisciplinaNatureza(enunciado: string): Promise<{ moduloNome: string }> {
  const prompt = [
    "A questão abaixo é da área de Ciências da Natureza do ENEM (Física, Química ou Biologia).",
    "Identifique a qual das três disciplinas ela pertence, pelo conteúdo do enunciado.",
    `Enunciado: ${enunciado}`,
  ].join("\n\n");

  return gerarConteudoEstruturado<{ moduloNome: string }>({
    modelo: MODELO,
    prompt,
    schema: {
      type: "OBJECT",
      properties: { moduloNome: { type: "STRING", enum: DISCIPLINAS_NATUREZA } },
      required: ["moduloNome"],
    },
  });
}
