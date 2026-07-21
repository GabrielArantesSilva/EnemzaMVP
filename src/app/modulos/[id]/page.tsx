import { ModuloDetalhe } from "@/modules/modulo-detalhe/ModuloDetalhe";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <ModuloDetalhe moduloId={id} />;
}
