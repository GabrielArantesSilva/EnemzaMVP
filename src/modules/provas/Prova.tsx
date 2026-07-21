import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { PageContainer } from "@/core/components/page-container";
import { getUsuarioAtual } from "@/lib/auth";
import { getProvaParaResponder } from "./provas.api";
import { ProvaClient } from "./_components/ProvaClient";

interface ProvaProps {
  provaId: string;
}

export async function Prova({ provaId }: ProvaProps) {
  await getUsuarioAtual();
  const prova = await getProvaParaResponder(provaId);

  return (
    <PageContainer>
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground"
      >
        <ChevronLeft className="size-4" />
        Início
      </Link>

      <h1 className="font-display text-xl font-extrabold">Prova de fixação</h1>

      <ProvaClient prova={prova} />
    </PageContainer>
  );
}
