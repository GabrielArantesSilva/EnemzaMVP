"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/core/components/ui/button";
import { entrar } from "../auth.actions";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setErro(null);

    iniciarTransicao(async () => {
      try {
        await entrar({ email, senha });
        router.replace("/");
        router.refresh();
      } catch (erro) {
        setErro(erro instanceof Error ? erro.message : "Não foi possível entrar. Tente de novo.");
      }
    });
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-semibold">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
          className="w-full rounded-xl border border-border bg-card p-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="senha" className="text-sm font-semibold">
          Senha
        </label>
        <input
          id="senha"
          type="password"
          autoComplete="current-password"
          required
          value={senha}
          onChange={(evento) => setSenha(evento.target.value)}
          className="w-full rounded-xl border border-border bg-card p-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      </div>

      {erro && <p className="text-xs font-semibold text-destructive">{erro}</p>}

      <Button type="submit" disabled={pendente} className="mt-2">
        {pendente ? "Entrando..." : "Entrar"}
      </Button>
    </form>
  );
}
