import Link from "next/link";
import { HelpCircle } from "lucide-react";

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
      className="flex items-center gap-4 rounded-xl border border-border bg-card p-4"
    >
      <span
        className="flex size-12 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: `${modulo.corHex}26`, color: modulo.corHex }}
      >
        <Icon className="size-6" strokeWidth={2.25} />
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-display font-bold">{modulo.nome}</p>

        {temAulas ? (
          <div className="mt-1.5 flex items-center gap-2">
            <Progress
              value={percentual}
              indicatorColor={modulo.corHex}
              className="h-2 flex-1"
            />
            <span className="shrink-0 text-xs font-semibold text-muted-foreground">
              {modulo.aulasConcluidas}/{modulo.totalAulas}
            </span>
          </div>
        ) : (
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            Aulas em breve
          </p>
        )}
      </div>
    </Link>
  );
}
