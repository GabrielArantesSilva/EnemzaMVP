# Checklist de Review de IA — Enemza

Rodar antes de reportar qualquer tarefa como concluída ou antes de abrir
PR. Ver `review-skill.md` para o processo completo de review.

## Regras de domínio

- [ ] Se a tarefa tocou em `Nota`: a exclusividade `moduloId` XOR `aulaId`
      está validada em Zod **e** a `CHECK` constraint SQL continua intacta
      na migration?
- [ ] Se a tarefa tocou em XP/nível: `xpTotal`, `XpMateria.xp` e
      `Usuario.nivel` são atualizados de forma consistente (nível só sobe
      quando **todas** as aulas do módulo estão concluídas para aquele
      usuário)?
- [ ] Se a tarefa tocou em `Questao`: toda questão `fonte = "LLM"` só é
      persistida com `validadaDouble = true`? Nenhum caminho de código
      salva uma questão LLM sem double-check?

## Boundaries do produto

- [ ] Nenhuma feature de cache/download offline de vídeo do YouTube foi
      introduzida?
- [ ] Nenhum elemento de ranking ou comparação social entre usuários foi
      introduzido?
- [ ] Nenhuma funcionalidade de correção de redação foi iniciada (fora de
      escopo do MVP)?

## Custo e infraestrutura

- [ ] Nenhuma chamada ao Gemini foi adicionada a um endpoint disparado em
      tempo real por usuário final (deve ser sempre lote/admin)?
- [ ] Se a tarefa envolveu conexão com o banco: está usando o endpoint
      pooled do Neon, compatível com função serverless da Vercel?

## Dados pessoais / LGPD

- [ ] Nenhum log novo expõe `nome`, `email` em plaintext, ou o `conteudo`
      de uma `Nota`?
- [ ] Endpoints novos que retornam dado de `Usuario` fazem isso apenas
      para o próprio usuário autenticado, nunca para terceiros?

## Qualidade geral

- [ ] Testes cobrindo a regra de negócio tocada (ver `patterns/testing.md`)?
- [ ] Erros tratados conforme `patterns/error-handling.md` (especialmente
      double-check e rate limit do Gemini)?
- [ ] Alguma decisão arquitetural nova foi tomada nesta tarefa que merece
      um ADR (ver `adr/template.md`)?
