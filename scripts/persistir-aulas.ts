import "dotenv/config";

import { prisma } from "@/lib/prisma";
import { lerJsonSeExiste } from "@/lib/arquivo-json";

interface VideoClassificado {
  videoId: string;
  titulo: string;
  viewCount: number;
  canalOrigem: string;
  moduloNome: string;
}

const CAMINHO_CLASSIFICACAO = "scripts/output/classificacao-videos.json";
const VIDEOS_POR_MODULO = 12; // dentro da faixa 10-15 de .harness/context.md

async function main() {
  const classificados = lerJsonSeExiste<VideoClassificado[]>(CAMINHO_CLASSIFICACAO, []);
  if (classificados.length === 0) {
    throw new Error(`Nenhuma classificação encontrada em ${CAMINHO_CLASSIFICACAO} — rode classificar-videos.ts antes.`);
  }

  const porModulo = new Map<string, VideoClassificado[]>();
  for (const video of classificados) {
    const lista = porModulo.get(video.moduloNome) ?? [];
    lista.push(video);
    porModulo.set(video.moduloNome, lista);
  }

  for (const [moduloNome, videos] of porModulo) {
    const modulo = await prisma.modulo.findFirst({ where: { nome: moduloNome }, select: { id: true } });
    if (!modulo) {
      console.warn(`Módulo "${moduloNome}" não encontrado — pulando ${videos.length} vídeo(s).`);
      continue;
    }

    const selecionados = [...videos].sort((a, b) => b.viewCount - a.viewCount).slice(0, VIDEOS_POR_MODULO);
    const urlsSelecionadas = new Set(
      selecionados.map((video) => `https://www.youtube.com/watch?v=${video.videoId}`),
    );

    const existentes = await prisma.aula.findMany({
      where: { moduloId: modulo.id },
      select: { id: true, youtubeUrl: true, _count: { select: { progressoAulas: true, notas: true } } },
    });

    const orfasSemDependente = existentes.filter(
      (aula) =>
        !urlsSelecionadas.has(aula.youtubeUrl) &&
        aula._count.progressoAulas === 0 &&
        aula._count.notas === 0,
    );
    if (orfasSemDependente.length > 0) {
      await prisma.aula.deleteMany({ where: { id: { in: orfasSemDependente.map((aula) => aula.id) } } });
    }

    const orfasComDependente = existentes.filter(
      (aula) => !urlsSelecionadas.has(aula.youtubeUrl) && !orfasSemDependente.includes(aula),
    );
    if (orfasComDependente.length > 0) {
      console.warn(
        `${moduloNome}: ${orfasComDependente.length} aula(s) fora da seleção atual mantida(s) por ter progresso/nota de usuário vinculado.`,
      );
    }

    for (const [indice, video] of selecionados.entries()) {
      const youtubeUrl = `https://www.youtube.com/watch?v=${video.videoId}`;
      await prisma.aula.upsert({
        where: { moduloId_youtubeUrl: { moduloId: modulo.id, youtubeUrl } },
        update: { titulo: video.titulo, ordem: indice + 1 },
        create: {
          moduloId: modulo.id,
          titulo: video.titulo,
          youtubeUrl,
          canalOrigem: video.canalOrigem,
          ordem: indice + 1,
        },
      });
    }

    console.log(
      `${moduloNome}: ${selecionados.length} aula(s) upsertada(s), ${orfasSemDependente.length} órfã(s) removida(s).`,
    );
  }

  console.log("Persistência de aulas concluída.");
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
