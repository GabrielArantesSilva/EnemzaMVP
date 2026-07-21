import { PageContainer } from "@/core/components/page-container";
import { getUsuarioAtual } from "@/lib/auth";
import { getModulosComProgresso, getResumoUsuario } from "./inicio.api";
import { ModuloCard } from "./_components/ModuloCard";
import { ResumoCard } from "./_components/ResumoCard";

export async function Inicio() {
  const usuario = await getUsuarioAtual();
  const [modulos, resumo] = await Promise.all([
    getModulosComProgresso(usuario.id),
    getResumoUsuario(usuario.id),
  ]);

  return (
    <PageContainer>
      <header>
        <h1 className="font-display text-xl font-extrabold">Enemza</h1>
      </header>

      <ResumoCard nivel={resumo.nivel} modulosConcluidos={resumo.modulosConcluidos} />

      <div className="flex flex-col gap-3">
        {modulos.map((modulo) => (
          <ModuloCard key={modulo.id} modulo={modulo} />
        ))}
      </div>
    </PageContainer>
  );
}
