import "dotenv/config";
import { writeFileSync, mkdirSync } from "fs";
import { listarVideosCandidatos, listarVideosPorBusca } from "@/lib/youtube-api";

const CANAIS = ["@CursoEnemGratuito", "@ProENEMOficial"] as const;
const DURACAO_MINIMA_SEGUNDOS = 180; // exclui shorts/trailers

// Termos de busca pontuais pra equilibrar módulos que a curadoria por canal deixou estreitos
// (Português dominado por vídeo de redação) ou incompletos (Inglês abaixo de 12 aulas) — ver TD-0014.
const BUSCAS: Record<string, string> = {
  BuscaPortuguesGramatica: "gramática para o Enem",
  BuscaPortuguesInterpretacao: "interpretação de texto para o Enem",
  BuscaLiteraturaEnem: "literatura brasileira para o Enem",
  BuscaIngles: "aula de inglês para o Enem",
  BuscaInglesInterpretacao: "interpretação de texto em inglês Enem",
};

function salvarCandidatos(arquivo: string, candidatos: Awaited<ReturnType<typeof listarVideosCandidatos>>) {
  const filtrados = candidatos
    .filter((video) => video.duracaoSegundos >= DURACAO_MINIMA_SEGUNDOS)
    .sort((a, b) => b.viewCount - a.viewCount);

  const caminho = `scripts/output/candidatos-${arquivo}.json`;
  writeFileSync(caminho, JSON.stringify(filtrados, null, 2));
  console.log(
    `${arquivo}: ${candidatos.length} vídeos encontrados, ${filtrados.length} após filtro de duração. Salvo em ${caminho}.`,
  );
}

async function main() {
  mkdirSync("scripts/output", { recursive: true });

  for (const handle of CANAIS) {
    console.log(`Buscando vídeos de ${handle}...`);
    salvarCandidatos(handle.replace("@", ""), await listarVideosCandidatos(handle));
  }

  for (const [arquivo, query] of Object.entries(BUSCAS)) {
    console.log(`Buscando vídeos para "${query}"...`);
    salvarCandidatos(arquivo, await listarVideosPorBusca(query));
  }
}

main().catch((erro) => {
  console.error(erro);
  process.exitCode = 1;
});
