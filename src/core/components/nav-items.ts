import { Home, NotebookText, UserRound } from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Início", icon: Home },
  { href: "/anotacoes", label: "Anotações", icon: NotebookText },
  { href: "/perfil", label: "Perfil", icon: UserRound },
] as const;

export const ROTAS_SEM_NAV = ["/login", "/cadastro", "/primeiro-acesso", "/vendas"] as const;
