"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, AlertCircle, Loader2 } from "lucide-react";

import { Button } from "@/core/components/ui/button";
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
      } catch (erro) {
        setErro(erro instanceof Error ? erro.message : "Não foi possível entrar. Tente de novo.");
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
      <form onSubmit={enviar} className="space-y-4">
        {/* Campo de E-mail */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-300">
            E-mail de Acesso
          </label>
          <div className="relative flex items-center">
            <Mail className="pointer-events-none absolute left-3.5 size-4.5 text-slate-400" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="seu.email@exemplo.com"
              required
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 py-3.5 pl-11 pr-4 text-sm text-white placeholder-slate-500 shadow-inner outline-none transition-all focus:border-blue-500 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Campo de Senha */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="senha" className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Sua Senha
            </label>
          </div>
          <div className="relative flex items-center">
            <Lock className="pointer-events-none absolute left-3.5 size-4.5 text-slate-400" />
            <input
              id="senha"
              type={mostrarSenha ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••••••"
              required
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 py-3.5 pl-11 pr-11 text-sm text-white placeholder-slate-500 shadow-inner outline-none transition-all focus:border-blue-500 focus:bg-slate-900 focus:ring-4 focus:ring-blue-500/20"
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-3.5 text-slate-400 hover:text-white transition-colors"
              aria-label={mostrarSenha ? "Ocultar senha" : "Exibir senha"}
            >
              {mostrarSenha ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
            </button>
          </div>
        </div>

        {/* Mensagem de Erro */}
        {erro && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/15 p-3 text-xs font-semibold text-red-300 animate-in fade-in">
            <AlertCircle className="size-4 shrink-0 text-red-400" />
            <span>{erro}</span>
          </div>
        )}

        {/* Botão Entrar Principal */}
        <Button
          type="submit"
          disabled={pendente}
          className="group relative h-12 w-full rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 font-extrabold text-sm text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:shadow-blue-500/40 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-60 cursor-pointer"
        >
          {pendente ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              <span>Entrando no Enemza...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>Acessar Plataforma</span>
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </Button>
      </form>

      {/* Divisor moderno */}
      <div className="relative flex items-center justify-center py-1">
        <div className="w-full border-t border-white/10" />
        <span className="absolute bg-[#0a1128] px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Acesso para Avaliadores
        </span>
      </div>

      {/* Botão Acesso Rápido Portfólio / Demo */}
      <button
        type="button"
        onClick={preencherDemo}
        className="w-full flex items-center justify-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs font-extrabold text-amber-300 transition-all hover:bg-amber-500/20 hover:border-amber-500/50 cursor-pointer"
      >
        <Sparkles className="size-4 text-amber-400" />
        <span>Preencher com Conta de Demonstração</span>
      </button>
    </div>
  );
}
