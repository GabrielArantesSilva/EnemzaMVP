# Contrato de Integração: [Nome do sistema externo]

Template de contrato de integração (ADR-007). Preencher uma cópia por
integração externa relevante — ex: YouTube Data API / IFrame API, Gemini
API, banco de questões do INEP.

- **Sistema**: nome e link da documentação oficial.
- **Tipo**: API REST | SDK | embed/iframe | dataset estático.
- **Autenticação**: como a chave/credencial é obtida e onde vive
  (variável de ambiente da Vercel — nunca hardcoded).
- **Limites conhecidos**: rate limit, cota diária/mensal, tamanho máximo
  de payload.
- **Custo**: gratuito, free tier com limite, ou pago por chamada? Se
  pago/variável, qual a mitigação adotada (ex: lote único, menor volume
  possível)?
- **Modo de uso no Enemza**: síncrono (request de usuário) ou
  batch/offline (pipeline administrativo)? — no MVP, chamadas de LLM
  devem ser sempre batch/offline (ver `boundaries.md`).
- **Dados trocados**: quais dados saem do Enemza para o sistema externo e
  quais voltam. Algum dado pessoal (LGPD) está envolvido?
- **Falhas conhecidas e tratamento**: ver `patterns/error-handling.md` e
  `patterns/troubleshooting.md` para casos já mapeados (ex: rate limit do
  Gemini, vídeo indisponível no embed).
- **Restrições de ToS relevantes**: qualquer limitação contratual do
  provider que restrinja o que pode ser implementado (ex: proibição de
  cache/download de vídeo do YouTube).

---

## Exemplo já mapeado no projeto: YouTube (Data API + IFrame Embed API)

- **Tipo**: API REST (busca/metadata) + embed iframe (player).
- **Limites conhecidos**: quota da Data API por dia (usada só no pipeline
  de curadoria/transcript, não em runtime de usuário).
- **Custo**: gratuito dentro da quota padrão.
- **Modo de uso**: metadata/transcript via API em pipeline batch; player
  via iframe em runtime de usuário (síncrono, mas sem custo por chamada).
- **Restrições de ToS**: **proibido cachear/baixar vídeo** para uso
  offline — sempre embed ao vivo. Ver `boundaries.md`.

## Exemplo já mapeado no projeto: Gemini (LLM)

- **Tipo**: API REST.
- **Limites conhecidos**: free tier com rate limit baixo e cota diária.
- **Custo**: variável por chamada fora do free tier; nesta fase, mitigado
  rodando em lote único de menor volume possível.
- **Modo de uso**: exclusivamente batch/offline — categorização de vídeo e
  geração/double-check de questões. Nunca síncrono em request de usuário
  final.
- **Dados trocados**: transcript de vídeo (não pessoal) e enunciados de
  questão (não pessoal) — sem dado pessoal de `Usuario` trafegando para o
  Gemini.
