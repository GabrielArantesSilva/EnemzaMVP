import { vi } from "vitest";

// revalidatePath depende do request store do runtime Next — inexistente em teste.
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// cookies() depende do request store do runtime Next — mock em memória para
// testes de ações que abrem/encerram sessão (ver src/lib/sessao.ts).
vi.mock("next/headers", () => {
  const store = new Map<string, string>();
  return {
    cookies: async () => ({
      get: (nome: string) => (store.has(nome) ? { name: nome, value: store.get(nome)! } : undefined),
      set: (nome: string, valor: string) => {
        store.set(nome, valor);
      },
      delete: (nome: string) => {
        store.delete(nome);
      },
    }),
  };
});

// Segredo de sessão para testes — nunca usar em produção (ver .env.example).
process.env.SESSION_SECRET ??= "segredo-de-teste-nao-usar-em-producao";
