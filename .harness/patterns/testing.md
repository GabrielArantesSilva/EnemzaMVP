# Padrão — Testes (Enemza)

## Prioridades de cobertura (MVP)

1. **Regra de exclusividade da `Nota`** (`moduloId` XOR `aulaId`): testar
   as duas camadas — validação Zod rejeitando ambos preenchidos/ambos
   vazios, e teste de integração confirmando que a `CHECK` constraint do
   banco também rejeita um insert raw que burle a camada de aplicação.
2. **Lógica de XP e nível**: teste unitário de
   - soma correta de `xpTotal` ao concluir uma aula;
   - incremento de `XpMateria.xp` no módulo correto;
   - incremento de `Usuario.nivel` **apenas** quando todas as aulas de um
     módulo estão com `concluida = true` para aquele usuário (testar caso
     de borda: falta 1 aula, não deve incrementar).
3. **Double-check de questões geradas por LLM**: teste da lógica que
   descarta e regenera quando a segunda chamada diverge da primeira — usar
   mock do provider de LLM, nunca chamar Gemini de verdade em teste
   automatizado (custo e rate limit).
4. **Fonte mista de Prova**: teste que prioriza INEP para Matemática/
   Física/Química e cai para LLM nas demais disciplinas quando não há
   questão INEP suficiente.

## O que mockar sempre

- Chamadas ao Gemini (categorização de vídeo, geração de questão,
  double-check) — nunca hit real em CI, tanto por custo quanto por rate
  limit baixo do free tier.
- YouTube (busca de vídeos, transcript) — mockar resposta de transcript
  para não depender de rede/quota externa em teste.

## Banco de dados em teste

- Testes que envolvem constraint SQL (exclusividade de `Nota`) precisam
  rodar contra um Postgres real (não SQLite, não mock de Prisma) — a
  constraint só existe no banco. Preferir banco efêmero de teste
  (containerizado) espelhando o schema de produção via Prisma Migrate.

## Fora do escopo de teste automatizado no MVP

- Qualidade de classificação do LLM (se o vídeo foi categorizado no
  módulo "certo") — é avaliado manualmente durante o pipeline em lote,
  não é asserção de teste automatizado determinístico.
