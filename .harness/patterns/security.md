# Padrão — Segurança (Enemza)

## LGPD — dados pessoais

`Usuario.nome` e `Usuario.email` são dados pessoais sob LGPD. Desde o MVP:

- **Minimização**: não coletar campo pessoal que não tenha uso direto no
  produto (ex: não adicionar telefone, CPF, endereço sem necessidade real).
- **Não logar em plaintext**: nome/email nunca em `console.log`, logs de
  erro ou métricas (ver `patterns/logging.md`).
- **Exclusão de conta**: desenhar o schema/API já pensando em suportar
  exclusão (cascade ou anonimização de `Usuario` e suas relações — `Nota`,
  `ProgressoAula`, `XpMateria`).
- **Acesso mínimo necessário**: endpoints só retornam nome/email quando a
  tela realmente precisa (ex: tela de Perfil do próprio usuário — nunca
  expor email de outro usuário em nenhuma resposta de API).

## Validação de entrada

- Toda entrada de API validada com **Zod** na camada de aplicação, mesmo
  quando já existe constraint equivalente no banco (ex: exclusividade de
  `Nota` — ver `boundaries.md`). Zod dá erro amigável antes de bater no
  banco; a constraint SQL é a rede de segurança final.
- Nunca confiar em validação client-side como única barreira.

## Autenticação e autorização

- Todo endpoint que lê/escreve dado de um `Usuario` (progresso, notas, XP)
  deve validar que o usuário autenticado é o dono do recurso — não existe
  cenário no domínio onde um usuário acessa dado de outro (não há
  ranking nem perfil público).
- Rotas do pipeline de conteúdo (categorização de vídeo, geração de
  questões) não são endpoints públicos — são jobs/scripts de administração
  rodados em lote, nunca expostos a usuário final autenticado comum.

## Segredos e chaves de API

- Chave da API do Gemini e connection string do Neon vivem em variáveis
  de ambiente da Vercel, nunca commitadas ou hardcoded.
- Nenhuma chamada ao Gemini deve ser feita a partir do client (browser) —
  sempre via server-side (route handler / server action), para não expor
  a chave.

## Superfície do YouTube embed

- Embed via iframe/YouTube IFrame API não deve tentar burlar restrições
  da plataforma (ex: extrair áudio/vídeo do player, bloquear anúncios do
  YouTube). Isso violaria ToS e é boundary do produto, não só de
  segurança técnica.
