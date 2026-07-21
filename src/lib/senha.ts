import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const TAMANHO_SALT = 16;
const TAMANHO_CHAVE = 64;

// Ver ADR-001 — scrypt via node:crypto evita dependência nova (bcrypt/argon2)
// e roda em runtime Node do Vercel sem binário nativo próprio.
export async function gerarHashSenha(senha: string): Promise<string> {
  const salt = randomBytes(TAMANHO_SALT);
  const chave = (await scrypt(senha, salt, TAMANHO_CHAVE)) as Buffer;
  return `${salt.toString("hex")}:${chave.toString("hex")}`;
}

export async function verificarSenha(senha: string, hash: string): Promise<boolean> {
  const [saltHex, chaveHex] = hash.split(":");
  if (!saltHex || !chaveHex) return false;

  const salt = Buffer.from(saltHex, "hex");
  const chaveEsperada = Buffer.from(chaveHex, "hex");
  if (salt.length !== TAMANHO_SALT || chaveEsperada.length !== TAMANHO_CHAVE) return false;

  const chaveCalculada = (await scrypt(senha, salt, TAMANHO_CHAVE)) as Buffer;
  return timingSafeEqual(chaveCalculada, chaveEsperada);
}
