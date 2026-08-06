import { describe, expect, it } from "vitest";

import {
  DURACAO_PLANO_MS,
  calcularPlanoExpiraEm,
  diasRestantes,
  progressoPlanoDecorrido,
} from "./plano";

describe("plano (6 meses de acesso)", () => {
  const AGORA = new Date("2026-01-01T00:00:00Z").getTime();
  const DIA_MS = 1000 * 60 * 60 * 24;

  it("quem não tem plano ganha 6 meses a partir da compra", () => {
    const expira = calcularPlanoExpiraEm(null, AGORA);
    expect(expira.getTime()).toBe(AGORA + DURACAO_PLANO_MS);
  });

  it("recompra não reduz plano ainda vigente", () => {
    const vigente = new Date(AGORA + DURACAO_PLANO_MS * 2);
    const expira = calcularPlanoExpiraEm(vigente, AGORA);
    expect(expira.getTime()).toBe(vigente.getTime());
  });

  it("recompra com plano quase vencendo renova a partir de agora", () => {
    const quaseVencendo = new Date(AGORA + DURACAO_PLANO_MS - 1000);
    const renovado = calcularPlanoExpiraEm(quaseVencendo, AGORA);
    expect(renovado.getTime()).toBe(AGORA + DURACAO_PLANO_MS);
  });

  it("diasRestantes arredonda pra cima e nunca fica negativo", () => {
    expect(diasRestantes(new Date(AGORA + 10 * DIA_MS + 1), AGORA)).toBe(11);
    expect(diasRestantes(new Date(AGORA + 10 * DIA_MS), AGORA)).toBe(10);
    expect(diasRestantes(new Date(AGORA - 1000), AGORA)).toBe(0);
    expect(diasRestantes(null, AGORA)).toBe(0);
  });

  it("progresso do plano vai de 0 (compra) a 1 (expiração)", () => {
    const expira = new Date(AGORA + DURACAO_PLANO_MS);
    expect(progressoPlanoDecorrido(expira, AGORA)).toBe(0);
    expect(progressoPlanoDecorrido(expira, AGORA + DURACAO_PLANO_MS)).toBe(1);
    expect(progressoPlanoDecorrido(expira, AGORA + DURACAO_PLANO_MS + 1000)).toBe(1);
    expect(progressoPlanoDecorrido(null, AGORA)).toBe(0);
  });
});
