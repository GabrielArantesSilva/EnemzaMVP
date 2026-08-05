import { prisma } from "@/lib/prisma";
import { criarToken } from "@/lib/token";
import { enviarEmail } from "@/lib/email";

export const DURACAO_PRIMEIRO_ACESSO_MS = 1000 * 60 * 60 * 24 * 7; // 7 dias
export const MAX_TENTATIVAS = 5;

// Status espelham o CHECK constraint `email_primeiro_acesso_status_valido`
// na migration — ver .harness/boundaries.md (dupla camada).
export const StatusEmailPrimeiroAcesso = {
  PENDENTE: "pendente",
  ENVIADO: "enviado",
  FALHOU: "falhou",
} as const;

// Backoff exponencial em minutos: 1, 2, 4, 8, ... com teto de 2^8 = 256 min.
function backoffMs(tentativas: number): number {
  return 2 ** Math.min(tentativas, 8) * 60_000;
}

// Garante que o e-mail de primeiro acesso do usuário esteja pendente de envio
// e tenta enviar uma vez. Nunca lança em falha de envio — a falha vira estado
// no banco (status/tentativas/ultimoErro) pra um dreno reenviar depois
// (TD-0010). Idempotente por usuário: compra repetida reativa o envio se o
// comprador ainda não definiu senha.
export async function garantirEmailPrimeiroAcesso(usuarioId: string): Promise<void> {
  await prisma.emailPrimeiroAcesso.upsert({
    where: { usuarioId },
    update: { status: StatusEmailPrimeiroAcesso.PENDENTE, ultimoErro: null },
    create: { usuarioId },
  });

  await tentarEnviarUmaVez(usuarioId);
}

// Dreno: reenvia os registros 'pendente' cuja proximaTentativaEm já passou.
// Chamado pelo cron (/api/cron/reenviar-emails) e pelo próprio webhook da
// Kiwify (self-healing — cron não roda no plano gratuito da Vercel).
export async function reenviarEmailsPendentes(limite = 50): Promise<number> {
  const pendentes = await prisma.emailPrimeiroAcesso.findMany({
    where: {
      status: StatusEmailPrimeiroAcesso.PENDENTE,
      proximaTentativaEm: { lte: new Date() },
    },
    take: limite,
  });

  for (const registro of pendentes) {
    await tentarEnviarUmaVez(registro.usuarioId);
  }

  return pendentes.length;
}

async function tentarEnviarUmaVez(usuarioId: string): Promise<void> {
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    select: { email: true },
  });
  if (!usuario) return;

  try {
    const token = criarToken(usuarioId, "primeiro_acesso", DURACAO_PRIMEIRO_ACESSO_MS);
    const url = `${process.env.APP_URL}/primeiro-acesso?token=${token}`;
    await enviarEmail({
      para: usuario.email,
      assunto: "Seu acesso ao Enemza está liberado",
      html: `<p>Sua compra foi aprovada! Defina sua senha pra acessar o Enemza:</p><p><a href="${url}">${url}</a></p>`,
    });

    await prisma.emailPrimeiroAcesso.update({
      where: { usuarioId },
      data: { status: StatusEmailPrimeiroAcesso.ENVIADO },
    });
  } catch (erro) {
    const registro = await prisma.emailPrimeiroAcesso.findUnique({ where: { usuarioId } });
    const tentativas = (registro?.tentativas ?? 0) + 1;
    const estourouTeto = tentativas >= MAX_TENTATIVAS;

    await prisma.emailPrimeiroAcesso.update({
      where: { usuarioId },
      data: {
        status: estourouTeto ? StatusEmailPrimeiroAcesso.FALHOU : StatusEmailPrimeiroAcesso.PENDENTE,
        tentativas,
        ultimoErro: erro instanceof Error ? erro.message : String(erro),
        proximaTentativaEm: estourouTeto
          ? new Date()
          : new Date(Date.now() + backoffMs(tentativas)),
      },
    });
  }
}
