import { describe, expect, it } from "vitest";

import { criarToken, verificarToken } from "./token";

const AGORA = 1_700_000_000_000;

describe("token assinado", () => {
  it("cria e verifica um token válido", () => {
    const token = criarToken("usuario-1", "sessao", 1000 * 60, AGORA);

    expect(verificarToken(token, "sessao", AGORA + 1000)).toEqual({ usuarioId: "usuario-1" });
  });

  it("rejeita token expirado", () => {
    const token = criarToken("usuario-1", "sessao", 1000 * 60, AGORA);

    expect(verificarToken(token, "sessao", AGORA + 1000 * 61)).toBeNull();
  });

  it("aceita no instante exato de expiração", () => {
    const token = criarToken("usuario-1", "sessao", 1000 * 60, AGORA);

    expect(verificarToken(token, "sessao", AGORA + 1000 * 60)).toEqual({ usuarioId: "usuario-1" });
  });

  it("rejeita token de um tipo diferente do esperado", () => {
    const token = criarToken("usuario-1", "primeiro_acesso", 1000 * 60, AGORA);

    expect(verificarToken(token, "sessao", AGORA)).toBeNull();
  });

  it("rejeita token com assinatura adulterada", () => {
    const token = criarToken("usuario-1", "sessao", 1000 * 60, AGORA);
    const [payload] = token.split(".");
    const adulterado = `${payload}.${"0".repeat(64)}`;

    expect(verificarToken(adulterado, "sessao", AGORA)).toBeNull();
  });

  it("rejeita token com payload adulterado (assinatura não bate mais)", () => {
    const tokenDeOutroUsuario = criarToken("usuario-2", "sessao", 1000 * 60, AGORA);
    const [, assinaturaDeOutroUsuario] = tokenDeOutroUsuario.split(".");

    const payloadForjado = Buffer.from(
      JSON.stringify({ usuarioId: "usuario-1", tipo: "sessao", expiraEm: AGORA + 1000 * 60 }),
    ).toString("base64url");
    const tokenForjado = `${payloadForjado}.${assinaturaDeOutroUsuario}`;

    expect(verificarToken(tokenForjado, "sessao", AGORA)).toBeNull();
  });

  it("rejeita token malformado", () => {
    expect(verificarToken("token-sem-ponto", "sessao")).toBeNull();
    expect(verificarToken("", "sessao")).toBeNull();
  });
});
