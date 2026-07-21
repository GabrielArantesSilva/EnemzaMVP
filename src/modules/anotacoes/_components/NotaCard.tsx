import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { NotaComMateria } from "../anotacoes.types";

interface NotaCardProps {
  nota: NotaComMateria;
}

export function NotaCard({ nota }: NotaCardProps) {
  const preview = nota.conteudo.replace(/[#*_`>-]/g, "").trim().slice(0, 140);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="line-clamp-3 text-sm text-foreground/90">
        {preview || "Nota vazia."}
      </p>

      {nota.aula && (
        <Link
          href={`/aulas/${nota.aula.id}`}
          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary"
        >
          Voltar para {nota.aula.titulo}
          <ArrowUpRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}
