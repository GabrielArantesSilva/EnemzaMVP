import type { GerarConteudoEstruturadoInput } from "./gemini.types";

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const MAX_TENTATIVAS_RATE_LIMIT = 5;
const DELAY_BASE_MS = 2000;

export class GeminiBloqueadoError extends Error {
  constructor(motivo: string) {
    super(`Gemini bloqueou a geração: ${motivo}`);
    this.name = "GeminiBloqueadoError";
  }
}

function chaveApi(): string {
  const chave = process.env.GEMINI_API_KEY;
  if (!chave) throw new Error("GEMINI_API_KEY não configurada");
  return chave;
}

function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface RespostaGemini {
  candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
  promptFeedback?: { blockReason?: string };
}

async function chamarGemini(modelo: string, corpo: unknown): Promise<RespostaGemini> {
  const url = `${BASE_URL}/${modelo}:generateContent?key=${chaveApi()}`;

  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS_RATE_LIMIT; tentativa++) {
    const resposta = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo),
    });

    if (resposta.status === 429 && tentativa < MAX_TENTATIVAS_RATE_LIMIT) {
      await esperar(DELAY_BASE_MS * 2 ** (tentativa - 1));
      continue;
    }

    if (!resposta.ok) {
      throw new Error(`Gemini (${modelo}) retornou ${resposta.status}`);
    }

    return (await resposta.json()) as RespostaGemini;
  }

  throw new Error(`Gemini (${modelo}) excedeu tentativas de rate limit`);
}

// Retry/backoff em 429 fica todo aqui dentro — quem chama só recebe o
// resultado final ou um erro real (nunca "tentativa esgotada por cota").
export async function gerarConteudoEstruturado<T>({
  modelo,
  prompt,
  schema,
}: GerarConteudoEstruturadoInput): Promise<T> {
  const dados = await chamarGemini(modelo, {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      response_mime_type: "application/json",
      response_schema: schema,
    },
  });

  if (dados.promptFeedback?.blockReason) {
    throw new GeminiBloqueadoError(dados.promptFeedback.blockReason);
  }

  const candidato = dados.candidates?.[0];
  if (!candidato || candidato.finishReason === "SAFETY") {
    throw new GeminiBloqueadoError(candidato?.finishReason ?? "resposta vazia");
  }

  const texto = candidato.content?.parts?.[0]?.text;
  if (!texto) {
    throw new Error("Gemini retornou resposta sem texto");
  }

  return JSON.parse(texto) as T;
}
