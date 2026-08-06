import { NextRequest, NextResponse } from "next/server";

import { reenviarEmailsPendentes } from "@/modules/auth/email-primeiro-acesso";

// Vercel Cron (ver vercel.json) protegido por CRON_SECRET. No plano Hobby o
// cron roda no máximo 1x/dia (limite da Vercel) — é a rede de segurança do
// dreno; o self-healing principal é a chamada ao dreno no próprio webhook da
// Kiwify (ver ADR-002 amendment 2026-08-05). Sem CRON_SECRET configurado a
// rota responde 401 (inofensivo, rota não pública).
export async function GET(request: NextRequest) {
  if (request.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ erro: "não autorizado" }, { status: 401 });
  }

  const processados = await reenviarEmailsPendentes();
  return NextResponse.json({ ok: true, processados });
}
