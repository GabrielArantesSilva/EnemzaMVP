import { Star, Trophy } from "lucide-react";

import { PageContainer } from "@/core/components/page-container";
import { ThemeToggle } from "@/core/components/theme-toggle";
import { getUsuarioAtual } from "@/lib/auth";
import { getPerfilUsuario } from "./perfil.api";
import { XpMateriaRow } from "./_components/XpMateriaRow";
import { SairButton } from "./_components/SairButton";
import { ExcluirContaButton } from "./_components/ExcluirContaButton";

export async function Perfil() {
  const usuario = await getUsuarioAtual();
  const perfil = await getPerfilUsuario(usuario.id);

  return (
    <PageContainer>
      <header className="relative flex flex-col items-center gap-1 pt-2 text-center">
        <ThemeToggle className="absolute right-0 top-0 md:hidden" />
        <span className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Trophy className="size-8" strokeWidth={2.25} />
        </span>
        <h1 className="mt-2 font-display text-lg font-extrabold">{perfil.nome}</h1>
        <p className="text-sm font-semibold text-muted-foreground">Nível {perfil.nivel}</p>
      </header>

      <div className="flex items-center justify-center gap-2 rounded-xl bg-card p-4">
        <Star className="size-5 text-primary" strokeWidth={2.5} />
        <span className="font-display text-2xl font-extrabold">{perfil.xpTotal}</span>
        <span className="text-sm font-semibold text-muted-foreground">XP no total</span>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-muted-foreground">XP por matéria</h2>
        <div className="flex flex-col gap-3">
          {perfil.xpPorMateria.map((materia) => (
            <XpMateriaRow key={materia.id} materia={materia} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <SairButton />
          <ExcluirContaButton />
        </div>
      </section>
    </PageContainer>
  );
}
