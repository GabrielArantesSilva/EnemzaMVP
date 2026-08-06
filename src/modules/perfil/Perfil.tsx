import { CalendarClock, ClipboardList, PlayCircle, Star } from "lucide-react";

import { PageContainer } from "@/core/components/page-container";
import { ThemeToggle } from "@/core/components/theme-toggle";
import { Progress } from "@/core/components/ui/progress";
import { getUsuarioAtual } from "@/lib/auth";
import { diasRestantes, progressoPlanoDecorrido } from "@/lib/plano";
import { getPerfilUsuario } from "./perfil.api";
import type { ItemHistorico } from "./perfil.types";
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

function formatarDataRelativa(data: Date): string {
  const agora = new Date();
  const inicioHoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const inicio = new Date(data.getFullYear(), data.getMonth(), data.getDate());
  const diffDias = Math.round((inicioHoje.getTime() - inicio.getTime()) / 86_400_000);
  if (diffDias === 0) return "hoje";
  if (diffDias === 1) return "ontem";
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-card p-3">
      <span className="font-display text-xl font-extrabold">{value}</span>
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
    </div>
  );
}

function HistoricoItem({ item }: { item: ItemHistorico }) {
  const icone =
    item.tipo === "aula" ? (
      <PlayCircle className="size-5 shrink-0 text-primary" strokeWidth={2.5} />
    ) : (
      <ClipboardList className="size-5 shrink-0 text-primary" strokeWidth={2.5} />
    );
  const detalhe =
    item.tipo === "aula" ? "Aula concluída" : `${item.acertos}/${item.totalQuestoes} acertos`;

  return (
    <div className="flex items-center gap-3 rounded-xl bg-card p-3">
      {icone}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{item.titulo}</p>
        <p className="text-xs font-semibold text-muted-foreground">
          {detalhe} · {formatarDataRelativa(item.criadoEm)}
        </p>
      </div>
    </div>
  );
}

export async function Perfil() {
  const usuario = await getUsuarioAtual();
  const perfil = await getPerfilUsuario(usuario.id);

  const dias = diasRestantes(perfil.planoExpiraEm);
  const progressoPlano = progressoPlanoDecorrido(perfil.planoExpiraEm);
  const taxaAcerto =
    perfil.estatisticas.taxaAcerto !== null ? `${perfil.estatisticas.taxaAcerto}%` : "—";

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
        <h2 className="text-sm font-bold text-muted-foreground">Estatísticas</h2>
        <div className="grid grid-cols-3 gap-2">
          <MiniStat value={String(perfil.estatisticas.aulasConcluidas)} label="Aulas" />
          <MiniStat value={String(perfil.estatisticas.provasFeitas)} label="Provas" />
          <MiniStat value={taxaAcerto} label="Acerto" />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-bold text-muted-foreground">Histórico de estudos</h2>
        {perfil.historico.length === 0 ? (
          <p className="rounded-xl bg-card p-4 text-sm font-semibold text-muted-foreground">
            Nada por aqui ainda. Conclua uma aula ou faça uma prova!
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {perfil.historico.map((item) => (
              <HistoricoItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

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
