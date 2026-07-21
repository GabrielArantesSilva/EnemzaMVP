# Contrato de Integração: Gemini API (LLM)

- **Sistema**: Gemini REST API (`generativelanguage.googleapis.com`). Doc: `ai.google.dev/api`.
- **Tipo**: API REST — chamada direta via `fetch` em `src/lib/gemini.ts`, sem SDK (mesma filosofia dos ADR-001/002: evitar dependência quando a API é simples o bastante).
- **Autenticação**: `GEMINI_API_KEY` como query param (`?key=...`), variável de ambiente — nunca hardcoded. Formato da chave atual no `.env` é atípico; validar com uma chamada de teste antes de rodar o lote grande do pipeline.
- **Limites conhecidos** (free tier, 2026): `gemini-2.5-flash-lite` (classificação — `GEMINI_MODEL_CLASSIFICACAO`) 15 RPM / 1000 req/dia; `gemini-2.5-flash` (geração de questão — `GEMINI_MODEL_GERACAO`) 10 RPM / 250 req/dia. Modelos configuráveis via env var, não hardcoded, pra não depender de eu acertar o nome do modelo mais atual no futuro.
- **Custo**: gratuito dentro do free tier; mitigado rodando em lote único, delay entre chamadas (`extrair-transcripts.ts`/`classificar-videos.ts`/`gerar-questoes-llm.ts`) e retry/backoff interno em 429 (`gemini.ts`).
- **Modo de uso no Enemza**: exclusivamente batch/offline — classificação de vídeo, sub-classificação de questão de ciências da natureza, geração de questão + double-check. Nunca síncrono em rota de usuário final (ver `boundaries.md`).
- **Dados trocados**: título/transcript de vídeo (conteúdo de canal público, não pessoal) e enunciado de questão (não pessoal) saem para o Gemini. Nenhum dado de `Usuario` (nome/email) trafega para o Gemini.
- **Saída estruturada**: `generationConfig.response_mime_type: "application/json"` + `response_schema` (JSON Schema) força o formato de resposta — elimina parsing de texto livre.
- **Falhas conhecidas e tratamento**:
  - `429` (rate limit): retry com backoff exponencial, interno a `gemini.ts`, invisível pra quem chama.
  - Bloqueio por safety filter (`promptFeedback.blockReason` ou `finishReason: "SAFETY"`): lança `GeminiBloqueadoError`, tipo distinto de erro transitório — não deve ser contado como "divergência de negócio" no double-check (ver `src/lib/geracao-questao.ts`).
  - Resposta sem texto/JSON inválido: erro claro, sem fallback silencioso.
- **Se quebrar**: erro real (não-429, não-safety) propaga sem retry automático — scripts do pipeline falham com `process.exitCode = 1` e podem ser re-rodados (todos resumíveis, ver ADR-003).
