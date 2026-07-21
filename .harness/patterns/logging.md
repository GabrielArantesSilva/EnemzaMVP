# Padrão — Logging (Enemza)

## Regra central: nunca logar dado pessoal ou conteúdo de usuário

- Nunca logar `Usuario.nome` ou `Usuario.email` em texto plano. Se for
  necessário correlacionar logs a um usuário, logar `usuarioId` (cuid),
  nunca o dado pessoal.
- Nunca logar o `conteudo` de uma `Nota` (é conteúdo pessoal do usuário,
  markdown livre).

## Logging do pipeline de conteúdo (lote)

- Logar por execução de lote: quantidade de vídeos processados, quantidade
  classificada por módulo, quantidade descartada/erro — não logar o
  transcript completo (verboso e potencialmente com dado de terceiro/
  YouTube).
- Logar chamadas ao Gemini com contagem/custo agregado (quantas chamadas
  na execução), não o payload completo de prompt/resposta em produção —
  útil para acompanhar consumo do free tier e detectar aproximação do
  rate limit.

## Logging de double-check de questões

- Logar quando uma questão é descartada por divergência no double-check
  (útil para medir taxa de descarte e ajustar prompt), mas sem logar o
  enunciado completo por padrão — logar `questaoId`/`moduloId` e o fato da
  divergência.

## Nível de log em produção (Vercel)

- Free tier da Vercel tem retenção/volume de log limitado — evitar log
  verboso em rotas de alto tráfego (ex: marcar aula como concluída). Logar
  erros sempre; logar sucesso só quando agrega valor de diagnóstico.
