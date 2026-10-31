import { PageContainer } from "@/core/components/page-container";
import { getUsuarioAtual } from "@/lib/auth";
import { getModulosComProgresso, getResumoUsuario } from "./inicio.api";
import { ResumoCard } from "./_components/ResumoCard";
import { PlanoHojeCard } from "./_components/PlanoHojeCard";
import { ModulosFilterView } from "./_components/ModulosFilterView";

export async function Inicio() {
  const usuario = await getUsuarioAtual();
  const [modulos, resumo] = await Promise.all([
    getModulosComProgresso(usuario.id),
    getResumoUsuario(usuario.id),
  ]);

  return (
    <PageContainer className="max-w-4xl py-6 space-y-6">
      {/* Resumo do Estudante & Gamificação */}
      <ResumoCard resumo={resumo} />

      {/* Planejador Diário Inteligente & Pomodoro */}
      <PlanoHojeCard proximaAula={resumo.proximaAula} />

      {/* Módulos com Filtros por Área do ENEM e Ordenação TRI */}
      <div className="space-y-3">
        <h3 className="font-display text-lg font-extrabold text-white">
          Disciplinas & Cadernos do ENEM
        </h3>
        <ModulosFilterView modulos={modulos} />
      </div>
    </PageContainer>
  );
}
