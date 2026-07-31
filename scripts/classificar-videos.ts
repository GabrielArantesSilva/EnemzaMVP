import "dotenv/config";

import { classificarVideoPorModulo } from "@/lib/classificacao-video";
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

interface VideoClassificado {
  videoId: string;
  titulo: string;
  viewCount: number;
  canalOrigem: string;
  moduloNome: string;
}

// Chave = nome do arquivo de candidatos (sem "candidatos-"/".json") → valor
// gravado em Aula.canalOrigem. Ver scripts/buscar-videos-candidatos.ts.
const CANAIS: Record<string, string> = {
  CursoEnemGratuito: "Curso Enem Gratuito",
  ProENEMOficial: "ProEnem",
  BuscaPortuguesGramatica: "Busca: gramática Enem",
  BuscaPortuguesInterpretacao: "Busca: interpretação de texto Enem",
  BuscaLiteraturaEnem: "Busca: literatura brasileira Enem",
  BuscaIngles: "Busca: aula de inglês Enem",
  BuscaInglesInterpretacao: "Busca: interpretação de texto em inglês Enem",
};

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

const CAMINHO_TRANSCRIPTS = "scripts/output/transcripts.json";
const CAMINHO_SAIDA = "scripts/output/classificacao-videos.json";
// ~14 chamadas/min — abaixo do limite de 15 RPM do free tier do modelo usado.
const DELAY_MS = 4300;
const GRAVAR_A_CADA = 5;
// Mesmo corte de extrair-transcripts.ts — canal tem milhares de vídeos, só precisamos de ~132.
const MAX_CANDIDATOS_POR_CANAL = 300;

function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const candidatosPorCanal = Object.entries(CANAIS).flatMap(([arquivo, canalOrigem]) =>
    [...lerJsonSeExiste<VideoCandidato[]>(`scripts/output/candidatos-${arquivo}.json`, [])]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, MAX_CANDIDATOS_POR_CANAL)
      .map((video) => ({ ...video, canalOrigem })),
  );

  const transcripts = new Map(
    lerJsonSeExiste<TranscriptRegistro[]>(CAMINHO_TRANSCRIPTS, []).map((registro) => [
      registro.videoId,
      registro.transcript,
    ]),
  );

  const resultados = lerJsonSeExiste<VideoClassificado[]>(CAMINHO_SAIDA, []);
  const jaClassificados = new Set(resultados.map((registro) => registro.videoId));

  const pendentes = candidatosPorCanal.filter((video) => !jaClassificados.has(video.videoId));
  console.log(`${pendentes.length} vídeos pendentes de classificação (${jaClassificados.size} já classificados).`);

  let processadosNestaExecucao = 0;
  for (const video of pendentes) {
    try {
      const { moduloNome } = await classificarVideoPorModulo(
        { titulo: video.titulo, transcript: transcripts.get(video.videoId) ?? null },
        MODULOS,
      );
      resultados.push({
        videoId: video.videoId,
        titulo: video.titulo,
        viewCount: video.viewCount,
        canalOrigem: video.canalOrigem,
        moduloNome,
      });
    } catch (erro) {
      console.error(`Falha ao classificar ${video.videoId} — tentará de novo na próxima execução.`, erro);
    }

    processadosNestaExecucao += 1;
    if (processadosNestaExecucao % GRAVAR_A_CADA === 0) {
      escreverJsonAtomico(CAMINHO_SAIDA, resultados);
      console.log(`${resultados.length} vídeos classificados até agora...`);
    }

    await esperar(DELAY_MS);
  }

  escreverJsonAtomico(CAMINHO_SAIDA, resultados);
  console.log(`Concluído: ${resultados.length} vídeos classificados.`);
}

main().catch((erro) => {
  console.error(erro);
  process.exitCode = 1;
});
