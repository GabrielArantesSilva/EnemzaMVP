-- Ver .harness/adr/ADR-001-autenticacao-e-sessao.md.
-- DEFAULT '' é só para permitir a coluna NOT NULL em linhas já existentes
-- (ex: usuário demo do seed) sem quebrar o schema; removido em seguida —
-- nenhum código de aplicação deve depender desse default.
-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN "senhaHash" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Usuario" ALTER COLUMN "senhaHash" DROP DEFAULT;
