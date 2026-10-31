import { Zap, Trophy, GraduationCap, CheckCircle2 } from "lucide-react";
import type { ResumoUsuario } from "../inicio.types";

interface ResumoCardProps {
  resumo: ResumoUsuario;
}

export function ResumoCard({ resumo }: ResumoCardProps) {
  const percentualGeral = resumo.totalAulasGeral > 0
    ? Math.round((resumo.totalAulasConcluidas / resumo.totalAulasGeral) * 100)
    : 0;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c1836] via-[#091126] to-[#070b1a] p-6 shadow-2xl backdrop-blur-xl">
      {/* Luz ambiente interna */}
      <div className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 size-48 rounded-full bg-amber-500/15 blur-3xl" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Lado Esquerdo: Saudação & Progresso Geral */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
              <GraduationCap className="size-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Plano de Aprovação ENEM 2026
            </span>
          </div>

          <div>
            <h2 className="font-display text-2xl font-black text-white">
              Bons estudos, {resumo.nome.split(" ")[0]}! 🚀
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Você já concluiu <span className="font-bold text-white">{resumo.totalAulasConcluidas}</span> de{" "}
              <span className="font-bold text-white">{resumo.totalAulasGeral}</span> aulas recomendadas.
            </p>
          </div>

          {/* Barra de Progresso Geral */}
          <div className="max-w-md w-full">
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
              <span>Jornada Completa</span>
              <span className="text-blue-400 font-bold">{percentualGeral}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-white/5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-400 transition-all duration-700"
                style={{ width: `${Math.max(percentualGeral, 5)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Lado Direito: Cards de Conquistas & Gamificação */}
        <div className="grid grid-cols-3 gap-3 md:min-w-[280px]">
          {/* Card Nível */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-slate-900/60 p-3 text-center shadow-inner">
            <div className="flex size-8 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 mb-1.5">
              <Trophy className="size-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Nível
            </span>
            <span className="font-display text-lg font-black text-white leading-tight">
              {resumo.nivel}
            </span>
          </div>

          {/* Card XP Total */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-slate-900/60 p-3 text-center shadow-inner">
            <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 mb-1.5">
              <Zap className="size-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Pontos XP
            </span>
            <span className="font-display text-lg font-black text-amber-300 leading-tight">
              {resumo.xpTotal}
            </span>
          </div>

          {/* Card Módulos Concluídos */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-slate-900/60 p-3 text-center shadow-inner">
            <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 mb-1.5">
              <CheckCircle2 className="size-4" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Módulos 100%
            </span>
            <span className="font-display text-lg font-black text-emerald-300 leading-tight">
              {resumo.modulosConcluidos}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
