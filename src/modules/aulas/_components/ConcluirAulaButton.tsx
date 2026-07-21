"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";

import { Button } from "@/core/components/ui/button";
import { concluirAula } from "../aulas.actions";

interface ConcluirAulaButtonProps {
  aulaId: string;
  xpRecompensa: number;
  concluidaInicialmente: boolean;
}

export function ConcluirAulaButton({
  aulaId,
  xpRecompensa,
  concluidaInicialmente,
}: ConcluirAulaButtonProps) {
  const [concluida, setConcluida] = useState(concluidaInicialmente);
  const [pendente, iniciarTransicao] = useTransition();

  if (concluida) {
    return (
      <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2.5 text-sm font-bold text-secondary-foreground">
        <Check className="size-4" strokeWidth={3} />
        Aula concluída
      </div>
    );
  }

  return (
    <Button
      disabled={pendente}
      onClick={() =>
        iniciarTransicao(async () => {
          await concluirAula(aulaId);
          setConcluida(true);
        })
      }
    >
      {pendente ? "Marcando..." : `Concluir aula (+${xpRecompensa} XP)`}
    </Button>
  );
}
