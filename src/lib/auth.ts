import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { lerSessao } from "@/lib/sessao";

// Ver ADR-001. Chamada como primeira linha de cada página — é isso que protege a rota.
export async function getUsuarioAtual() {
  const sessao = await lerSessao();
  if (!sessao) {
    redirect("/login");
  }

  const usuario = await prisma.usuario.findUnique({
    where: { id: sessao.usuarioId },
    select: { id: true },
  });

  if (!usuario) {
    redirect("/login");
  }

  return usuario;
}

// Ao contrário de getUsuarioAtual, não redireciona quando não há sessão.
export async function getUsuarioIdSeAutenticado(): Promise<string | null> {
  const sessao = await lerSessao();
  return sessao?.usuarioId ?? null;
}
