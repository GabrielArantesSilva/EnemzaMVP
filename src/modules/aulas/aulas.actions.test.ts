import { beforeEach, describe, expect, it } from "vitest";

import { concluirAula } from "@/modules/aulas/aulas.actions";
import { prisma } from "@/lib/prisma";
import { abrirSessao, encerrarSessao } from "@/lib/sessao";
import { criarAula, criarModulo, criarUsuario, limparBanco } from "@test/db-utils";

describe("concluirAula — XP e nível", () => {
  let usuarioId: string;
  let moduloId: string;
  let aula1Id: string;
  let aula2Id: string;

  beforeEach(async () => {
    await limparBanco();
    const usuario = await criarUsuario();
    const modulo = await criarModulo();
    const aula1 = await criarAula(modulo.id, { xpRecompensa: 10 });
    const aula2 = await criarAula(modulo.id, { xpRecompensa: 15 });

    usuarioId = usuario.id;
    moduloId = modulo.id;
    aula1Id = aula1.id;
    aula2Id = aula2.id;
    await abrirSessao(usuarioId);
  });

  it("rejeita sem sessão válida", async () => {
    await encerrarSessao();
    await expect(concluirAula(aula1Id)).rejects.toThrow(/sessão/i);
  });

  it("soma xpTotal e XpMateria sem incrementar nível enquanto faltar aula no módulo", async () => {
    await concluirAula(aula1Id);

    const usuario = await prisma.usuario.findUniqueOrThrow({ where: { id: usuarioId } });
    const xpMateria = await prisma.xpMateria.findUniqueOrThrow({
      where: { usuarioId_moduloId: { usuarioId, moduloId } },
    });

    expect(usuario.xpTotal).toBe(10);
    expect(usuario.nivel).toBe(1);
    expect(xpMateria.xp).toBe(10);
  });

  it("incrementa nível ao concluir a última aula pendente do módulo", async () => {
    await concluirAula(aula1Id);
    await concluirAula(aula2Id);

    const usuario = await prisma.usuario.findUniqueOrThrow({ where: { id: usuarioId } });
    expect(usuario.xpTotal).toBe(25);
    expect(usuario.nivel).toBe(2);
  });

  it("é idempotente — concluir a mesma aula duas vezes não soma XP em dobro", async () => {
    await concluirAula(aula1Id);
    await concluirAula(aula1Id);

    const usuario = await prisma.usuario.findUniqueOrThrow({ where: { id: usuarioId } });
    const xpMateria = await prisma.xpMateria.findUniqueOrThrow({
      where: { usuarioId_moduloId: { usuarioId, moduloId } },
    });

    expect(usuario.xpTotal).toBe(10);
    expect(xpMateria.xp).toBe(10);
  });
});
