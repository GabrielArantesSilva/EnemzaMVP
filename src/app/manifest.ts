import type { MetadataRoute } from "next";

// Ícone é placeholder (public/icon.svg) até o design system definir os assets
// finais — ver .harness/context.md, seção Design system/UI (ADR-pendente de
// direção visual completa das telas de Aula/Quiz).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Enemza",
    short_name: "Enemza",
    description: "Estudo gamificado para o ENEM — videoaulas, provas e anotações.",
    start_url: "/",
    display: "standalone",
    background_color: "#0B0B10",
    theme_color: "#0B0B10",
    icons: [
      {
        src: "/icon.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
