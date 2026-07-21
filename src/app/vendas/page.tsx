import type { Metadata } from "next";

import { ESTILO_CSS } from "./estilo";
import { criarConteudoHtml } from "./conteudo";

export const metadata: Metadata = {
  title: "Enemza — Organize seus estudos pro ENEM",
  description:
    "Videoaulas do YouTube organizadas por matéria e módulo, provas de fixação e anotações num só lugar.",
};

export default function Page() {
  const html = criarConteudoHtml(process.env.KIWIFY_CHECKOUT_URL);

  return (
    <div className="vendas-root">
      <style dangerouslySetInnerHTML={{ __html: ESTILO_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
