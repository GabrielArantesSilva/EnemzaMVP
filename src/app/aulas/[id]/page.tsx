import { Aula } from "@/modules/aulas/Aula";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <Aula aulaId={id} />;
}
