"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { PostHogProvider as PostHogReactProvider, usePostHog } from "posthog-js/react";

const CHAVE_PUBLICA = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

let inicializado = false;

function inicializarSePreciso() {
  if (!CHAVE_PUBLICA || inicializado) return;
  posthog.init(CHAVE_PUBLICA, {
    api_host: HOST,
    person_profiles: "identified_only",
    capture_pageview: false, // pageview manual abaixo, pra funcionar com App Router (navegação client-side)
    autocapture: false, // sem captura automática de clique/formulário — só eventos explícitos (ver boundaries.md, LGPD)
  });
  inicializado = true;
}

function RastreadorDePageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthogClient = usePostHog();

  useEffect(() => {
    if (!posthogClient) return;
    const url = searchParams.size > 0 ? `${pathname}?${searchParams.toString()}` : pathname;
    posthogClient.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, posthogClient]);

  return null;
}

interface AnalyticsProviderProps {
  usuarioId: string | null;
  children: React.ReactNode;
}

function SincronizarIdentidade({ usuarioId }: { usuarioId: string | null }) {
  const posthogClient = usePostHog();
  const usuarioAnterior = useRef<string | null>(null);

  useEffect(() => {
    if (!posthogClient || usuarioAnterior.current === usuarioId) return;
    usuarioAnterior.current = usuarioId;

    if (usuarioId) {
      posthogClient.identify(usuarioId);
    } else {
      posthogClient.reset();
    }
  }, [usuarioId, posthogClient]);

  return null;
}

export function AnalyticsProvider({ usuarioId, children }: AnalyticsProviderProps) {
  inicializarSePreciso();

  if (!CHAVE_PUBLICA) {
    return <>{children}</>;
  }

  return (
    <PostHogReactProvider client={posthog}>
      <Suspense fallback={null}>
        <RastreadorDePageview />
      </Suspense>
      <SincronizarIdentidade usuarioId={usuarioId} />
      {children}
    </PostHogReactProvider>
  );
}
