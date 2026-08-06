import { prisma } from "@/lib/prisma";
import type { ItemHistorico, PerfilUsuario } from "./perfil.types";

export async function getPerfilUsuario(usuarioId: string): Promise<PerfilUsuario> {
  const usuario = await prisma.usuario.findUniqueOrThrow({
    where: { id: usuarioId },
    select: { nome: true, email: true, xpTotal: true, nivel: true, planoExpiraEm: true },
  });

  const modulos = await prisma.modulo.findMany({
    orderBy: { ordem: "asc" },
    select: {
      id: true,
      nome: true,
      corHex: true,
      aulas: { select: { xpRecompensa: true } },
      xpMateria: { where: { usuarioId }, select: { xp: true } },
    },
  });

  const xpPorMateria = modulos.map((modulo) => ({
    id: modulo.id,
    nome: modulo.nome,
    corHex: modulo.corHex,
    xp: modulo.xpMateria[0]?.xp ?? 0,
    xpMaximo: modulo.aulas.reduce((soma, aula) => soma + aula.xpRecompensa, 0),
  }));

  const [aulasConcluidas, provasFeitas, somaProvas] = await Promise.all([
    prisma.historicoEstudo.count({ where: { usuarioId, tipo: "aula" } }),
    prisma.historicoEstudo.count({ where: { usuarioId, tipo: "prova" } }),
    prisma.historicoEstudo.aggregate({
      where: { usuarioId, tipo: "prova" },
      _sum: { acertos: true, totalQuestoes: true },
    }),
  ]);

  const historico = (await prisma.historicoEstudo.findMany({
    where: { usuarioId },
    orderBy: { criadoEm: "desc" },
    take: 20,
    select: { id: true, tipo: true, titulo: true, acertos: true, totalQuestoes: true, criadoEm: true },
  })) as ItemHistorico[];

  const acertos = somaProvas._sum.acertos ?? 0;
  const totalQuestoes = somaProvas._sum.totalQuestoes ?? 0;
  const taxaAcerto = totalQuestoes > 0 ? Math.round((acertos / totalQuestoes) * 100) : null;

  return {
    nome: usuario.nome,
    email: usuario.email,
    xpTotal: usuario.xpTotal,
    nivel: usuario.nivel,
    planoExpiraEm: usuario.planoExpiraEm,
    xpPorMateria,
    estatisticas: { aulasConcluidas, provasFeitas, taxaAcerto },
    historico,
  };
}
