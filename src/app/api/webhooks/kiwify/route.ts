import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

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

  const payload = await request.json();
  await processarCompraAprovada(payload);

  return NextResponse.json({ ok: true });
}
