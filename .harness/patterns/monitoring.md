# Padrão — Monitoramento (Enemza)

## O que monitorar por causa dos free tiers

Toda a infra roda em free tier (Vercel + Neon) e o pipeline de conteúdo
depende de uma cota gratuita de LLM (Gemini) com rate limit baixo. Isso
muda o que vale a pena monitorar num MVP:

- **Consumo de cota do Gemini**: quantidade de chamadas feitas por
  execução de lote vs. limite diário do free tier. Estourar a cota no meio
  de um lote de categorização/geração de questões deve ser visível, não
  silencioso.
- **Conexões ao Neon**: monitorar erros de "too many connections" —
  sintoma de que o pooling do Prisma em ambiente serverless não está
  configurado corretamente (ver `patterns/troubleshooting.md`).
- **Taxa de descarte do double-check**: se uma fração alta de questões
  geradas está sendo descartada por divergência, é sinal de prompt
  ruim ou modelo inadequado — vale acompanhar por módulo/disciplina.
- **Limites do plano free da Vercel**: invocations de função serverless e
  bandwidth — o app não deve depender de monitoramento externo pago no
  MVP; usar o dashboard nativo da Vercel/Neon é suficiente nesta fase.

## O que NÃO monitorar no MVP

- Não instrumentar analytics de comportamento social/comparativo entre
  usuários — não existe ranking, então não há métrica de "posição" a
  acompanhar.
- Não montar dashboard de observabilidade dedicado (ex: Grafana/Datadog)
  nesta fase — desproporcional ao estágio e ao orçamento zero de infra.
