import { CalendarClock, Star } from "lucide-react";

import { PageContainer } from "@/core/components/page-container";
import { ThemeToggle } from "@/core/components/theme-toggle";
import { Progress } from "@/core/components/ui/progress";
import { getUsuarioAtual } from "@/lib/auth";
import { diasRestantes, progressoPlanoDecorrido } from "@/lib/plano";
import { getPerfilUsuario } from "./perfil.api";
import { XpMateriaRow } from "./_components/XpMateriaRow";
import { SairButton } from "./_components/SairButton";
import { ExcluirContaButton } from "./_components/ExcluirContaButton";

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/).slice(0, 2);
  const iniciais = partes.map((parte) => parte[0]?.toUpperCase() ?? "").join("");
  return iniciais || "?";
}

function formatarData(data: Date): string {
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export async function Perfil() {
  const usuario = await getUsuarioAtual();
  const perfil = await getPerfilUsuario(usuario.id);

  const dias = diasRestantes(perfil.planoExpiraEm);
  const progressoPlano = progressoPlanoDecorrido(perfil.planoExpiraEm);

  return (
    <PageContainer>
      <header className="flex flex-col items-center gap-1 pt-2 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary font-display text-2xl font-extrabold text-primary-foreground">
          {iniciais(perfil.nome)}
        </span>
        <h1 className="mt-2 font-display text-lg font-extrabold">{perfil.nome}</h1>
        <p className="text-sm font-semibold text-muted-foreground">{perfil.email}</p>
        <p className="text-sm font-semibold text-primary">Nível {perfil.nivel}</p>
      </header>

      {perfil.planoExpiraEm ? (
        <section className="flex flex-col gap-2 rounded-xl bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CalendarClock className="size-5 text-primary" strokeWidth={2.5} />
              <span className="text-sm font-bold">Plano ativo</span>
            </div>
            <span className="text-sm font-bold text-primary">
              {dias > 0 ? `Faltam ${dias} dia${dias === 1 ? "" : "s"}` : "Plano expirado"}
            </span>
          </div>
          <Progress value={progressoPlano * 100} className="h-2" />
          <p className="text-xs font-semibold text-muted-foreground">
            Termina em {formatarData(perfil.planoExpiraEm)}
          </p>
        </section>
      ) : null}

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
        <h2 className="text-sm font-bold text-muted-foreground">Configurações</h2>
        <div className="flex items-center justify-between rounded-xl bg-card p-4">
          <span className="text-sm font-semibold">Tema</span>
          <ThemeToggle />
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
