import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles, GraduationCap, CheckCircle2, ShieldCheck } from "lucide-react";

import { getUsuarioIdSeAutenticado } from "@/lib/auth";
import { LoginForm } from "./_components/LoginForm";
import { LoginShowcase } from "./_components/LoginShowcase";

export async function Login() {
  const usuarioId = await getUsuarioIdSeAutenticado();
  if (usuarioId) redirect("/");

  return (
    <div className="relative min-h-screen w-full bg-[#070b1a] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white overflow-x-hidden">
      
      {/* Malha de luzes e gradientes de fundo */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600/15 blur-[140px]" />
        <div className="absolute top-1/2 right-10 h-[450px] w-[450px] rounded-full bg-indigo-600/10 blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-[150px]" />
        {/* Grid sutil */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />
      </div>

      {/* Header superior discreto */}
      <header className="w-full px-6 py-5 sm:px-10 lg:px-14 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white shadow-lg shadow-blue-500/30 transition-transform group-hover:scale-105">
            <GraduationCap className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl font-black tracking-tight text-white flex items-center gap-1.5">
              Enemza
              <span className="inline-block size-2 rounded-full bg-blue-400 animate-pulse" />
            </span>
            <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
              Estudo Inteligente
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-block text-xs text-slate-400">
            Ainda não tem acesso?
          </span>
          <Link
            href="/vendas"
            className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-300 transition-all hover:bg-blue-500/20 hover:border-blue-500/60 shadow-sm"
          >
            Conhecer o Sistema
          </Link>
        </div>
      </header>

      {/* Conteúdo Principal — Grid Split-Screen */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 py-8 lg:py-12 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center w-full">
          
          {/* Coluna Esquerda: Formulário de Entrada & Branding */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-7 max-w-md mx-auto lg:max-w-none w-full">
            
            {/* Badge de status */}
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-950/40 px-3.5 py-1 text-xs font-bold text-blue-300 w-fit backdrop-blur-sm shadow-inner">
              <Sparkles className="size-3.5 text-amber-400" />
              <span>Plataforma Oficial ENEM 2026</span>
            </div>

            {/* Chamada principal */}
            <div className="space-y-2">
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-[1.15]">
                Bem-vindo de volta ao{" "}
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300 bg-clip-text text-transparent">
                  Enemza
                </span>
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                Retome suas videoaulas curadas, continue suas provas de fixação e suba no ranking com metodologia ativa.
              </p>
            </div>

            {/* Card com o Formulário */}
            <div className="rounded-3xl border border-white/10 bg-[#0d1530]/80 p-6 sm:p-7 shadow-2xl backdrop-blur-xl ring-1 ring-white/5">
              <LoginForm />
            </div>

            {/* Provas sociais & Garantias */}
            <div className="space-y-3 pt-1 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="size-4 text-emerald-400" />
                <span>Ambiente seguro com criptografia de ponta a ponta</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 text-slate-300 font-semibold">
                  <CheckCircle2 className="size-3.5 text-blue-400" /> Videoaulas curadas
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-300 font-semibold">
                  <CheckCircle2 className="size-3.5 text-blue-400" /> Questões oficiais INEP
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-300 font-semibold">
                  <CheckCircle2 className="size-3.5 text-blue-400" /> XP & Gamificação
                </span>
              </div>
            </div>

          </div>

          {/* Coluna Direita: Showcase Interativo dos Recursos */}
          <div className="lg:col-span-7 flex items-center justify-center">
            <LoginShowcase />
          </div>

        </div>
      </main>

      {/* Rodapé sutil */}
      <footer className="w-full px-6 py-4 text-center text-xs text-slate-400 border-t border-white/5">
        <p>© 2026 Enemza — Preparatório Inteligente para o ENEM. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
