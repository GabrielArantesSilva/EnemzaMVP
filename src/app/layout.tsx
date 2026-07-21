import type { Metadata } from "next";
import { Nunito, Baloo_2 } from "next/font/google";
import "@/core/styles/globals.css";

import { ThemeProvider } from "@/core/components/theme-provider";
import { AppChrome } from "@/core/components/app-chrome";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fontSans.variable} ${fontDisplay.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <ThemeProvider>
          <AppChrome>{children}</AppChrome>
        </ThemeProvider>
      </body>
    </html>
  );
}
