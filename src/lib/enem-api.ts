import type { QuestaoInep } from "./enem-api.types";

const BASE_URL = "https://api.enem.dev/v1";
const TAMANHO_PAGINA = 50;
const MAX_TENTATIVAS_RATE_LIMIT = 5;
const DELAY_BASE_MS = 2000;

function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface AlternativaBruta {
  letter: string;
  text: string;
  file: string | null;
}

interface QuestaoBruta {
  index: number;
  discipline: string;
  context: string | null;
  files: string[];
  correctAlternative: string;
  alternatives: AlternativaBruta[];
}

const REGEX_IMAGEM_MARKDOWN = /!\[[^\]]*\]\([^)]*\)/;

interface RespostaQuestoes {
  metadata: { hasMore: boolean };
  questions: QuestaoBruta[];
}

// api.enem.dev — API pública/open-source (não é o INEP diretamente). Sem
// autenticação. Ver .harness/integrations/enem-dev-api.md.
async function buscarPagina(ano: number, offset: number): Promise<RespostaQuestoes> {
  const url = new URL(`${BASE_URL}/exams/${ano}/questions`);
  url.searchParams.set("limit", String(TAMANHO_PAGINA));
  url.searchParams.set("offset", String(offset));

  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS_RATE_LIMIT; tentativa++) {
    const resposta = await fetch(url);

    if (resposta.status === 429 && tentativa < MAX_TENTATIVAS_RATE_LIMIT) {
      await esperar(DELAY_BASE_MS * 2 ** (tentativa - 1));
      continue;
    }

    if (!resposta.ok) {
      throw new Error(`api.enem.dev (${ano}) retornou ${resposta.status}`);
    }

    return (await resposta.json()) as RespostaQuestoes;
  }

  throw new Error(`api.enem.dev (${ano}) excedeu tentativas de rate limit`);
}

async function listarQuestoesDoAno(ano: number): Promise<QuestaoBruta[]> {
  const todas: QuestaoBruta[] = [];
  let offset = 0;
  let temMais = true;

  while (temMais) {
    const dados = await buscarPagina(ano, offset);
    todas.push(...dados.questions);

    temMais = dados.metadata.hasMore;
    offset += TAMANHO_PAGINA;
  }

  return todas;
}

export async function listarQuestoesInep(anos: number[], disciplinas: string[]): Promise<QuestaoInep[]> {
  const resultado: QuestaoInep[] = [];

  for (const ano of anos) {
    const questoes = await listarQuestoesDoAno(ano);

    for (const questao of questoes) {
      if (!disciplinas.includes(questao.discipline)) continue;
      if (!questao.context) continue;

      const temImagem =
        questao.files.length > 0 ||
        questao.alternatives.some((alt) => alt.file !== null) ||
        REGEX_IMAGEM_MARKDOWN.test(questao.context);

      resultado.push({
        ano,
        indice: questao.index,
        disciplina: questao.discipline,
        enunciado: questao.context,
        temImagem,
        alternativas: questao.alternatives.map((alt) => ({ letra: alt.letter, texto: alt.text })),
        gabarito: questao.correctAlternative,
      });
    }
  }

  return resultado;
}
