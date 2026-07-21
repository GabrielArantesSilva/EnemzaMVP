import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/core/components/ui/button";

interface NavegacaoAulasProps {
  aulaAnteriorId: string | null;
  aulaProximaId: string | null;
}

export function NavegacaoAulas({ aulaAnteriorId, aulaProximaId }: NavegacaoAulasProps) {
  if (!aulaAnteriorId && !aulaProximaId) return null;

  return (
    <div className="flex items-center justify-between gap-2">
      {aulaAnteriorId ? (
        <Link href={`/aulas/${aulaAnteriorId}`}>
          <Button variant="outline" size="sm" className="gap-1">
            <ChevronLeft className="size-4" />
            Anterior
          </Button>
        </Link>
      ) : (
        <span />
      )}

      {aulaProximaId && (
        <Link href={`/aulas/${aulaProximaId}`}>
          <Button size="sm" className="gap-1">
            Próxima aula
            <ChevronRight className="size-4" />
          </Button>
        </Link>
      )}
    </div>
  );
}
