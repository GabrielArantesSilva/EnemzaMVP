import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { PageContainer } from "@/core/components/page-container";
import { getUsuarioAtual } from "@/lib/auth";
import { getAulaDetalhe } from "./aulas.api";
import { VideoEmbed } from "./_components/VideoEmbed";
import { ConcluirAulaButton } from "./_components/ConcluirAulaButton";
import { NotaForm } from "./_components/NotaForm";
import { NotaAulaItem } from "./_components/NotaAulaItem";
import { NavegacaoAulas } from "./_components/NavegacaoAulas";

interface AulaProps {
  aulaId: string;
}

export async function Aula({ aulaId }: AulaProps) {
  const usuario = await getUsuarioAtual();
  const aula = await getAulaDetalhe(aulaId, usuario.id);

  return (
    <PageContainer>
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground"
      >
        <ChevronLeft className="size-4" />
        Início
      </Link>

      <VideoEmbed youtubeUrl={aula.youtubeUrl} titulo={aula.titulo} />

      <div>
        <p className="text-xs font-bold" style={{ color: aula.modulo.corHex }}>
          {aula.modulo.nome}
        </p>
        <h1 className="font-display text-lg font-extrabold">{aula.titulo}</h1>
      </div>

      <ConcluirAulaButton
        aulaId={aula.id}
        xpRecompensa={aula.xpRecompensa}
        concluidaInicialmente={aula.concluida}
      />

      <NavegacaoAulas aulaAnteriorId={aula.aulaAnteriorId} aulaProximaId={aula.aulaProximaId} />

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-muted-foreground">Suas anotações</h2>
        <NotaForm aulaId={aula.id} />
        <div className="flex flex-col gap-2">
          {aula.notas.map((nota) => (
            <NotaAulaItem key={nota.id} nota={nota} />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
