import { cookies } from "next/headers";

import { criarToken, verificarToken } from "@/lib/token";

const NOME_COOKIE = "enemza_sessao";
const DURACAO_SESSAO_MS = 1000 * 60 * 60 * 24 * 30; // 30 dias

export async function abrirSessao(usuarioId: string): Promise<void> {
  const store = await cookies();
  store.set(NOME_COOKIE, criarToken(usuarioId, "sessao", DURACAO_SESSAO_MS), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURACAO_SESSAO_MS / 1000,
  });
}

export async function lerSessao(): Promise<{ usuarioId: string } | null> {
  const store = await cookies();
  const token = store.get(NOME_COOKIE)?.value;
  if (!token) return null;
  return verificarToken(token, "sessao");
}

export async function encerrarSessao(): Promise<void> {
  const store = await cookies();
  store.delete(NOME_COOKIE);
}
