"use client";

import { useState, useMemo } from "react";
import { Filter, ArrowUpDown, Lightbulb, Search } from "lucide-react";
import type { ModuloProgresso, AreaEnem } from "../inicio.types";
import { ModuloCard } from "./ModuloCard";
import { DICAS_DIDATICAS_ENEM } from "../inicio.constants";

interface ModulosFilterViewProps {
  modulos: ModuloProgresso[];
}

type FiltroArea = "todas" | AreaEnem | "em_andamento";
type OpcaoOrdenacao = "ordem_enem" | "peso_tri" | "menor_progresso";

export function ModulosFilterView({ modulos }: ModulosFilterViewProps) {
  const [filtroArea, setFiltroArea] = useState<FiltroArea>("todas");
  const [ordenacao, setOrdenacao] = useState<OpcaoOrdenacao>("ordem_enem");
  const [busca, setBusca] = useState("");
  const [indiceDica, setIndiceDica] = useState(0);

  const dicaAtual = DICAS_DIDATICAS_ENEM[indiceDica % DICAS_DIDATICAS_ENEM.length];

  const modulosFiltrados = useMemo(() => {
    return modulos
      .filter((modulo) => {
        // Filtro de busca por texto
        if (busca.trim()) {
          const termo = busca.toLowerCase();
          const bateNome = modulo.nome.toLowerCase().includes(termo);
          const bateArea = modulo.area.toLowerCase().includes(termo);
          if (!bateNome && !bateArea) return false;
        }

        // Filtro por categoria/área
        if (filtroArea === "todas") return true;
        if (filtroArea === "em_andamento") {
          return modulo.aulasConcluidas > 0 && modulo.aulasConcluidas < modulo.totalAulas;
        }
        return modulo.area === filtroArea;
      })
      .sort((a, b) => {
        if (ordenacao === "ordem_enem") {
          return a.ordem - b.ordem;
        }
        if (ordenacao === "peso_tri") {
          const peso = { Essencial: 3, Alta: 2, Média: 1 };
          return (peso[b.incidencia] ?? 0) - (peso[a.incidencia] ?? 0);
        }
        if (ordenacao === "menor_progresso") {
          const progA = a.totalAulas > 0 ? a.aulasConcluidas / a.totalAulas : 0;
          const progB = b.totalAulas > 0 ? b.aulasConcluidas / b.totalAulas : 0;
          return progA - progB;
        }
        return 0;
      });
  }, [modulos, filtroArea, ordenacao, busca]);

  return (
    <div className="space-y-5">
      {/* Card Didático: Dica Estratégica do ENEM */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-slate-900 to-indigo-950/20 p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <Lightbulb className="size-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                  {dicaAtual.tag}
                </span>
                <span className="text-xs font-bold text-white">{dicaAtual.titulo}</span>
              </div>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                {dicaAtual.texto}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIndiceDica((prev) => prev + 1)}
            className="shrink-0 rounded-xl border border-white/10 px-2.5 py-1 text-[11px] font-bold text-slate-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
          >
            Próxima Dica
          </button>
        </div>
      </div>

      {/* Controles de Organização dos Estudos: Filtros e Busca */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Abas de Categorias do ENEM */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold no-scrollbar">
          {[
            { id: "todas", rotulo: "Todas (11)" },
            { id: "Matemática", rotulo: "📐 Matemática" },
            { id: "Natureza", rotulo: "🧬 Natureza" },
            { id: "Humanas", rotulo: "🌍 Humanas" },
            { id: "Linguagens", rotulo: "✍️ Linguagens" },
            { id: "em_andamento", rotulo: "⏳ Em Andamento" },
          ].map((aba) => (
            <button
              key={aba.id}
              type="button"
              onClick={() => setFiltroArea(aba.id as FiltroArea)}
              className={`whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                filtroArea === aba.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-slate-900/60 text-slate-400 border border-white/5 hover:text-white hover:bg-slate-900"
              }`}
            >
              {aba.rotulo}
            </button>
          ))}
        </div>

        {/* Campo de Busca & Ordenação */}
        <div className="flex items-center gap-2">
          {/* Input de Busca */}
          <div className="relative flex-1 md:w-44">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Buscar matéria..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/80 py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
            />
          </div>

          {/* Seletor de Ordenação */}
          <div className="relative">
            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value as OpcaoOrdenacao)}
              aria-label="Ordenar matérias por"
              className="rounded-xl border border-white/10 bg-slate-900/80 py-1.5 px-3 text-xs font-bold text-slate-300 outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="ordem_enem">Ordem do ENEM</option>
              <option value="peso_tri">Maior Peso TRI</option>
              <option value="menor_progresso">Precisa de Reforço</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Módulos Renderizados */}
      <div className="flex flex-col gap-3">
        {modulosFiltrados.length > 0 ? (
          modulosFiltrados.map((modulo) => (
            <ModuloCard key={modulo.id} modulo={modulo} />
          ))
        ) : (
          <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-8 text-center">
            <p className="text-sm font-bold text-slate-300">Nenhuma matéria encontrada com esses filtros.</p>
            <button
              type="button"
              onClick={() => {
                setFiltroArea("todas");
                setBusca("");
              }}
              className="mt-2 text-xs font-bold text-blue-400 hover:underline cursor-pointer"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
