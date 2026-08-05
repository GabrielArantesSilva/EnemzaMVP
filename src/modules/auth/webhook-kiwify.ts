import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { garantirEmailPrimeiroAcesso } from "./email-primeiro-acesso";

// Payload sem schema oficial documentado pela Kiwify — ver ADR-002.
const PayloadKiwifySchema = z.object({
  // Filtragem por evento é feita no painel da Kiwify ao criar o webhook, mas
  // revalidar aqui é a rede de segurança contra um evento errado (ex: compra
  // recusada) chegar — descartado com 2xx, nunca lança (evita retry infinito).
  webhook_event_type: z.string().optional(),
  Customer: z.object({
    full_name: z.string().trim().min(1),
    email: z.string().trim().toLowerCase().email(),
  }),
});

export const EVENTO_COMPRA_APROVADA = "compra_aprovada";

// Só "compra aprovada" gera acesso. Outros eventos são reconhecidos e
// descartados (2xx) — falha de envio de e-mail também não lança: vira estado
// no outbox pra reenviar depois (ver email-primeiro-acesso.ts e TD-0010).
export async function processarCompraAprovada(payloadBruto: unknown): Promise<void> {
  const payload = PayloadKiwifySchema.parse(payloadBruto);

  if (payload.webhook_event_type && payload.webhook_event_type !== EVENTO_COMPRA_APROVADA) {
    return;
  }

  const { Customer } = payload;

  const existente = await prisma.usuario.findUnique({
    where: { email: Customer.email },
    select: { id: true, senhaHash: true },
  });

  if (existente) {
    if (existente.senhaHash === null) {
      await garantirEmailPrimeiroAcesso(existente.id);
    }
    return;
  }

  const usuario = await prisma.usuario.create({
    data: { nome: Customer.full_name, email: Customer.email, senhaHash: null },
    select: { id: true },
  });

  await garantirEmailPrimeiroAcesso(usuario.id);
}
