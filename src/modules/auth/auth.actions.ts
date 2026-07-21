"use server";

import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { gerarHashSenha, verificarSenha } from "@/lib/senha";
import { abrirSessao, encerrarSessao, lerSessao } from "@/lib/sessao";
import { verificarToken } from "@/lib/token";
import type { DefinirSenhaInput, LoginInput } from "./auth.types";

const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido."),
  senha: z.string().min(1, "Informe a senha."),
});

const DefinirSenhaSchema = z.object({
  token: z.string().min(1),
  senha: z.string().min(8, "A senha precisa ter pelo menos 8 caracteres."),
});

export async function entrar(input: LoginInput): Promise<void> {
  const dados = LoginSchema.parse(input);

  const usuario = await prisma.usuario.findUnique({
    where: { email: dados.email },
    select: { id: true, senhaHash: true },
  });

  if (!usuario || !usuario.senhaHash || !(await verificarSenha(dados.senha, usuario.senhaHash))) {
    throw new Error("E-mail ou senha inválidos.");
  }

  await abrirSessao(usuario.id);
}

// Conta criada pelo webhook da Kiwify (senhaHash null) só ganha senha aqui — ver ADR-002.
export async function definirSenhaPrimeiroAcesso(input: DefinirSenhaInput): Promise<void> {
  const dados = DefinirSenhaSchema.parse(input);

  const verificado = verificarToken(dados.token, "primeiro_acesso");
  if (!verificado) {
    throw new Error("Link inválido ou expirado.");
  }

  const senhaHash = await gerarHashSenha(dados.senha);
  await prisma.usuario.update({
    where: { id: verificado.usuarioId },
    data: { senhaHash },
  });

  await abrirSessao(verificado.usuarioId);
}

export async function sair(): Promise<void> {
  await encerrarSessao();
}

// usuarioId vem só da sessão — nunca de parâmetro do client (evita apagar conta alheia).
export async function excluirContaAtual(): Promise<void> {
  const sessao = await lerSessao();
  if (!sessao) {
    throw new Error("Sessão inválida.");
  }
  const { usuarioId } = sessao;

  await prisma.$transaction([
    prisma.nota.deleteMany({ where: { usuarioId } }),
    prisma.progressoAula.deleteMany({ where: { usuarioId } }),
    prisma.xpMateria.deleteMany({ where: { usuarioId } }),
    prisma.usuario.delete({ where: { id: usuarioId } }),
  ]);
  await encerrarSessao();
}
