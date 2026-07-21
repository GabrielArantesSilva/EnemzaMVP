import type { VideoCandidato } from "./youtube-api.types";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

function chaveApi(): string {
  const chave = process.env.YOUTUBE_API_KEY;
  if (!chave) throw new Error("YOUTUBE_API_KEY não configurada");
  return chave;
}

async function chamarApi<T>(caminho: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}/${caminho}`);
  for (const [chave, valor] of Object.entries(params)) url.searchParams.set(chave, valor);
  url.searchParams.set("key", chaveApi());

  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error(`YouTube API (${caminho}) retornou ${resposta.status}`);
  }
  return resposta.json() as Promise<T>;
}

async function getUploadsPlaylistId(handle: string): Promise<string> {
  const dados = await chamarApi<{
    items: { contentDetails: { relatedPlaylists: { uploads: string } } }[];
  }>("channels", { part: "contentDetails", forHandle: handle });

  const canal = dados.items[0];
  if (!canal) throw new Error(`Canal não encontrado: ${handle}`);
  return canal.contentDetails.relatedPlaylists.uploads;
}

async function listarItensDaPlaylist(
  playlistId: string,
): Promise<{ videoId: string; titulo: string; publicadoEm: string }[]> {
  const itens: { videoId: string; titulo: string; publicadoEm: string }[] = [];
  let pageToken: string | undefined;

  do {
    const dados = await chamarApi<{
      items: {
        snippet: { resourceId: { videoId: string }; title: string; publishedAt: string };
      }[];
      nextPageToken?: string;
    }>("playlistItems", {
      part: "snippet",
      maxResults: "50",
      playlistId,
      ...(pageToken ? { pageToken } : {}),
    });

    for (const item of dados.items) {
      itens.push({
        videoId: item.snippet.resourceId.videoId,
        titulo: item.snippet.title,
        publicadoEm: item.snippet.publishedAt,
      });
    }
    pageToken = dados.nextPageToken;
  } while (pageToken);

  return itens;
}

function paraSegundos(duracaoIso8601: string): number {
  const match = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(duracaoIso8601);
  const [, horas, minutos, segundos] = match ?? [];
  return Number(horas ?? 0) * 3600 + Number(minutos ?? 0) * 60 + Number(segundos ?? 0);
}

async function buscarEstatisticas(
  videoIds: string[],
): Promise<Map<string, { viewCount: number; duracaoSegundos: number }>> {
  const mapa = new Map<string, { viewCount: number; duracaoSegundos: number }>();

  for (let inicio = 0; inicio < videoIds.length; inicio += 50) {
    const lote = videoIds.slice(inicio, inicio + 50);
    const dados = await chamarApi<{
      items: {
        id: string;
        statistics: { viewCount?: string };
        contentDetails: { duration: string };
      }[];
    }>("videos", { part: "statistics,contentDetails", id: lote.join(",") });

    for (const item of dados.items) {
      mapa.set(item.id, {
        viewCount: Number(item.statistics.viewCount ?? 0),
        duracaoSegundos: paraSegundos(item.contentDetails.duration),
      });
    }
  }

  return mapa;
}

export async function listarVideosCandidatos(handle: string): Promise<VideoCandidato[]> {
  const playlistId = await getUploadsPlaylistId(handle);
  const itens = await listarItensDaPlaylist(playlistId);
  const estatisticas = await buscarEstatisticas(itens.map((item) => item.videoId));

  return itens.map((item) => ({
    videoId: item.videoId,
    titulo: item.titulo,
    publicadoEm: item.publicadoEm,
    viewCount: estatisticas.get(item.videoId)?.viewCount ?? 0,
    duracaoSegundos: estatisticas.get(item.videoId)?.duracaoSegundos ?? 0,
  }));
}
