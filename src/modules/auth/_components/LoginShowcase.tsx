import { BookOpen, CheckCircle, GraduationCap, FileText, CheckCircle2 } from "lucide-react";

export function LoginShowcase() {
  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Moldura de Pré-visualização da Interface */}
      <div className="rounded-xl border border-slate-800 bg-[#0c142c] p-5 shadow-xl">
        {/* Barra de janela sutil */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-4">
          <div className="flex items-center gap-1.5">
            <div className="size-2.5 rounded-full bg-slate-700" />
            <div className="size-2.5 rounded-full bg-slate-700" />
            <div className="size-2.5 rounded-full bg-slate-700" />
          </div>
          <span className="text-[11px] font-mono text-slate-500">app.enemza.com.br</span>
          <div className="w-10" />
        </div>

        {/* Conteúdo demonstrativo da plataforma */}
        <div className="space-y-4">
          {/* Card: Aula em Andamento */}
          <div className="rounded-lg border border-slate-800/80 bg-slate-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-400">
                  Matemática
                </span>
                <span className="text-xs text-slate-400">Módulo 4</span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Aula 3 de 12</span>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-sm font-semibold text-slate-200">
                Funções do 1º e 2º Grau aplicadas ao ENEM
              </h4>
              <p className="text-xs text-slate-400">
                Análise gráfica de parábolas, vértices e pontos de máximo/mínimo.
              </p>
            </div>

            {/* Barra de progresso do módulo */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>Progresso no módulo</span>
                <span className="font-semibold text-slate-300">25%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800">
                <div className="h-1.5 rounded-full bg-blue-500" style={{ width: "25%" }} />
              </div>
            </div>
          </div>

          {/* Grid de módulos recentes */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">Física</span>
                <CheckCircle className="size-3.5 text-blue-400" />
              </div>
              <p className="text-[11px] text-slate-400">Termodinâmica e Calorimetria</p>
              <div className="flex items-center gap-1.5 pt-1 text-[10px] text-emerald-400 font-medium">
                <CheckCircle2 className="size-3 text-emerald-400" />
                <span>Fixação concluída</span>
              </div>
            </div>

            <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-300">Química</span>
                <span className="text-[10px] text-slate-500">Pendente</span>
              </div>
              <p className="text-[11px] text-slate-400">Estequiometria e Soluções</p>
              <div className="pt-1 text-[10px] text-slate-500">
                <span>Próxima prova após aula 4</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Pilares didáticos objetivos */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        <div className="flex flex-col gap-1.5 text-left">
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <GraduationCap className="size-4" />
          </div>
          <span className="text-xs font-semibold text-slate-200">11 Módulos</span>
          <p className="text-[11px] text-slate-400 leading-snug">
            Matemática, Humanas, Natureza e Linguagens organizadas.
          </p>
        </div>

        <div className="flex flex-col gap-1.5 text-left">
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <BookOpen className="size-4" />
          </div>
          <span className="text-xs font-semibold text-slate-200">Provas de Fixação</span>
          <p className="text-[11px] text-slate-400 leading-snug">
            Questões objetivas para testar o conteúdo de cada disciplina.
          </p>
        </div>

        <div className="flex flex-col gap-1.5 text-left">
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <FileText className="size-4" />
          </div>
          <span className="text-xs font-semibold text-slate-200">Anotações</span>
          <p className="text-[11px] text-slate-400 leading-snug">
            Suas anotações em Markdown salvas junto de cada aula.
          </p>
        </div>
      </div>
    </div>
  );
}
