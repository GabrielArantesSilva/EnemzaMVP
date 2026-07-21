# Contrato de Integração: YouTube timedtext (transcript)

- **Sistema**: endpoint não-oficial `https://www.youtube.com/api/timedtext?v={videoId}&lang={lang}`. Sem documentação pública oficial — usado por diversas ferramentas de terceiro (ex: `youtube-transcript-api`), mas pode mudar/quebrar sem aviso do YouTube.
- **Tipo**: HTTP GET, retorna XML de legenda.
- **Autenticação**: nenhuma — sem chave, sem OAuth.
- **Limites conhecidos**: nenhum documentado publicamente. `src/lib/youtube-transcript.ts` adiciona um delay entre chamadas (`extrair-transcripts.ts`) por precaução, não por limite confirmado.
- **Custo**: gratuito.
- **Modo de uso no Enemza**: exclusivamente batch/offline, no pipeline de classificação de vídeo (`scripts/extrair-transcripts.ts`). Nunca em rota acessada por usuário final.
- **Dados trocados**: envia só o `videoId` (público). Recebe o texto da legenda do vídeo (conteúdo do canal curado, não dado pessoal).
- **Falhas conhecidas e tratamento**: vídeo sem legenda (manual ou automática) retorna resposta vazia/404 — `obterTranscript()` retorna `null` nesse caso, e `classificacao-video.ts` classifica só pelo título quando isso acontece.
- **Restrições de ToS relevantes**: é o mesmo cuidado de `boundaries.md` sobre vídeo — extrair só o texto da legenda pra fins de classificação interna, nunca reconstituir/exibir o vídeo fora do embed oficial.
- **Se quebrar**: como não é documentado, o YouTube pode mudar o formato de resposta sem aviso. Sintoma: `extrair-transcripts.ts` passa a gravar só `transcript: null` pra todo vídeo. Mitigação já embutida: classificação por título continua funcionando sem transcript, só com menos contexto.
