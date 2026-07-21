import nodemailer from "nodemailer";

interface EnviarEmailInput {
  para: string;
  assunto: string;
  html: string;
}

// Ver ADR-002 (amendment 2026-07-21) — Gmail SMTP em vez de Resend: evita
// exigir domínio próprio verificado, usando a caixa enemzasuporte@gmail.com.
export async function enviarEmail(input: EnviarEmailInput): Promise<void> {
  const usuario = process.env.GMAIL_USUARIO;
  const senhaApp = process.env.GMAIL_SENHA_APP;
  const remetente = process.env.EMAIL_REMETENTE;
  if (!usuario || !senhaApp || !remetente) {
    throw new Error("GMAIL_USUARIO/GMAIL_SENHA_APP/EMAIL_REMETENTE não configurados.");
  }

  const transportador = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: usuario, pass: senhaApp },
  });

  await transportador.sendMail({
    from: remetente,
    to: input.para,
    subject: input.assunto,
    html: input.html,
  });
}
