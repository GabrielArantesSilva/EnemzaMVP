"use client";

import { useState, useEffect } from "react";
import {
  Flame,
  Zap,
  CheckCircle2,
  BookOpen,
  Play,
  Trophy,
  Sparkles,
  Clock,
  Award,
  Layers,
} from "lucide-react";

type TabId = "trilha" | "questao" | "aula";

export function LoginShowcase() {
  const [activeTab, setActiveTab] = useState<TabId>("trilha");
  const [questaoRespondida, setQuestaoRespondida] = useState<number | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  // Alterna as abas automaticamente se o usuário não tiver interagido manualmente
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setActiveTab((prev) => {
        if (prev === "trilha") return "questao";
        if (prev === "questao") return "aula";
        return "trilha";
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [autoRotate]);

  function handleTabClick(tab: TabId) {
    setAutoRotate(false);
    setActiveTab(tab);
  }

  return (
    <div className="relative flex flex-col items-center justify-center p-4 lg:p-8">
      {/* Luz ambiente de fundo (Glow atmosférico) */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-20 right-10 -z-10 h-80 w-80 rounded-full bg-amber-500/15 blur-[100px]" />

      {/* Seletor de telas em pílula estilizada */}
      <div className="mb-6 flex items-center gap-1.5 rounded-full border border-white/10 bg-slate-900/80 p-1.5 shadow-xl backdrop-blur-xl">
        <button
          type="button"
          onClick={() => handleTabClick("trilha")}
          className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
            activeTab === "trilha"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Layers className="size-3.5" />
          <span>Trilha & XP</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabClick("questao")}
          className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
            activeTab === "questao"
              ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <Zap className="size-3.5" />
          <span>Simulado ENEM</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabClick("aula")}
          className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
            activeTab === "aula"
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25"
              : "text-slate-400 hover:text-white"
          }`}
        >
          <BookOpen className="size-3.5" />
          <span>Caderno & Aula</span>
        </button>
      </div>

      {/* Mockup do Smartphone */}
      <div className="relative w-full max-w-[340px] sm:max-w-[370px]">
        {/* Badge flutuante Topo: Provas & TRI */}
        <div className="absolute -top-4 -left-6 z-20 hidden items-center gap-2.5 rounded-2xl border border-white/10 bg-slate-900/90 p-3 shadow-2xl backdrop-blur-md sm:flex animate-bounce [animation-duration:4s]">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-black shadow-md shadow-amber-500/20">
            <Trophy className="size-5" />
          </div>
          <div className="text-left">
            <p className="text-[11px] font-bold text-white leading-tight">Método Focado no ENEM</p>
            <p className="text-[10px] text-slate-400">Curadoria por incidência TRI</p>
          </div>
        </div>

        {/* Badge flutuante Rodapé: Streak */}
        <div className="absolute -bottom-5 -right-6 z-20 hidden items-center gap-2.5 rounded-2xl border border-white/10 bg-slate-900/90 p-3 shadow-2xl backdrop-blur-md sm:flex">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25">
            <Sparkles className="size-5" />
          </div>
          <div className="text-left">
            <p className="text-[11px] font-bold text-white leading-tight">Videoaulas + Questões</p>
            <p className="text-[10px] text-emerald-400 font-semibold">Fixação imediata</p>
          </div>
        </div>

        {/* Moldura do Aparelho (Chassis Metal/Glass) */}
        <div className="relative overflow-hidden rounded-[42px] border-[10px] border-slate-800 bg-slate-950 p-2.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(59,130,246,0.15)] ring-1 ring-white/15">
          {/* Tela interna OLED */}
          <div className="relative flex h-[580px] flex-col overflow-hidden rounded-[32px] bg-[#090f23] text-slate-100 select-none border border-white/5">
            
            {/* Dynamic Island / Câmera frontal */}
            <div className="relative z-30 mx-auto mt-2 h-5 w-24 rounded-full bg-black flex items-center justify-center">
              <div className="size-2 rounded-full bg-slate-900 mr-2 ring-1 ring-slate-800" />
              <div className="size-1.5 rounded-full bg-blue-950" />
            </div>

            {/* Barra de Status (Relógio e Bateria) */}
            <div className="flex items-center justify-between px-6 pt-1 text-[11px] font-bold text-slate-400">
              <span>09:41</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]">5G</span>
                <div className="h-2.5 w-5 rounded-xs border border-slate-400 p-0.5">
                  <div className="h-full w-3.5 rounded-xs bg-slate-200" />
                </div>
              </div>
            </div>

            {/* CONTEÚDO DA TELA ATIVA */}
            <div className="flex-1 overflow-y-auto px-4 py-3 text-left">
              {activeTab === "trilha" && (
                <div className="space-y-3.5">
                  {/* Header do Estudante */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                        Painel do Aluno
                      </span>
                      <h3 className="text-base font-extrabold text-white">Olá, Gabriel! 👋</h3>
                    </div>
                    {/* Badge de Ofensiva (Streak) */}
                    <div className="flex items-center gap-1 rounded-full border border-orange-500/30 bg-orange-500/15 px-2.5 py-1 text-xs font-extrabold text-orange-400 shadow-sm">
                      <Flame className="size-3.5 fill-orange-400 text-orange-400" />
                      <span>7 dias</span>
                    </div>
                  </div>

                  {/* Card Nível & XP */}
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-950/60 via-slate-900 to-indigo-950/60 p-3.5 shadow-lg backdrop-blur-sm">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-300">Nível 5 • Focado</span>
                      <span className="flex items-center gap-1 font-black text-amber-400">
                        <Zap className="size-3 fill-amber-400 text-amber-400" />
                        1.480 XP
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-400 transition-all duration-1000" />
                    </div>
                    <p className="mt-1.5 text-[10px] text-slate-400 text-right">
                      Faltam 220 XP para o Nível 6
                    </p>
                  </div>

                  {/* Card: Continuar de Onde Parou */}
                  <div className="group relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 p-3">
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-400 uppercase">
                        Em andamento
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="size-3" /> 14 min
                      </span>
                    </div>
                    <h4 className="mt-1.5 text-xs font-bold text-white">
                      Eletrodinâmica: Circuitos e Potência
                    </h4>
                    <p className="text-[10px] text-slate-300">Física • Aula 03 de 08</p>
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                        <CheckCircle2 className="size-3 text-emerald-400" /> 65% concluído
                      </div>
                      <div className="flex size-6 items-center justify-center rounded-full bg-blue-500 text-white shadow-md">
                        <Play className="size-3 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Lista de Módulos */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-300">Suas Disciplinas</span>

                    {/* Módulo Matemática */}
                    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-900/80 p-2.5 hover:border-blue-500/40 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 font-black text-xs">
                          📐
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Matemática</p>
                          <p className="text-[10px] text-slate-400">Funções & Geometria</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md">
                        85%
                      </span>
                    </div>

                    {/* Módulo Redação */}
                    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-900/80 p-2.5 hover:border-purple-500/40 transition-colors">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-purple-600/20 text-purple-400 font-black text-xs">
                          ✍️
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Redação Nota 1000</p>
                          <p className="text-[10px] text-slate-400">Estrutura & Repertório</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 px-2 py-1 rounded-md">
                        Novo
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "questao" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pt-1">
                    <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-400">
                      ENEM 2024 • Simulado
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Q 04 de 10</span>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-slate-900/90 p-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-400">
                      <Award className="size-3" /> Alta Incidência TRI
                    </div>
                    <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-200">
                      Um resistor ôhmico sob d.d.p. constante tem seu comprimento reduzido à metade. O que ocorre com a potência dissipada?
                    </p>
                  </div>

                  {/* Alternativas Interativas */}
                  <div className="space-y-1.5">
                    {[
                      { letra: "A", texto: "Permanece inalterada", correta: false },
                      { letra: "B", texto: "É duplicada devido à menor resistência", correta: true },
                      { letra: "C", texto: "Reduz-se à metade do valor inicial", correta: false },
                      { letra: "D", texto: "Quadruplica instantaneamente", correta: false },
                    ].map((alt, index) => {
                      const selecionada = questaoRespondida === index;
                      const isCorrect = alt.correta && selecionada;
                      const isWrong = !alt.correta && selecionada;

                      return (
                        <button
                          key={alt.letra}
                          type="button"
                          onClick={() => setQuestaoRespondida(index)}
                          className={`w-full flex items-center gap-2.5 rounded-xl border p-2.5 text-left text-xs transition-all ${
                            isCorrect
                              ? "border-emerald-500 bg-emerald-500/20 text-white font-bold shadow-md shadow-emerald-500/20"
                              : isWrong
                              ? "border-red-500/60 bg-red-500/15 text-slate-300"
                              : "border-white/5 bg-slate-900/70 text-slate-300 hover:border-blue-500/40 hover:bg-slate-900"
                          }`}
                        >
                          <span
                            className={`flex size-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-black ${
                              isCorrect
                                ? "bg-emerald-500 text-slate-950"
                                : isWrong
                                ? "bg-red-500 text-white"
                                : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {alt.letra}
                          </span>
                          <span className="flex-1 text-[11px] leading-tight">{alt.texto}</span>
                          {isCorrect && <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {questaoRespondida !== null && (
                    <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/40 p-2.5 text-[11px] text-emerald-300 animate-in fade-in zoom-in-95">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Sparkles className="size-3.5 text-amber-400" />
                        <span>Excelente raciocínio! +50 XP</span>
                      </div>
                      <p className="mt-0.5 text-[10px] text-slate-300">
                        Como R = ρ·L/A, diminuir L divide R por 2. Pela equação P = U²/R, a potência dobra.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "aula" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      Videoaula Ativa
                    </span>
                    <span className="rounded-md bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                      HD 1080p
                    </span>
                  </div>

                  {/* Mockup do Player */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950 flex flex-col justify-between p-2.5 shadow-md">
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>Prof. Curado • YouTube</span>
                      <span className="rounded-full bg-red-600/80 px-1.5 py-0.2 text-[9px] font-bold text-white">
                        ENEM
                      </span>
                    </div>

                    <div className="self-center flex size-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/40">
                      <Play className="size-4 fill-white ml-0.5" />
                    </div>

                    {/* Barra de vídeo com capítulos */}
                    <div>
                      <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono mb-1">
                        <span>04:12</span>
                        <span>12:50</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden flex">
                        <div className="h-full w-1/3 bg-blue-500" />
                        <div className="h-full w-1/4 bg-blue-400/60" />
                        <div className="h-full w-1/2 bg-slate-800" />
                      </div>
                    </div>
                  </div>

                  {/* Caderno de Anotações Inteligente */}
                  <div className="rounded-xl border border-white/10 bg-slate-900/90 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                        <BookOpen className="size-3.5 text-blue-400" />
                        <span>Seu Caderno Inteligente</span>
                      </div>
                      <span className="text-[9px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        Sincronizado
                      </span>
                    </div>
                    <div className="rounded-lg bg-slate-950/80 p-2 text-[10px] text-slate-300 border border-white/5 space-y-1">
                      <p className="font-semibold text-amber-400">📌 Ponto Crucial para o ENEM:</p>
                      <p>• Geradores: U = E - r·i</p>
                      <p>• Receptores: U&apos; = E&apos; + r&apos;·i</p>
                      <p className="text-slate-400 italic">&ldquo;Cai todo ano na prova de Natureza!&rdquo;</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Nav Mockup */}
            <div className="mt-auto border-t border-white/5 bg-slate-950/90 px-4 py-2 flex items-center justify-around text-slate-400 text-[10px]">
              <div className="flex flex-col items-center text-blue-400 font-bold">
                <Layers className="size-4" />
                <span>Trilhas</span>
              </div>
              <div className="flex flex-col items-center hover:text-white">
                <BookOpen className="size-4" />
                <span>Anotações</span>
              </div>
              <div className="flex flex-col items-center hover:text-white">
                <Trophy className="size-4" />
                <span>Ranking</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legenda de valor abaixo do mockup */}
      <p className="mt-5 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
        <Sparkles className="size-3.5 text-amber-400" />
        <span>Experimente interagir com as abas e questões acima!</span>
      </p>
    </div>
  );
}
