"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle, Loader2, ArrowRight } from "lucide-react";

import { entrar } from "../auth.actions";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
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
      } catch (err) {
        setErro(err instanceof Error ? err.message : "Não foi possível autenticar. Verifique seus dados.");
      }
    });
  }

  function preencherDemo() {
    setEmail("dev@enemza.local");
    setSenha("dev12345");
    setErro(null);
  }

  return (
    <div className="w-full space-y-5">
      {/* Banner de Demonstração / Portfólio */}
      <div className="flex items-center justify-between gap-3 rounded-lg border border-blue-900/50 bg-blue-950/30 px-3.5 py-2.5 text-xs text-blue-200">
        <div className="flex flex-col">
          <span className="font-semibold text-blue-100">Visitando pelo portfólio?</span>
          <span className="text-[11px] text-blue-300/80">Use as credenciais de teste para navegar.</span>
        </div>
        <button
          type="button"
          onClick={preencherDemo}
          className="shrink-0 rounded-md bg-blue-600/30 px-2.5 py-1 text-xs font-medium text-blue-200 transition-colors hover:bg-blue-600/50 border border-blue-500/30 cursor-pointer"
        >
          Inserir dados demo
        </button>
      </div>

      <form onSubmit={enviar} className="space-y-4">
        {/* Campo E-mail */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-medium text-slate-300">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Campo Senha */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="senha" className="block text-xs font-medium text-slate-300">
              Senha
            </label>
          </div>
          <div className="relative">
            <input
              id="senha"
              type={mostrarSenha ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••••••"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-lg border border-slate-700/80 bg-slate-900/80 px-3.5 py-2.5 pr-10 text-sm text-slate-100 placeholder-slate-500 outline-none transition-colors focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              aria-label={mostrarSenha ? "Ocultar senha" : "Exibir senha"}
            >
              {mostrarSenha ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Erro */}
        {erro && (
          <div className="flex items-center gap-2 rounded-lg border border-red-900/50 bg-red-950/40 p-3 text-xs text-red-300">
            <AlertCircle className="size-4 shrink-0 text-red-400" />
            <span>{erro}</span>
          </div>
        )}

        {/* Botão Entrar */}
        <button
          type="submit"
          disabled={pendente}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 font-medium text-sm text-white transition-colors hover:bg-blue-500 active:bg-blue-700 disabled:opacity-60 cursor-pointer shadow-sm"
        >
          {pendente ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Entrando...</span>
            </>
          ) : (
            <>
              <span>Entrar na plataforma</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
