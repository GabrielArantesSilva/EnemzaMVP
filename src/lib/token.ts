import { createHmac, timingSafeEqual } from "node:crypto";

import type { TipoToken } from "./token.types";

// tipo evita que um token de primeiro acesso seja aceito como cookie de sessão (ou vice-versa).
interface PayloadToken {
  usuarioId: string;
  tipo: TipoToken;
  expiraEm: number;
}

function obterSegredo(): string {
  const segredo = process.env.SESSION_SECRET;
  if (!segredo) {
    throw new Error("SESSION_SECRET não configurado.");
  }
  return segredo;
}

function assinar(payloadBase64: string): string {
  return createHmac("sha256", obterSegredo()).update(payloadBase64).digest("hex");
}

// Pura — testável diretamente, inclusive expiração, passando `agora`
// explicitamente em vez de depender de Date.now() real.
export function criarToken(
  usuarioId: string,
  tipo: TipoToken,
  duracaoMs: number,
  agora = Date.now(),
): string {
  const payload: PayloadToken = { usuarioId, tipo, expiraEm: agora + duracaoMs };
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${payloadBase64}.${assinar(payloadBase64)}`;
}

export function verificarToken(
  token: string,
  tipoEsperado: TipoToken,
  agora = Date.now(),
): { usuarioId: string } | null {
  const [payloadBase64, assinatura] = token.split(".");
  if (!payloadBase64 || !assinatura) return null;

  const assinaturaEsperada = assinar(payloadBase64);
  const bufRecebido = Buffer.from(assinatura, "hex");
  const bufEsperado = Buffer.from(assinaturaEsperada, "hex");
  if (bufRecebido.length !== bufEsperado.length || !timingSafeEqual(bufRecebido, bufEsperado)) {
    return null;
  }

  let payload: PayloadToken;
  try {
    payload = JSON.parse(Buffer.from(payloadBase64, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (typeof payload.usuarioId !== "string" || typeof payload.expiraEm !== "number") return null;
  if (payload.tipo !== tipoEsperado) return null;
  if (agora > payload.expiraEm) return null;

  return { usuarioId: payload.usuarioId };
}
