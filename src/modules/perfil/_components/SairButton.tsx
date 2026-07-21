"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/core/components/ui/button";
import { sair } from "@/modules/auth/auth.actions";

export function SairButton() {
  const router = useRouter();
  const [pendente, iniciarTransicao] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pendente}
      onClick={() =>
        iniciarTransicao(async () => {
          await sair();
          router.replace("/login");
          router.refresh();
        })
      }
    >
      <LogOut className="size-4" />
      {pendente ? "Saindo..." : "Sair"}
    </Button>
  );
}
