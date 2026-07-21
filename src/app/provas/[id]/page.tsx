import { Prova } from "@/modules/provas/Prova";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <Prova provaId={id} />;
}
