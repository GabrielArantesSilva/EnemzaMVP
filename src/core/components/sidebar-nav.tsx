"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/core/lib/utils";
import { NAV_ITEMS } from "./nav-items";
import { ThemeToggle } from "./theme-toggle";

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-y-0 left-0 z-50 hidden w-60 flex-col border-r border-sidebar-border bg-sidebar p-4 md:flex"
      aria-label="Navegação principal"
    >
      <span className="px-2 pb-6 font-display text-lg font-extrabold text-sidebar-foreground">
        Enemza
      </span>

      <ul className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-bold transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="size-5" strokeWidth={isActive ? 2.5 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      <ThemeToggle className="mt-auto" />
    </nav>
  );
}
