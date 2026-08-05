-- Ver ADR-002 (amendment 2026-08-05) e .harness/tech-debt/log.md (TD-0010).
-- O webhook da Kiwify criava a conta e enviava o e-mail de primeiro acesso
-- inline; se o envio falhasse, a conta ficava sem e-mail e sem registro de
-- tentativa. Agora todo envio passa por esta tabela (outbox): o webhook
-- registra (status 'pendente'), tenta 1x e responde 2xx sempre; um dreno
-- (rota /api/cron/reenviar-emails + chamada no próprio webhook) reenvia os
-- 'pendente' vencidos com backoff exponencial e encaminha pra DLQ manual
-- (status 'falhou') após teto de tentativas.

CREATE TABLE "EmailPrimeiroAcesso" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "tentativas" INTEGER NOT NULL DEFAULT 0,
    "proximaTentativaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimoErro" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailPrimeiroAcesso_pkey" PRIMARY KEY ("id")
);

-- No máximo um registro por usuário — o outbox é o estado do envio do
-- primeiro acesso daquele usuário (idempotência: mensagem repetida da Kiwify
-- tem `id` que muda a cada retry, então a deduplicação é por usuário).
CREATE UNIQUE INDEX "EmailPrimeiroAcesso_usuarioId_key" ON "EmailPrimeiroAcesso"("usuarioId");

-- Dupla camada (Zod na aplicação + CHECK no banco — ver .harness/boundaries.md):
-- status só pode ser 'pendente' | 'enviado' | 'falhou'. Nunca remover esta
-- constraint achando que a validação de aplicação basta.
ALTER TABLE "EmailPrimeiroAcesso"
ADD CONSTRAINT "email_primeiro_acesso_status_valido"
CHECK ("status" IN ('pendente', 'enviado', 'falhou'));

-- Exclusão de conta (LGPD, ver boundaries.md) leva o registro de outbox junto.
ALTER TABLE "EmailPrimeiroAcesso"
ADD CONSTRAINT "EmailPrimeiroAcesso_usuarioId_fkey"
FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
