// Duração do plano pago e helpers de cálculo. O plano dá 6 meses de acesso a
// partir da compra aprovada (ver ADR-002 amendment 2026-08-06 e migration
// `20260806000000_usuario_plano_expira_em`). Puro — testável diretamente,
// passando `agora` explicitamente em vez de depender de Date.now() real.

export const DURACAO_PLANO_MS = 1000 * 60 * 60 * 24 * 180; // 6 meses (30 dias/mês — aproximação)
export const DURACAO_PLANO_DIAS = 180;

// Recompra renova: novo plano começa da compra atual, mas nunca reduz um
// plano ainda vigente (max entre o atual e agora + duração).
export function calcularPlanoExpiraEm(atual: Date | null, agora = Date.now()): Date {
  const renovacao = new Date(agora + DURACAO_PLANO_MS);
  if (!atual) return renovacao;
  return atual.getTime() > renovacao.getTime() ? atual : renovacao;
}

export function diasRestantes(planoExpiraEm: Date | null, agora = Date.now()): number {
  if (!planoExpiraEm) return 0;
  return Math.max(0, Math.ceil((planoExpiraEm.getTime() - agora) / (1000 * 60 * 60 * 24)));
}

// Fração do plano já decorrida (0..1) pra barra de progresso — aproximação
// linear assumindo plano de DURACAO_PLANO_MS a partir de planoExpiraEm - duração.
export function progressoPlanoDecorrido(planoExpiraEm: Date | null, agora = Date.now()): number {
  if (!planoExpiraEm) return 0;
  const inicio = planoExpiraEm.getTime() - DURACAO_PLANO_MS;
  return Math.min(1, Math.max(0, (agora - inicio) / DURACAO_PLANO_MS));
}
