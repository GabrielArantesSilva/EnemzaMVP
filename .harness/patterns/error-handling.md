# Padrão — Tratamento de Erros (Enemza)

## Double-check de questões (LLM)

Divergência entre as duas chamadas **não é um erro de sistema** — é o
funcionamento esperado do double-check. Tratamento:

1. Descartar a questão (não persistir, não expor ao usuário).
2. Regenerar automaticamente (nova chamada de geração).
3. Se divergir novamente após N tentativas (definir limite baixo, ex: 2-3,
   dado o custo por chamada), registrar e pular a questão em vez de
   tentar indefinidamente — não sacrificar o orçamento de LLM em loop.

## Rate limit do Gemini (free tier)

- Erro de rate limit no pipeline em lote deve **pausar/retomar** com
  backoff, não falhar o lote inteiro silenciosamente. Como o pipeline roda
  offline (não em request de usuário), é aceitável que uma execução leve
  mais tempo por causa de backoff.
- Nunca converter erro de rate limit do Gemini em erro visível para o
  usuário final — o pipeline de conteúdo é desacoplado da experiência de
  uso do app.

## Embed do YouTube indisponível

- Se um vídeo embutido falhar (removido, privado, bloqueado por região),
  a tela de Aula deve degradar graciosamente (mensagem de vídeo
  indisponível), nunca quebrar a página inteira. Não é papel do app
  cachear um fallback de vídeo (proibido por ToS) — apenas comunicar o
  problema.

## Conexão com banco (Neon serverless)

- Erro de conexão/pool esgotado deve ser tratado como transitório e
  logado com contexto suficiente para diagnóstico (ver
  `patterns/troubleshooting.md`), não mascarado como erro genérico 500 sem
  detalhe interno.

## Constraint de exclusividade da `Nota`

- Se a validação Zod falhar, retornar erro de validação claro ao client
  (400, mensagem indicando que precisa escolher módulo OU aula).
- Se, por algum bug, uma request passar da validação Zod e violar a
  `CHECK` constraint do banco, esse é um erro de sistema (500) que deve
  ser logado com prioridade alta — indica que a camada de aplicação tem
  um bug real, não é um caso de uso esperado.
