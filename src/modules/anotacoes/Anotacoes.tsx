import { PageContainer } from "@/core/components/page-container";
import { prisma } from "@/lib/prisma";
import { getUsuarioAtual } from "@/lib/auth";
import { getNotasComMateria } from "./anotacoes.api";
import { AnotacoesClient } from "./_components/AnotacoesClient";

export async function Anotacoes() {
  const usuario = await getUsuarioAtual();
  const [notas, materias] = await Promise.all([
    getNotasComMateria(usuario.id),
    prisma.modulo.findMany({
      orderBy: { ordem: "asc" },
      select: { id: true, nome: true, corHex: true },
    }),
  ]);

  return (
    <PageContainer>
      <header>
        <h1 className="font-display text-xl font-extrabold">Anotações</h1>
      </header>

      <AnotacoesClient notas={notas} materias={materias} />
    </PageContainer>
  );
}
