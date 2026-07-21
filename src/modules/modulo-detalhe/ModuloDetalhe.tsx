import Link from "next/link";
import { Check, ChevronLeft, CircleDashed, PencilLine } from "lucide-react";

import { Button } from "@/core/components/ui/button";
import { PageContainer } from "@/core/components/page-container";
import { getUsuarioAtual } from "@/lib/auth";
import { getModuloComAulas } from "./modulo-detalhe.api";

interface ModuloDetalheProps {
  moduloId: string;
}

export async function ModuloDetalhe({ moduloId }: ModuloDetalheProps) {
  const usuario = await getUsuarioAtual();
  const modulo = await getModuloComAulas(moduloId, usuario.id);

  return (
    <PageContainer>
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground"
      >
        <ChevronLeft className="size-4" />
        Início
      </Link>

      <h1 className="font-display text-xl font-extrabold" style={{ color: modulo.corHex }}>
        {modulo.nome}
      </h1>

      {modulo.aulas.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Aulas em breve.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {modulo.aulas.map((aula) => (
            <Link
              key={aula.id}
              href={`/aulas/${aula.id}`}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
            >
              {aula.concluida ? (
                <Check className="size-5 shrink-0 text-primary" strokeWidth={2.5} />
              ) : (
                <CircleDashed className="size-5 shrink-0 text-muted-foreground" />
              )}
              <span className="font-semibold">{aula.titulo}</span>
            </Link>
          ))}
        </div>
      )}

      {modulo.provaId && (
        <Link href={`/provas/${modulo.provaId}`}>
          <Button className="w-full gap-2">
            <PencilLine className="size-4" />
            Fazer prova de fixação
          </Button>
        </Link>
      )}
    </PageContainer>
  );
}
