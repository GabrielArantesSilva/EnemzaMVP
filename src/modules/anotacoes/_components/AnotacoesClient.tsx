"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { cn } from "@/core/lib/utils";
import { NotaCard } from "./NotaCard";
import type { NotaComMateria } from "../anotacoes.types";

interface MateriaChip {
  id: string;
  nome: string;
  corHex: string;
}

interface AnotacoesClientProps {
  notas: NotaComMateria[];
  materias: MateriaChip[];
}

export function AnotacoesClient({ notas, materias }: AnotacoesClientProps) {
  const [busca, setBusca] = useState("");
  const [materiaAtiva, setMateriaAtiva] = useState<string | null>(null);

  const notasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    return notas.filter((nota) => {
      const bateMateria = !materiaAtiva || nota.materia.id === materiaAtiva;
      const bateBusca = !termo || nota.conteudo.toLowerCase().includes(termo);
      return bateMateria && bateBusca;
    });
  }, [notas, busca, materiaAtiva]);

  const grupos = useMemo(() => {
    const porMateria = new Map<string, { materia: MateriaChip; notas: NotaComMateria[] }>();

    for (const nota of notasFiltradas) {
      const grupo = porMateria.get(nota.materia.id);
      if (grupo) {
        grupo.notas.push(nota);
      } else {
        porMateria.set(nota.materia.id, { materia: nota.materia, notas: [nota] });
      }
    }

    return [...porMateria.values()];
  }, [notasFiltradas]);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
          placeholder="Buscar nas suas anotações"
          className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setMateriaAtiva(null)}
          className={cn(
            "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold",
            materiaAtiva === null
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border text-muted-foreground",
          )}
        >
          Todas
        </button>
        {materias.map((materia) => (
          <button
            key={materia.id}
            type="button"
            onClick={() => setMateriaAtiva(materia.id)}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold",
              materiaAtiva === materia.id
                ? "border-transparent"
                : "border-border text-muted-foreground",
            )}
            style={
              materiaAtiva === materia.id
                ? { backgroundColor: materia.corHex, color: "#14141a" }
                : undefined
            }
          >
            {materia.nome}
          </button>
        ))}
      </div>

      {grupos.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          {notas.length === 0
            ? "Você ainda não escreveu nenhuma anotação."
            : "Nenhuma anotação encontrada."}
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {grupos.map(({ materia, notas: notasDoGrupo }) => (
            <section key={materia.id} className="flex flex-col gap-2">
              <h2
                className="text-sm font-bold"
                style={{ color: materia.corHex }}
              >
                {materia.nome}
              </h2>
              <div className="flex flex-col gap-2">
                {notasDoGrupo.map((nota) => (
                  <NotaCard key={nota.id} nota={nota} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
