import { Progress } from "@/core/components/ui/progress";
import type { XpPorMateria } from "../perfil.types";

interface XpMateriaRowProps {
  materia: XpPorMateria;
}

export function XpMateriaRow({ materia }: XpMateriaRowProps) {
  const percentual =
    materia.xpMaximo > 0 ? Math.round((materia.xp / materia.xpMaximo) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <span
        className="size-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: materia.corHex }}
      />
      <span className="w-24 shrink-0 truncate text-sm font-semibold">
        {materia.nome}
      </span>
      <Progress value={percentual} indicatorColor={materia.corHex} className="h-2 flex-1" />
      <span className="w-14 shrink-0 text-right text-xs font-semibold text-muted-foreground">
        {materia.xp} XP
      </span>
    </div>
  );
}
