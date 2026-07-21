import Link from "next/link";
import { redirect } from "next/navigation";

import { PageContainer } from "@/core/components/page-container";
import { getUsuarioIdSeAutenticado } from "@/lib/auth";
import { DefinirSenhaForm } from "./_components/DefinirSenhaForm";

interface PrimeiroAcessoProps {
  token: string;
}

export async function PrimeiroAcesso({ token }: PrimeiroAcessoProps) {
  const usuarioId = await getUsuarioIdSeAutenticado();
  if (usuarioId) redirect("/");

  if (!token) {
    return (
      <PageContainer className="items-center justify-center text-center">
        <p className="text-sm text-muted-foreground">Link inválido. Confira o e-mail que enviamos após a compra.</p>
        <Link href="/login" className="text-sm font-semibold text-primary">
          Ir para o login
        </Link>
        <Link href="/vendas" className="text-sm text-muted-foreground underline">
          Ainda não comprou? Conheça o Enemza
        </Link>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="justify-center">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="font-display text-xl font-extrabold">Falta pouco</h1>
        <p className="text-sm text-muted-foreground">Crie uma senha pra acessar o Enemza.</p>
      </div>

      <DefinirSenhaForm token={token} />
    </PageContainer>
  );
}
