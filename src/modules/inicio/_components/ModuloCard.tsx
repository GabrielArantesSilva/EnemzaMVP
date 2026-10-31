import Link from "next/link";
import { HelpCircle, ChevronRight } from "lucide-react";

import { Progress } from "@/core/components/ui/progress";
import type { ModuloProgresso } from "../inicio.types";
import { ICONE_POR_MODULO } from "../inicio.constants";

interface ModuloCardProps {
  modulo: ModuloProgresso;
}

export function ModuloCard({ modulo }: ModuloCardProps) {
  const Icon = ICONE_POR_MODULO[modulo.nome] ?? HelpCircle;
  const temAulas = modulo.totalAulas > 0;
  const percentual = temAulas
    ? Math.round((modulo.aulasConcluidas / modulo.totalAulas) * 100)
    : 0;

  return (
    <Link
      href={`/modulos/${modulo.id}`}
      className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/5 bg-slate-900/60 p-4 shadow-sm backdrop-blur-md transition-all duration-200 hover:border-white/20 hover:bg-slate-900/90 hover:shadow-lg hover:scale-[1.005]"
    >
      <div className="flex items-center gap-3.5 w-full sm:w-auto">
        {/* Ícone com círculo na cor temática */}
        <span
          className="flex size-12 shrink-0 items-center justify-center rounded-2xl shadow-sm transition-transform group-hover:scale-105"
          style={{ backgroundColor: `${modulo.corHex}20`, color: modulo.corHex }}
        >
          <Icon className="size-6" strokeWidth={2.25} />
        </span>

        {/* Detalhes do Módulo */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-display font-extrabold text-base text-white group-hover:text-blue-300 transition-colors">
              {modulo.nome}
            </p>
            {/* Tag de Incidência TRI */}
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                modulo.incidencia === "Essencial"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : modulo.incidencia === "Alta"
                  ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                  : "bg-slate-800 text-slate-400"
              }`}
            >
              {modulo.incidencia}
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Caderno de {modulo.area} • {modulo.totalAulas} {modulo.totalAulas === 1 ? "aula" : "aulas"}
          </p>
        </div>
      </div>

      {/* Progresso & Ação */}
      <div className="w-full sm:w-48 flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
        {temAulas ? (
          <div className="flex flex-col gap-1 w-full sm:w-36">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400 font-mono text-[11px]">{percentual}%</span>
              <span className="text-slate-400 text-[11px]">
                {modulo.aulasConcluidas}/{modulo.totalAulas}
              </span>
            </div>
            <Progress
              value={percentual}
              indicatorColor={modulo.corHex}
              className="h-2 w-full bg-slate-800"
            />
          </div>
        ) : (
          <span className="text-xs text-slate-400 italic">Em breve</span>
        )}

        <ChevronRight className="size-4.5 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-white shrink-0 hidden sm:block" />
      </div>
    </Link>
  );
}
