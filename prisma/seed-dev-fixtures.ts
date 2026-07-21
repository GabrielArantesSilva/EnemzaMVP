import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Dev-only: NÃO rodar em produção. canalOrigem "SEED_DEV" e fonte "SEED"
// marcam esses dados como fixture, nunca conteúdo curado real.
const VIDEO_TESTE = "https://www.youtube.com/watch?v=aqz-KE-bpKQ"; // Big Buck Bunny (CC)

async function main() {
  const matematica = await prisma.modulo.findFirstOrThrow({
    where: { nome: "Matemática" },
  });

  const aulasExistentes = await prisma.aula.count({
    where: { moduloId: matematica.id },
  });

  if (aulasExistentes > 0) {
    console.log("Fixtures de aula já existem — pulando.");
    return;
  }

  await prisma.aula.createMany({
    data: [
      {
        moduloId: matematica.id,
        titulo: "[fixture] Introdução às funções",
        youtubeUrl: `${VIDEO_TESTE}&fixture=1`,
        canalOrigem: "SEED_DEV",
        ordem: 1,
      },
      {
        moduloId: matematica.id,
        titulo: "[fixture] Equações do 2º grau",
        youtubeUrl: `${VIDEO_TESTE}&fixture=2`,
        canalOrigem: "SEED_DEV",
        ordem: 2,
      },
      {
        moduloId: matematica.id,
        titulo: "[fixture] Progressões aritméticas",
        youtubeUrl: `${VIDEO_TESTE}&fixture=3`,
        canalOrigem: "SEED_DEV",
        ordem: 3,
      },
    ],
  });
  console.log("3 aulas fixture criadas em Matemática.");

  const prova = await prisma.prova.create({
    data: { moduloId: matematica.id },
  });

  await prisma.questao.createMany({
    data: [
      {
        provaId: prova.id,
        fonte: "SEED",
        enunciado: "Qual o resultado de 7 + 8?",
        alternativas: [
          { letra: "A", texto: "13" },
          { letra: "B", texto: "15" },
          { letra: "C", texto: "17" },
          { letra: "D", texto: "16" },
        ],
        gabarito: "B",
      },
      {
        provaId: prova.id,
        fonte: "SEED",
        enunciado: "Qual é a raiz positiva da equação x² - 9 = 0?",
        alternativas: [
          { letra: "A", texto: "9" },
          { letra: "B", texto: "-3" },
          { letra: "C", texto: "3" },
          { letra: "D", texto: "0" },
        ],
        gabarito: "C",
      },
      {
        provaId: prova.id,
        fonte: "SEED",
        enunciado: "Na progressão aritmética (2, 5, 8, 11, ...), qual é o 6º termo?",
        alternativas: [
          { letra: "A", texto: "14" },
          { letra: "B", texto: "17" },
          { letra: "C", texto: "20" },
          { letra: "D", texto: "23" },
        ],
        gabarito: "B",
      },
      {
        provaId: prova.id,
        fonte: "SEED",
        enunciado: "Qual fração representa 0,25?",
        alternativas: [
          { letra: "A", texto: "1/2" },
          { letra: "B", texto: "1/5" },
          { letra: "C", texto: "1/4" },
          { letra: "D", texto: "2/5" },
        ],
        gabarito: "C",
      },
    ],
  });
  console.log(`Prova fixture criada (${prova.id}) com 4 questões.`);
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
