-- CreateEnum
CREATE TYPE "public"."FieldType" AS ENUM ('TEXT', 'SELECT');

-- CreateTable
CREATE TABLE "public"."forms" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."form_fields" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."FieldType" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "options" JSONB,

    CONSTRAINT "form_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."form_submissions" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "form_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "form_fields_formId_idx" ON "public"."form_fields"("formId");

-- CreateIndex
CREATE UNIQUE INDEX "form_fields_formId_key_key" ON "public"."form_fields"("formId", "key");

-- CreateIndex
CREATE INDEX "form_submissions_formId_idx" ON "public"."form_submissions"("formId");

-- AddForeignKey
ALTER TABLE "public"."form_fields" ADD CONSTRAINT "form_fields_formId_fkey" FOREIGN KEY ("formId") REFERENCES "public"."forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."form_submissions" ADD CONSTRAINT "form_submissions_formId_fkey" FOREIGN KEY ("formId") REFERENCES "public"."forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
