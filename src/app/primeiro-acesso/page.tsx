import { PrimeiroAcesso } from "@/modules/auth/PrimeiroAcesso";

interface PageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const { token } = await searchParams;
  return <PrimeiroAcesso token={token ?? ""} />;
}
