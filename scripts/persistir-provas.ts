import "dotenv/config";

import { prisma } from "@/lib/prisma";
import { montarProvaFinal } from "@/lib/montagem-prova";
import { lerJsonSeExiste } from "@/lib/arquivo-json";
import type { QuestaoInep } from "@/lib/enem-api.types";
import type { QuestaoValidada } from "@/lib/geracao-questao.types";

interface QuestaoInepClassificada extends QuestaoInep {
  moduloNome: string;
}

const MODULOS = [
  "Português",
  "Literatura",
  "Inglês",
  "Matemática",
  "História",
  "Geografia",
  "Filosofia",
  "Sociologia",
  "Física",
  "Química",
  "Biologia",
];

const CAMINHO_INEP_CLASSIFICADO = "scripts/output/questoes-inep-classificadas.json";
const CAMINHO_LLM_GERADAS = "scripts/output/questoes-llm-geradas.json";

async function main() {
  const inepClassificadas = lerJsonSeExiste<QuestaoInepClassificada[]>(CAMINHO_INEP_CLASSIFICADO, []);
  const llmGeradas = lerJsonSeExiste<Record<string, QuestaoValidada[]>>(CAMINHO_LLM_GERADAS, {});

  const modulosPendentes: string[] = [];

  for (const moduloNome of MODULOS) {
    const questoesInep = inepClassificadas.filter((questao) => questao.moduloNome === moduloNome);
    const questoesLlmValidadas = llmGeradas[moduloNome] ?? [];

    const resultado = montarProvaFinal({ moduloNome, questoesInep, questoesLlmValidadas });

    if (!resultado.ok) {
      console.warn(`${moduloNome}: ${resultado.erro} — pulando (não persiste prova incompleta).`);
      modulosPendentes.push(moduloNome);
      continue;
    }

    const modulo = await prisma.modulo.findFirst({ where: { nome: moduloNome }, select: { id: true } });
    if (!modulo) {
      console.warn(`Módulo "${moduloNome}" não encontrado — pulando.`);
      continue;
    }

    try {
      await prisma.$transaction(async (tx) => {
        const prova = await tx.prova.upsert({
          where: { moduloId: modulo.id },
          update: {},
          create: { moduloId: modulo.id },
        });

        // Reruns não devem acumular questões duplicadas na mesma Prova.
        await tx.questao.deleteMany({ where: { provaId: prova.id } });

        await tx.questao.createMany({
          data: resultado.questoes.map((questao) => ({
            provaId: prova.id,
            fonte: questao.fonte,
            enunciado: questao.enunciado,
            alternativas: questao.alternativas,
            gabarito: questao.gabarito,
            validadaDouble: questao.validadaDouble,
          })),
        });
      });

      console.log(`${moduloNome}: prova persistida com ${resultado.questoes.length} questão(ões).`);
    } catch (erro) {
      console.error(`${moduloNome}: falha ao persistir — pulando pra próximo módulo.`, erro);
      modulosPendentes.push(moduloNome);
    }
  }

  if (modulosPendentes.length > 0) {
    console.warn(`Módulos sem prova (abaixo do piso mínimo): ${modulosPendentes.join(", ")}`);
  }
  console.log("Persistência de provas concluída.");
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
