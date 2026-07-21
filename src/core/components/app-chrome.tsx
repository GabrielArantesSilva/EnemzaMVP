"use client";

import { usePathname } from "next/navigation";

import { BottomNav } from "./bottom-nav";
import { SidebarNav } from "./sidebar-nav";
import { ROTAS_SEM_NAV } from "./nav-items";

interface AppChromeProps {
  children: React.ReactNode;
}

export function AppChrome({ children }: AppChromeProps) {
  const pathname = usePathname();
  const semChrome = ROTAS_SEM_NAV.includes(pathname as (typeof ROTAS_SEM_NAV)[number]);

  if (semChrome) {
    return <>{children}</>;
  }

  return (
    <div className="pb-20 md:pb-0 md:pl-60">
      <SidebarNav />
      {children}
      <BottomNav />
    </div>
  );
}
