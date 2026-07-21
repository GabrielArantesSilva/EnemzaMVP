const LANGS_TENTATIVAS = ["pt", "pt-BR"] as const;

const ENTIDADES_HTML: Record<string, string> = {
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
  "&lt;": "<",
  "&gt;": ">",
};

function decodificarEntidades(texto: string): string {
  return texto.replace(/&amp;|&quot;|&#39;|&lt;|&gt;/g, (entidade) => ENTIDADES_HTML[entidade] ?? entidade);
}

function extrairTextoDoXml(xml: string): string {
  const trechos = [...xml.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)].map((match) => match[1]);
  return trechos
    .map(decodificarEntidades)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

async function buscarXmlLegenda(videoId: string, lang: string): Promise<string | null> {
  const resposta = await fetch(`https://www.youtube.com/api/timedtext?v=${videoId}&lang=${lang}`);
  if (!resposta.ok) return null;

  const xml = await resposta.text();
  return xml.trim().length > 0 ? xml : null;
}

// Endpoint não-oficial do YouTube — sem chave/OAuth, só funciona pra vídeo
// com legenda (manual ou automática). Ver .harness/integrations/youtube-timedtext.md.
export async function obterTranscript(videoId: string): Promise<string | null> {
  for (const lang of LANGS_TENTATIVAS) {
    const xml = await buscarXmlLegenda(videoId, lang);
    if (!xml) continue;

    const texto = extrairTextoDoXml(xml);
    if (texto) return texto;
  }

  return null;
}
