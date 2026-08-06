-- Histórico de estudos: feed de atividade do usuário (aula concluída / prova
-- submetida) que alimenta o Perfil — seção "Histórico de estudos" + estatísticas
-- (aulas, provas, taxa de acerto). Gravado nas ações concluirAula e
-- submeterProva. `titulo` é snapshot (não referencia FK): o texto permanece
-- correto mesmo se o nome da aula/módulo mudar no futuro. Para provas,
-- `acertos`/`totalQuestoes` alimentam a taxa de acerto (ver perfil.api.ts).
CREATE TABLE "HistoricoEstudo" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "referenciaId" TEXT,
    "titulo" TEXT NOT NULL,
    "acertos" INTEGER,
    "totalQuestoes" INTEGER,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoricoEstudo_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "HistoricoEstudo_usuarioId_criadoEm_idx" ON "HistoricoEstudo"("usuarioId", "criadoEm");

-- Dupla camada (Zod na aplicação + CHECK no banco — ver .harness/boundaries.md):
-- tipo só pode ser 'aula' | 'prova'.
ALTER TABLE "HistoricoEstudo"
ADD CONSTRAINT "historico_estudo_tipo_valido"
CHECK ("tipo" IN ('aula', 'prova'));

ALTER TABLE "HistoricoEstudo"
ADD CONSTRAINT "HistoricoEstudo_usuarioId_fkey"
FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
