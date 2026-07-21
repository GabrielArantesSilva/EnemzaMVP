import type { NotaDaAula } from "../aulas.types";

interface NotaAulaItemProps {
  nota: NotaDaAula;
}

export function NotaAulaItem({ nota }: NotaAulaItemProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="whitespace-pre-wrap text-sm text-foreground/90">{nota.conteudo}</p>
    </div>
  );
}
