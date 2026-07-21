import Link from "next/link";
import { redirect } from "next/navigation";

import { PageContainer } from "@/core/components/page-container";
import { Button } from "@/core/components/ui/button";
import { getUsuarioIdSeAutenticado } from "@/lib/auth";

// Sem cadastro aberto — acesso é liberado só a quem compra (ver TD-0007).
export async function Cadastro() {
  const usuarioId = await getUsuarioIdSeAutenticado();
  if (usuarioId) redirect("/");

  const urlVenda = process.env.KIWIFY_CHECKOUT_URL;

  return (
    <PageContainer className="items-center justify-center text-center">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-xl font-extrabold">Garanta seu acesso ao Enemza</h1>
        <p className="text-sm text-muted-foreground">
          O acesso é liberado automaticamente após a compra.
        </p>
      </div>

      {urlVenda ? (
        <Button asChild size="lg">
          <a href={urlVenda}>Quero acesso ao Enemza</a>
        </Button>
      ) : (
        <p className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          Link de venda ainda não configurado.
        </p>
      )}

      <p className="text-sm text-muted-foreground">
        Já comprou?{" "}
        <Link href="/login" className="font-semibold text-primary">
          Entrar
        </Link>
      </p>
    </PageContainer>
  );
}
