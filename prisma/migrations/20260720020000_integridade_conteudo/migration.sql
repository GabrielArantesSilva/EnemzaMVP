-- Ver .harness/adr/ADR-003-pipeline-conteudo.md e .harness/boundaries.md.
-- Produção não tem nenhuma Prova real ainda (só fixture de dev) — seguro
-- aplicar antes do pipeline de conteúdo rodar pela primeira vez.

-- AlterTable: Aula — no máximo um registro por (moduloId, youtubeUrl),
-- necessário pra persistir-aulas.ts fazer upsert idempotente.
DROP INDEX "Aula_moduloId_idx";
CREATE UNIQUE INDEX "Aula_moduloId_youtubeUrl_key" ON "Aula"("moduloId", "youtubeUrl");

-- AlterTable: Prova — no máximo uma por Modulo. O read-side
-- (modulo-detalhe.api.ts) já faz `findFirst({where:{moduloId}})` sem
-- orderBy, ou seja, hoje é não-determinístico com mais de uma Prova por
-- módulo.
ALTER TABLE "Prova" ADD CONSTRAINT "Prova_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "Modulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE UNIQUE INDEX "Prova_moduloId_key" ON "Prova"("moduloId");

-- Rede de segurança no banco (mesma dupla camada de nota_referencia_exclusiva):
-- toda Questao com fonte = 'LLM' só pode existir com validadaDouble = true.
-- Nunca remover esta constraint achando que a validação de aplicação basta —
-- ver .harness/boundaries.md.
ALTER TABLE "Questao"
ADD CONSTRAINT "questao_double_check_obrigatorio"
CHECK (fonte <> 'LLM' OR "validadaDouble" = true);
