import { prisma } from "@/lib/prisma";

let contador = 0;

export async function limparBanco() {
  await prisma.$transaction([
    prisma.questao.deleteMany(),
    prisma.prova.deleteMany(),
    prisma.nota.deleteMany(),
    prisma.progressoAula.deleteMany(),
    prisma.xpMateria.deleteMany(),
    prisma.aula.deleteMany(),
    prisma.modulo.deleteMany(),
    prisma.usuario.deleteMany(),
  ]);
}

export async function criarUsuario(
  overrides: Partial<{ nome: string; email: string; senhaHash: string | null }> = {},
) {
  contador += 1;
  return prisma.usuario.create({
    data: {
      nome: overrides.nome ?? `Usuário Teste ${contador}`,
      email: overrides.email ?? `teste-${contador}@enemza.local`,
      senhaHash: "senhaHash" in overrides ? overrides.senhaHash : "fixture:nao-verificavel-em-testes-sem-senha-real",
    },
  });
}

export async function criarModulo(
  overrides: Partial<{ nome: string; ordem: number; corHex: string }> = {},
) {
  contador += 1;
  return prisma.modulo.create({
    data: {
      nome: overrides.nome ?? `Módulo Teste ${contador}`,
      ordem: overrides.ordem ?? contador,
      corHex: overrides.corHex ?? "#000000",
    },
  });
}

export async function criarAula(
  moduloId: string,
  overrides: Partial<{ titulo: string; youtubeUrl: string; xpRecompensa: number; ordem: number }> = {},
) {
  contador += 1;
  return prisma.aula.create({
    data: {
      moduloId,
      titulo: overrides.titulo ?? `Aula Teste ${contador}`,
      youtubeUrl: overrides.youtubeUrl ?? `https://www.youtube.com/watch?v=teste-${contador}`,
      canalOrigem: "SEED_DEV",
      ordem: overrides.ordem ?? contador,
      xpRecompensa: overrides.xpRecompensa ?? 10,
    },
  });
}
