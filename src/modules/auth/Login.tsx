import Link from "next/link";
import { redirect } from "next/navigation";
import { GraduationCap } from "lucide-react";

import { getUsuarioIdSeAutenticado } from "@/lib/auth";
import { LoginForm } from "./_components/LoginForm";
import { LoginShowcase } from "./_components/LoginShowcase";

export async function Login() {
  const usuarioId = await getUsuarioIdSeAutenticado();
  if (usuarioId) redirect("/");

  return (
    <div className="min-h-screen w-full bg-[#0a1128] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Header Institucional */}
      <header className="w-full border-b border-slate-800/80 bg-[#0a1128]/80 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
              <GraduationCap className="size-4" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-white">
              Enemza
            </span>
          </Link>

          <Link
            href="/vendas"
            className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Ainda não tem acesso? <span className="text-blue-400 hover:underline">Conhecer a plataforma</span>
          </Link>
        </div>
      </header>

      {/* Conteúdo Principal — Split Layout */}
      <main className="flex-1 mx-auto flex w-full max-w-6xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Coluna Esquerda: Formulário de Autenticação */}
          <div className="mx-auto w-full max-w-md lg:col-span-5 lg:mx-0">
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Acessar sua conta
                </h1>
                <p className="text-sm text-slate-400">
                  Entre com suas credenciais para continuar seu plano de estudos.
                </p>
              </div>

              {/* Card do Formulário */}
              <div className="rounded-xl border border-slate-800 bg-[#0f172f] p-6 shadow-sm">
                <LoginForm />
              </div>

              {/* Informação Institucional */}
              <p className="text-center text-xs text-slate-500">
                Plataforma de preparação com videoaulas curadas, simulados e cadernos de anotações.
              </p>
            </div>
          </div>

          {/* Coluna Direita: Preview do Produto */}
          <div className="hidden lg:col-span-7 lg:block">
            <LoginShowcase />
          </div>
        </div>
      </main>

      {/* Rodapé Limpo */}
      <footer className="w-full border-t border-slate-800/80 px-6 py-4 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Enemza. Todos os direitos reservados.</span>
          <div className="flex gap-4">
            <Link href="/vendas" className="hover:text-slate-400 transition-colors">
              Sobre o Enemza
            </Link>
            <Link href="/primeiro-acesso" className="hover:text-slate-400 transition-colors">
              Primeiro Acesso
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
