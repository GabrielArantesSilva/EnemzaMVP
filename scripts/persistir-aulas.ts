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

    console.log(`${moduloNome}: ${selecionados.length} aula(s) upsertada(s).`);
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
