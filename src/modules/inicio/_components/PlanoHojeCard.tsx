"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Play, Sparkles, Clock, CheckCircle2, Timer, Zap, ArrowRight, Pause, RotateCcw } from "lucide-react";
import type { ProximaAula } from "../inicio.types";

interface PlanoHojeCardProps {
  proximaAula: ProximaAula | null;
}

type ModoTempo = "30m" | "1h" | "2h";

export function PlanoHojeCard({ proximaAula }: PlanoHojeCardProps) {
  const [tempoSelecionado, setTempoSelecionado] = useState<ModoTempo>("30m");
  const [pomodoroAtivo, setPomodoroAtivo] = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(25 * 60);

  // Timer Pomodoro
  useEffect(() => {
    if (!pomodoroAtivo) return;
    const interval = setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev <= 1) {
          setPomodoroAtivo(false);
          return 25 * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [pomodoroAtivo]);

  const minutos = Math.floor(segundosRestantes / 60);
  const segundos = segundosRestantes % 60;
  const tempoFormatado = `${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-5">
      {/* Topo do Plano Diário */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
            <Sparkles className="size-4" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-base text-white">
              O que estudar hoje?
            </h3>
            <p className="text-xs text-slate-400">
              Escolha seu tempo disponível para montar sua meta diária
            </p>
          </div>
        </div>

        {/* Seletor de Tempo (30m / 1h / 2h) */}
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-slate-950 p-1 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setTempoSelecionado("30m")}
            className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
              tempoSelecionado === "30m"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ⚡ 30 min
          </button>
          <button
            type="button"
            onClick={() => setTempoSelecionado("1h")}
            className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
              tempoSelecionado === "1h"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🎯 1 hora
          </button>
          <button
            type="button"
            onClick={() => setTempoSelecionado("2h")}
            className={`rounded-full px-3 py-1 text-xs font-bold transition-all ${
              tempoSelecionado === "2h"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🔥 2 horas
          </button>
        </div>
      </div>

      {/* Roteiro Didático Gerado com base no tempo */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Lado Esquerdo: Card da Próxima Aula Pendente */}
        <div className="md:col-span-7">
          {proximaAula ? (
            <div className="group relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-950/50 via-slate-900 to-indigo-950/40 p-4 transition-all hover:border-blue-500/60 shadow-lg">
              <div className="flex items-center justify-between">
                <span
                  className="rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${proximaAula.moduloCorHex}26`,
                    color: proximaAula.moduloCorHex,
                  }}
                >
                  {proximaAula.moduloNome} • Aula #{proximaAula.ordem}
                </span>

                <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                  <Zap className="size-3 fill-amber-400" /> +10 XP
                </span>
              </div>

              <h4 className="mt-2 text-sm sm:text-base font-extrabold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                {proximaAula.titulo}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Continuar de onde você parou no cronograma oficial.
              </p>

              <div className="mt-4 flex items-center justify-between">
                <Link
                  href={`/aulas/${proximaAula.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-extrabold text-white shadow-md shadow-blue-500/25 transition-transform hover:bg-blue-500 active:scale-95"
                >
                  <Play className="size-3.5 fill-white" />
                  <span>Assistir Agora</span>
                </Link>

                <Link
                  href={`/modulos/${proximaAula.moduloId}`}
                  className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Ver módulo</span>
                  <ArrowRight className="size-3" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/5 bg-slate-950/60 p-5 text-center">
              <p className="text-sm font-bold text-emerald-400">
                🎉 Parabéns! Você concluiu todas as aulas disponíveis!
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Aproveite para revisar suas anotações e fazer simulados de fixação.
              </p>
            </div>
          )}
        </div>

        {/* Lado Direito: Cronômetro de Foco / Pomodoro Didático */}
        <div className="md:col-span-5 rounded-2xl border border-white/5 bg-slate-950/80 p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <Timer className="size-4 text-blue-400" />
              <span>Modo Foco (Pomodoro)</span>
            </div>
            <span className="font-mono text-xs text-slate-400 font-bold">
              {pomodoroAtivo ? "Concentrado..." : "25 min"}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="font-mono text-2xl font-black text-white tracking-wider">
              {tempoFormatado}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPomodoroAtivo(!pomodoroAtivo)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all cursor-pointer ${
                  pomodoroAtivo
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-blue-600 text-white hover:bg-blue-500 shadow-sm"
                }`}
              >
                {pomodoroAtivo ? (
                  <>
                    <Pause className="size-3" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="size-3 fill-white" />
                    <span>Iniciar</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPomodoroAtivo(false);
                  setSegundosRestantes(25 * 60);
                }}
                className="rounded-xl border border-white/10 p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Reiniciar timer"
              >
                <RotateCcw className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Sugestão didática conforme o tempo */}
          <div className="text-[11px] text-slate-400 border-t border-white/5 pt-2">
            {tempoSelecionado === "30m" && (
              <p>📌 <strong className="text-slate-300">Meta Express:</strong> 1 videoaula prioritária + 1 quiz de 3 questões.</p>
            )}
            {tempoSelecionado === "1h" && (
              <p>📌 <strong className="text-slate-300">Meta Foco:</strong> 2 aulas da matéria com maior peso TRI + anotações.</p>
            )}
            {tempoSelecionado === "2h" && (
              <p>📌 <strong className="text-slate-300">Meta Imersão:</strong> 1 bloco completo de disciplina + simulado com correção.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
