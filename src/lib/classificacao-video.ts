import { gerarConteudoEstruturado } from "./gemini";
import type { VideoParaClassificar } from "./classificacao-video.types";

const MODELO = process.env.GEMINI_MODEL_CLASSIFICACAO ?? "gemini-flash-lite-latest";
const TAMANHO_TRANSCRIPT_MAX = 4000;

export async function classificarVideoPorModulo(
  video: VideoParaClassificar,
  modulos: string[],
): Promise<{ moduloNome: string }> {
  const prompt = [
    "Você classifica videoaulas de preparação para o ENEM em uma das disciplinas abaixo.",
    `Disciplinas possíveis: ${modulos.join(", ")}.`,
    `Título do vídeo: ${video.titulo}`,
    video.transcript
      ? `Trecho da transcrição: ${video.transcript.slice(0, TAMANHO_TRANSCRIPT_MAX)}`
      : "Transcrição indisponível — classifique só pelo título.",
    "Responda com a disciplina que melhor corresponde ao conteúdo do vídeo.",
  ].join("\n\n");

  return gerarConteudoEstruturado<{ moduloNome: string }>({
    modelo: MODELO,
    prompt,
    schema: {
      type: "OBJECT",
      properties: { moduloNome: { type: "STRING", enum: modulos } },
      required: ["moduloNome"],
    },
  });
}
