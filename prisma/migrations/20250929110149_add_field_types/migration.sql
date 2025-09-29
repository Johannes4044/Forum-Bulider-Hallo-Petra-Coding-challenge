-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."FieldType" ADD VALUE 'EMAIL';
ALTER TYPE "public"."FieldType" ADD VALUE 'NUMBER';
ALTER TYPE "public"."FieldType" ADD VALUE 'DATE';
ALTER TYPE "public"."FieldType" ADD VALUE 'TEXTAREA';
ALTER TYPE "public"."FieldType" ADD VALUE 'RADIO';
ALTER TYPE "public"."FieldType" ADD VALUE 'CHECKBOX';

-- AlterTable
ALTER TABLE "public"."form_fields" ADD COLUMN     "max" INTEGER,
ADD COLUMN     "min" INTEGER,
ADD COLUMN     "placeholder" TEXT;
