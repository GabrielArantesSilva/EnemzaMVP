import { Flame } from "lucide-react";

interface ResumoCardProps {
  nivel: number;
  modulosConcluidos: number;
}

export function ResumoCard({ nivel, modulosConcluidos }: ResumoCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-primary p-5 text-primary-foreground">
      <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
        <Flame className="size-7" strokeWidth={2.5} />
      </span>

      <div>
        <p className="font-display text-2xl font-extrabold leading-none">
          Nível {nivel}
        </p>
        <p className="mt-1 text-sm font-semibold opacity-80">
          {modulosConcluidos === 0
            ? "Nenhum módulo concluído ainda"
            : `${modulosConcluidos} ${modulosConcluidos === 1 ? "módulo concluído" : "módulos concluídos"}`}
        </p>
      </div>
    </div>
  );
}
