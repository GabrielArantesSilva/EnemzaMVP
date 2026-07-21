import { PrismaClient } from "@prisma/client";

import { gerarHashSenha } from "@/lib/senha";

const prisma = new PrismaClient();

// Senha de dev do usuário demo — só para ambiente local, nunca produção.
const SENHA_DEMO = "dev12345";

// Ordem de exibição segue a área do ENEM: Linguagens > Matemática > Humanas > Natureza.
// Ver .harness/domain-glossary.md e .harness/context.md.
const MODULOS = [
  { nome: "Português", ordem: 1, corHex: "#5B8DEF" },
  { nome: "Literatura", ordem: 2, corHex: "#A462F5" },
  { nome: "Inglês", ordem: 3, corHex: "#F56AAE" },
  { nome: "Matemática", ordem: 4, corHex: "#34D399" },
  { nome: "História", ordem: 5, corHex: "#E8974E" },
  { nome: "Geografia", ordem: 6, corHex: "#2FA6A6" },
  { nome: "Filosofia", ordem: 7, corHex: "#6366F1" },
  { nome: "Sociologia", ordem: 8, corHex: "#F2664B" },
  { nome: "Física", ordem: 9, corHex: "#38BDF8" },
  { nome: "Química", ordem: 10, corHex: "#84CC16" },
  { nome: "Biologia", ordem: 11, corHex: "#22C55E" },
] as const;

async function main() {
  const jaExistem = await prisma.modulo.count();
  if (jaExistem === 0) {
    await prisma.modulo.createMany({ data: [...MODULOS] });
    console.log(`${MODULOS.length} módulos criados.`);
  } else {
    console.log(`${jaExistem} módulos já existiam — pulando.`);
  }

  const senhaHash = await gerarHashSenha(SENHA_DEMO);
  const usuarioDemo = await prisma.usuario.upsert({
    where: { email: "dev@enemza.local" },
    update: { senhaHash },
    create: { nome: "Usuário Demo", email: "dev@enemza.local", senhaHash },
  });
  console.log(`Usuário demo: ${usuarioDemo.id} (login: dev@enemza.local / ${SENHA_DEMO})`);
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
