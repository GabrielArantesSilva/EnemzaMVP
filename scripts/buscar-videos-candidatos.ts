import "dotenv/config";
import { writeFileSync, mkdirSync } from "fs";
import { listarVideosCandidatos } from "@/lib/youtube-api";

// Classificação por módulo (transcript + LLM) é etapa seguinte — ver .harness/context.md.
const CANAIS = ["@CursoEnemGratuito", "@ProENEMOficial"] as const;
const DURACAO_MINIMA_SEGUNDOS = 180; // exclui shorts/trailers

async function main() {
  mkdirSync("scripts/output", { recursive: true });

  for (const handle of CANAIS) {
    console.log(`Buscando vídeos de ${handle}...`);
    const candidatos = await listarVideosCandidatos(handle);

    const filtrados = candidatos
      .filter((video) => video.duracaoSegundos >= DURACAO_MINIMA_SEGUNDOS)
      .sort((a, b) => b.viewCount - a.viewCount);

    const caminho = `scripts/output/candidatos-${handle.replace("@", "")}.json`;
    writeFileSync(caminho, JSON.stringify(filtrados, null, 2));
    console.log(
      `${handle}: ${candidatos.length} vídeos encontrados, ${filtrados.length} após filtro de duração. Salvo em ${caminho}.`,
    );
  }
}

main().catch((erro) => {
  console.error(erro);
  process.exitCode = 1;
});
