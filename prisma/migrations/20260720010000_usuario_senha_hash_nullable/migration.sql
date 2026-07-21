-- Ver .harness/adr/ADR-002-webhook-kiwify-primeiro-acesso.md.
-- null = conta criada pelo webhook da Kiwify, aguardando primeiro acesso.
-- AlterTable
ALTER TABLE "Usuario" ALTER COLUMN "senhaHash" DROP NOT NULL;
