import Link from "next/link";
import { redirect } from "next/navigation";

import { PageContainer } from "@/core/components/page-container";
import { getUsuarioIdSeAutenticado } from "@/lib/auth";
import { LoginForm } from "./_components/LoginForm";

export async function Login() {
  const usuarioId = await getUsuarioIdSeAutenticado();
  if (usuarioId) redirect("/");

  return (
    <PageContainer className="justify-center">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="font-display text-xl font-extrabold">Entrar no Enemza</h1>
        <p className="text-sm text-muted-foreground">Continue seus estudos de onde parou.</p>
      </div>

      <LoginForm />

      <p className="text-center text-sm text-muted-foreground">
        Ainda não tem conta?{" "}
        <Link href="/vendas" className="font-semibold text-primary">
          Conheça o Enemza
        </Link>
      </p>
    </PageContainer>
  );
}
