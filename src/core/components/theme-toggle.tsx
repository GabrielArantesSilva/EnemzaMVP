"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

import { cn } from "@/core/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [montado, setMontado] = useState(false);

  useEffect(() => setMontado(true), []);

  if (!montado) {
    return <div className={cn("size-9", className)} />;
  }

  const escuro = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(escuro ? "light" : "dark")}
      aria-label={escuro ? "Ativar tema claro" : "Ativar tema escuro"}
      className={cn(
        "flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-accent",
        className,
      )}
    >
      {escuro ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}
