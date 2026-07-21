import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { criarToken } from "@/lib/token";
import { enviarEmail } from "@/lib/email";

const DURACAO_PRIMEIRO_ACESSO_MS = 1000 * 60 * 60 * 24 * 7; // 7 dias

// Payload sem schema oficial documentado pela Kiwify — ver ADR-002.
const PayloadKiwifySchema = z.object({
  Customer: z.object({
    full_name: z.string().trim().min(1),
    email: z.string().trim().toLowerCase().email(),
  }),
});

// A filtragem por evento ("compra aprovada") é feita no próprio painel da
// Kiwify ao criar o webhook — este endpoint não tenta re-validar o status do
// pedido, já que a Kiwify não documenta os valores possíveis desse campo.
export async function processarCompraAprovada(payloadBruto: unknown): Promise<void> {
  const { Customer } = PayloadKiwifySchema.parse(payloadBruto);

  const existente = await prisma.usuario.findUnique({
    where: { email: Customer.email },
    select: { id: true, senhaHash: true },
  });

  if (existente) {
    if (existente.senhaHash === null) {
      await enviarEmailPrimeiroAcesso(existente.id, Customer.email);
    }
    return;
  }

  const usuario = await prisma.usuario.create({
    data: { nome: Customer.full_name, email: Customer.email, senhaHash: null },
    select: { id: true },
  });

  await enviarEmailPrimeiroAcesso(usuario.id, Customer.email);
}

async function enviarEmailPrimeiroAcesso(usuarioId: string, email: string): Promise<void> {
  const token = criarToken(usuarioId, "primeiro_acesso", DURACAO_PRIMEIRO_ACESSO_MS);
  const url = `${process.env.APP_URL}/primeiro-acesso?token=${token}`;

  await enviarEmail({
    para: email,
    assunto: "Seu acesso ao Enemza está liberado",
    html: `<p>Sua compra foi aprovada! Defina sua senha pra acessar o Enemza:</p><p><a href="${url}">${url}</a></p>`,
  });
}
