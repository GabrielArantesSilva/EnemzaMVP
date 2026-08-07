import type { Metadata } from "next";
import { Nunito, Baloo_2 } from "next/font/google";
import "@/core/styles/globals.css";
import { Analytics } from "@vercel/analytics/next";

import { ThemeProvider } from "@/core/components/theme-provider";
import { AppChrome } from "@/core/components/app-chrome";
import { AnalyticsProvider } from "@/core/components/analytics-provider";
import { getUsuarioIdSeAutenticado } from "@/lib/auth";

const fontSans = Nunito({
  variable: "--font-sans-app",
  subsets: ["latin"],
});

const fontDisplay = Baloo_2({
  variable: "--font-display-app",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Enemza",
  description: "Estudo gamificado para o ENEM — videoaulas, provas e anotações.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const usuarioId = await getUsuarioIdSeAutenticado();

  return (
    <html
      lang="pt-BR"
      className={`${fontSans.variable} ${fontDisplay.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <AnalyticsProvider usuarioId={usuarioId}>
          <ThemeProvider>
            <AppChrome>{children}</AppChrome>
          </ThemeProvider>
        </AnalyticsProvider>
        <Analytics />
      </body>
    </html>
  );
}
