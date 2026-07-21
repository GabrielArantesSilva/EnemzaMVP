import "dotenv/config";

import { obterTranscript } from "@/lib/youtube-transcript";
import { escreverJsonAtomico, lerJsonSeExiste } from "@/lib/arquivo-json";

interface VideoCandidato {
  videoId: string;
  titulo: string;
  viewCount: number;
}

interface TranscriptRegistro {
  videoId: string;
  transcript: string | null;
}

const ARQUIVOS_CANDIDATOS = [
  "scripts/output/candidatos-CursoEnemGratuito.json",
  "scripts/output/candidatos-ProENEMOficial.json",
];
const CAMINHO_SAIDA = "scripts/output/transcripts.json";
const DELAY_MS = 300;
const GRAVAR_A_CADA = 10;
// Mesmo corte de classificar-videos.ts — canal tem milhares de vídeos, só precisamos de ~132.
const MAX_CANDIDATOS_POR_CANAL = 300;

function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const candidatos: VideoCandidato[] = ARQUIVOS_CANDIDATOS.flatMap((caminho) =>
    [...lerJsonSeExiste<VideoCandidato[]>(caminho, [])]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, MAX_CANDIDATOS_POR_CANAL),
  );

  const resultados = lerJsonSeExiste<TranscriptRegistro[]>(CAMINHO_SAIDA, []);
  const jaProcessados = new Set(resultados.map((registro) => registro.videoId));

  const pendentes = candidatos.filter((video) => !jaProcessados.has(video.videoId));
  console.log(`${pendentes.length} vídeos pendentes de transcript (${jaProcessados.size} já processados).`);

  let processadosNestaExecucao = 0;
  for (const video of pendentes) {
    const transcript = await obterTranscript(video.videoId);
    resultados.push({ videoId: video.videoId, transcript });
    processadosNestaExecucao += 1;

    if (processadosNestaExecucao % GRAVAR_A_CADA === 0) {
      escreverJsonAtomico(CAMINHO_SAIDA, resultados);
      console.log(`${resultados.length} vídeos processados até agora...`);
    }

    await esperar(DELAY_MS);
  }

  escreverJsonAtomico(CAMINHO_SAIDA, resultados);
  const comLegenda = resultados.filter((registro) => registro.transcript).length;
  console.log(`Concluído: ${resultados.length} vídeos (${comLegenda} com legenda encontrada).`);
}

main().catch((erro) => {
  console.error(erro);
  process.exitCode = 1;
});
