import { beforeEach, describe, expect, it } from "vitest";

import { prisma } from "@/lib/prisma";
import { gerarHashSenha } from "@/lib/senha";
import { abrirSessao } from "@/lib/sessao";
import { criarAula, criarModulo, criarUsuario, limparBanco } from "@test/db-utils";
import { definirSenhaPrimeiroAcesso, entrar, excluirContaAtual } from "@/modules/auth/auth.actions";
import { criarToken } from "@/lib/token";

describe("entrar", () => {
  beforeEach(async () => {
    await limparBanco();
  });

  it("autentica com e-mail e senha corretos", async () => {
    const senhaHash = await gerarHashSenha("senhasegura123");
    await criarUsuario({ email: "ana@enemza.local", senhaHash });

    await expect(entrar({ email: "ana@enemza.local", senha: "senhasegura123" })).resolves.toBeUndefined();
  });

  it("rejeita senha incorreta", async () => {
    const senhaHash = await gerarHashSenha("senhasegura123");
    await criarUsuario({ email: "ana@enemza.local", senhaHash });

    await expect(entrar({ email: "ana@enemza.local", senha: "errada" })).rejects.toThrow(/inválidos/i);
  });

  it("rejeita e-mail inexistente", async () => {
    await expect(entrar({ email: "naoexiste@enemza.local", senha: "qualquercoisa" })).rejects.toThrow(
      /inválidos/i,
    );
  });

  it("rejeita conta criada pelo webhook que ainda não definiu senha (senhaHash null)", async () => {
    await criarUsuario({ email: "ana@enemza.local", senhaHash: null });

    await expect(entrar({ email: "ana@enemza.local", senha: "qualquercoisa" })).rejects.toThrow(
      /inválidos/i,
    );
  });
});

describe("definirSenhaPrimeiroAcesso", () => {
  beforeEach(async () => {
    await limparBanco();
  });

  it("define a senha de uma conta pendente e abre sessão", async () => {
    const usuario = await criarUsuario({ senhaHash: null });
    const token = criarToken(usuario.id, "primeiro_acesso", 1000 * 60 * 60);

    await definirSenhaPrimeiroAcesso({ token, senha: "novasenha123" });

    const atualizado = await prisma.usuario.findUniqueOrThrow({ where: { id: usuario.id } });
    expect(atualizado.senhaHash).not.toBeNull();
    await expect(entrar({ email: atualizado.email, senha: "novasenha123" })).resolves.toBeUndefined();
  });

  it("rejeita token de tipo errado (ex: cookie de sessão)", async () => {
    const usuario = await criarUsuario({ senhaHash: null });
    const tokenDeSessao = criarToken(usuario.id, "sessao", 1000 * 60 * 60);

    await expect(
      definirSenhaPrimeiroAcesso({ token: tokenDeSessao, senha: "novasenha123" }),
    ).rejects.toThrow(/inválido/i);
  });

  it("rejeita token expirado", async () => {
    const usuario = await criarUsuario({ senhaHash: null });
    const tokenExpirado = criarToken(usuario.id, "primeiro_acesso", -1000);

    await expect(
      definirSenhaPrimeiroAcesso({ token: tokenExpirado, senha: "novasenha123" }),
    ).rejects.toThrow(/inválido/i);
  });
});

describe("excluirContaAtual", () => {
  beforeEach(async () => {
    await limparBanco();
  });

  it("remove o usuário e todos os dados vinculados (LGPD)", async () => {
    const usuario = await criarUsuario();
    const modulo = await criarModulo();
    const aula = await criarAula(modulo.id);

    await prisma.nota.create({ data: { usuarioId: usuario.id, moduloId: modulo.id, conteudo: "teste" } });
    await prisma.progressoAula.create({
      data: { usuarioId: usuario.id, aulaId: aula.id, concluida: true },
    });
    await prisma.xpMateria.create({ data: { usuarioId: usuario.id, moduloId: modulo.id, xp: 10 } });

    await abrirSessao(usuario.id);
    await excluirContaAtual();

    await expect(prisma.usuario.findUnique({ where: { id: usuario.id } })).resolves.toBeNull();
    await expect(prisma.nota.findMany({ where: { usuarioId: usuario.id } })).resolves.toEqual([]);
    await expect(prisma.progressoAula.findMany({ where: { usuarioId: usuario.id } })).resolves.toEqual([]);
    await expect(prisma.xpMateria.findMany({ where: { usuarioId: usuario.id } })).resolves.toEqual([]);
  });

  it("rejeita exclusão sem sessão válida", async () => {
    await expect(excluirContaAtual()).rejects.toThrow(/sessão/i);
  });
});
