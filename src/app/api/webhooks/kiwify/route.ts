import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { reenviarEmailsPendentes } from "@/modules/auth/email-primeiro-acesso";
import { processarCompraAprovada } from "@/modules/auth/webhook-kiwify";

function tokenValido(recebido: string | null): boolean {
  const esperado = process.env.KIWIFY_WEBHOOK_TOKEN;
  if (!esperado || !recebido) return false;

  const bufRecebido = Buffer.from(recebido);
  const bufEsperado = Buffer.from(esperado);
  return bufRecebido.length === bufEsperado.length && timingSafeEqual(bufRecebido, bufEsperado);
}

export async function POST(request: NextRequest) {
  if (!tokenValido(request.nextUrl.searchParams.get("token"))) {
    return NextResponse.json({ erro: "não autorizado" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ erro: "payload inválido" }, { status: 400 });
  }

  try {
    await processarCompraAprovada(payload);
  } catch (erro) {
    // Payload que foge do schema é erro permanente — 4xx faz a Kiwify parar
    // de tentar (retry não corrigiria). Erros transitórios (ex: banco fora)
    // sobem como 500 e a Kiwify reenvia.
    if (erro instanceof ZodError) {
      return NextResponse.json({ erro: "payload inválido" }, { status: 400 });
    }
    throw erro;
  }

  // Self-healing (TD-0010): cada evento real que chega drena os envios
  // pendentes — não depende do cron, que não roda no plano gratuito da Vercel.
  await reenviarEmailsPendentes();

  return NextResponse.json({ ok: true });
}
