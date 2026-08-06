-- Ver ADR-002 (amendment 2026-08-06): o plano pago dá 6 meses de acesso a
-- partir da compra aprovada. `planoExpiraEm` guarda quando o acesso expira
-- (null = nunca comprou). Setado/estendido pelo webhook da Kiwify
-- (compra_aprovada) — ver src/lib/plano.ts.
ALTER TABLE "Usuario" ADD COLUMN "planoExpiraEm" TIMESTAMP(3);
