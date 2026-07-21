"use client";

import { useState, useTransition } from "react";

import { Button } from "@/core/components/ui/button";
import { criarNota } from "@/lib/notas";

interface NotaFormProps {
  aulaId: string;
}

export function NotaForm({ aulaId }: NotaFormProps) {
  const [conteudo, setConteudo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  function salvar() {
    if (!conteudo.trim()) return;

    iniciarTransicao(async () => {
      try {
        await criarNota({ aulaId, conteudo });
        setConteudo("");
        setErro(null);
      } catch {
        setErro("Não foi possível salvar a nota. Tente de novo.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={conteudo}
        onChange={(evento) => setConteudo(evento.target.value)}
        placeholder="Escreva uma anotação sobre esta aula (markdown)..."
        rows={3}
        className="w-full resize-none rounded-xl border border-border bg-card p-3 text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      />
      {erro && <p className="text-xs font-semibold text-destructive">{erro}</p>}
      <Button
        size="sm"
        className="self-end"
        disabled={pendente || !conteudo.trim()}
        onClick={salvar}
      >
        {pendente ? "Salvando..." : "Salvar nota"}
      </Button>
    </div>
  );
}
