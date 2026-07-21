-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "xpTotal" INTEGER NOT NULL DEFAULT 0,
    "nivel" INTEGER NOT NULL DEFAULT 1,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Modulo" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "corHex" TEXT NOT NULL,

    CONSTRAINT "Modulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aula" (
    "id" TEXT NOT NULL,
    "moduloId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "youtubeUrl" TEXT NOT NULL,
    "canalOrigem" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "xpRecompensa" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "Aula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressoAula" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "aulaId" TEXT NOT NULL,
    "concluida" BOOLEAN NOT NULL DEFAULT false,
    "concluidaEm" TIMESTAMP(3),

    CONSTRAINT "ProgressoAula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "XpMateria" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "moduloId" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "XpMateria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nota" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "moduloId" TEXT,
    "aulaId" TEXT,
    "conteudo" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prova" (
    "id" TEXT NOT NULL,
    "moduloId" TEXT NOT NULL,

    CONSTRAINT "Prova_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Questao" (
    "id" TEXT NOT NULL,
    "provaId" TEXT NOT NULL,
    "fonte" TEXT NOT NULL,
    "enunciado" TEXT NOT NULL,
    "alternativas" JSONB NOT NULL,
    "gabarito" TEXT NOT NULL,
    "validadaDouble" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Questao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Aula_moduloId_idx" ON "Aula"("moduloId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgressoAula_usuarioId_aulaId_key" ON "ProgressoAula"("usuarioId", "aulaId");

-- CreateIndex
CREATE UNIQUE INDEX "XpMateria_usuarioId_moduloId_key" ON "XpMateria"("usuarioId", "moduloId");

-- CreateIndex
CREATE INDEX "Nota_usuarioId_idx" ON "Nota"("usuarioId");

-- CreateIndex
CREATE INDEX "Nota_moduloId_idx" ON "Nota"("moduloId");

-- CreateIndex
CREATE INDEX "Nota_aulaId_idx" ON "Nota"("aulaId");

-- CreateIndex
CREATE INDEX "Questao_provaId_idx" ON "Questao"("provaId");

-- AddForeignKey
ALTER TABLE "Aula" ADD CONSTRAINT "Aula_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "Modulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressoAula" ADD CONSTRAINT "ProgressoAula_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressoAula" ADD CONSTRAINT "ProgressoAula_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "Aula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XpMateria" ADD CONSTRAINT "XpMateria_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XpMateria" ADD CONSTRAINT "XpMateria_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "Modulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "Modulo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "Aula"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questao" ADD CONSTRAINT "Questao_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "Prova"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Rede de segurança no banco para a regra de negócio da Nota (não expressável no
-- schema do Prisma): exatamente um de moduloId/aulaId preenchido, nunca os dois,
-- nunca nenhum. Validado também via Zod na camada de aplicação — ver
-- .harness/boundaries.md. Nunca remover esta constraint achando que a validação
-- de aplicação basta.
ALTER TABLE "Nota"
ADD CONSTRAINT "nota_referencia_exclusiva"
CHECK (
  ("moduloId" IS NOT NULL AND "aulaId" IS NULL) OR
  ("moduloId" IS NULL AND "aulaId" IS NOT NULL)
);

