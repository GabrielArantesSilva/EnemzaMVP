# Contrato de Integração: api.enem.dev (banco de questões INEP)

- **Sistema**: `api.enem.dev` — API pública/open-source mantida pela comunidade (não é o INEP diretamente, é um wrapper de terceiro sobre as provas públicas do ENEM). Doc: `docs.enem.dev`.
- **Tipo**: API REST.
- **Autenticação**: nenhuma observada na documentação.
- **Limites conhecidos**: nenhum rate limit documentado publicamente. `src/lib/enem-api.ts` pagina com `limit=50` por página.
- **Custo**: gratuito. Licença dos dados: GPL-2.0, uso livre sem exigência de atribuição (conforme `docs.enem.dev`).
- **Modo de uso no Enemza**: exclusivamente batch/offline, em `scripts/baixar-questoes-inep.ts` (5 anos recentes, disciplinas `matematica` + `ciencias-natureza`, ver ADR-003). Nunca em rota de usuário final.
- **Dados trocados**: nenhum dado do Enemza sai — só lemos. Recebemos enunciado, alternativas e gabarito de questões públicas do ENEM.
- **Mapeamento de campos** (nosso ↔ deles):
  - `discipline` (`matematica`/`linguagens`/`ciencias-humanas`/`ciencias-natureza`) → só usamos `matematica` (→ módulo "Matemática" direto) e `ciencias-natureza` (→ sub-classificado por Gemini em Física/Química/Biologia, ver `classificar-questoes-natureza.ts`). `linguagens`/`ciencias-humanas` **não são usadas** — decisão de produto já tomada (ver `boundaries.md`: INEP prioritário só pras 3 exatas).
  - `context` → `Questao.enunciado`.
  - `alternatives[].letter`/`.text` → `Questao.alternativas` (`{letra,texto}[]`).
  - `correctAlternative` → `Questao.gabarito`.
  - `files`/`alternatives[].file` → **não temos campo equivalente** (schema de `Questao` não suporta imagem). Questões com qualquer arquivo são filtradas fora em `baixar-questoes-inep.ts` — perda intencional de parte do pool, não bug.
- **Falhas conhecidas e tratamento**: resposta HTTP não-ok em qualquer página lança erro (fail-fast) — `baixar-questoes-inep.ts` não tem retry automático hoje; rodar de novo é seguro (não há upsert nesta etapa, só grava o JSON bruto).
- **Se quebrar**: é dependência de terceiro sem SLA. Se sair do ar ou mudar o schema de resposta, `listarQuestoesInep` lança erro claro (`api.enem.dev (${ano}) retornou ${status}`) — sem fallback automático pra outra fonte. Nesse caso, `montarProvaFinal` já lida bem com pool INEP zerado (100% LLM até o piso mínimo), então o produto não quebra, só perde a priorização de fonte oficial nas 3 disciplinas exatas.
