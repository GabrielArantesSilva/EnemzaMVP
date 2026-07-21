"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { Button } from "@/core/components/ui/button";
import { excluirContaAtual } from "@/modules/auth/auth.actions";

export function ExcluirContaButton() {
  const router = useRouter();
  const [confirmando, setConfirmando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, iniciarTransicao] = useTransition();

  if (!confirmando) {
    return (
      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setConfirmando(true)}>
        <Trash2 className="size-4" />
        Excluir conta
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3">
      <p className="text-xs font-semibold text-destructive">
        Isso apaga sua conta, notas e progresso permanentemente. Não é possível desfazer.
      </p>
      {erro && <p className="text-xs font-semibold text-destructive">{erro}</p>}
      <div className="flex gap-2">
        <Button
          variant="destructive"
          size="sm"
          disabled={pendente}
          onClick={() =>
            iniciarTransicao(async () => {
              try {
                await excluirContaAtual();
                router.replace("/cadastro");
                router.refresh();
              } catch {
                setErro("Não foi possível excluir a conta. Tente de novo.");
              }
            })
          }
        >
          {pendente ? "Excluindo..." : "Confirmar exclusão"}
        </Button>
        <Button variant="outline" size="sm" onClick={() => setConfirmando(false)} disabled={pendente}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
