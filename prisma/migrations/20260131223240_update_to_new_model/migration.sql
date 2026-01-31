/*
  Warnings:

  - You are about to drop the column `clientId` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Pet` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Vaccination` table. All the data in the column will be lost.
  - You are about to drop the column `petId` on the `Vaccination` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Vaccination` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Vaccination` table. All the data in the column will be lost.
  - You are about to drop the column `vaccineId` on the `Vaccination` table. All the data in the column will be lost.
  - You are about to drop the `Reminder` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vaccine` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[recordId]` on the table `Pet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[clientId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `recordId` to the `Pet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medicationId` to the `Vaccination` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recordId` to the `Vaccination` table without a default value. This is not possible if the table is not empty.
  - Made the column `appliedAt` on table `Vaccination` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "RecordType" AS ENUM ('PET', 'GROUP');

-- CreateEnum
CREATE TYPE "MedicationCategory" AS ENUM ('VACCINE', 'ANTIBIOTIC', 'OTHER');

-- CreateEnum
CREATE TYPE "InventoryCategory" AS ENUM ('MEDICATION', 'MATERIAL');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'CLIENT';

-- DropForeignKey
ALTER TABLE "Pet" DROP CONSTRAINT "Pet_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Reminder" DROP CONSTRAINT "Reminder_vaccinationId_fkey";

-- DropForeignKey
ALTER TABLE "Vaccination" DROP CONSTRAINT "Vaccination_petId_fkey";

-- DropForeignKey
ALTER TABLE "Vaccination" DROP CONSTRAINT "Vaccination_vaccineId_fkey";

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "address" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Pet" DROP COLUMN "clientId",
DROP COLUMN "isActive",
DROP COLUMN "name",
ADD COLUMN     "recordId" TEXT NOT NULL,
ALTER COLUMN "sex" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clientId" TEXT;

-- AlterTable
ALTER TABLE "Vaccination" DROP COLUMN "isActive",
DROP COLUMN "petId",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
DROP COLUMN "vaccineId",
ADD COLUMN     "consultationId" TEXT,
ADD COLUMN     "medicationId" TEXT NOT NULL,
ADD COLUMN     "recordId" TEXT NOT NULL,
ALTER COLUMN "appliedAt" SET NOT NULL;

-- DropTable
DROP TABLE "Reminder";

-- DropTable
DROP TABLE "Vaccine";

-- DropEnum
DROP TYPE "VaccinationStatus";

-- CreateTable
CREATE TABLE "MedicalRecord" (
    "id" TEXT NOT NULL,
    "type" "RecordType" NOT NULL,
    "name" TEXT NOT NULL,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "clientId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimalGroup" (
    "id" TEXT NOT NULL,
    "animalType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "notes" TEXT,
    "recordId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AnimalGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consultation" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "reason" TEXT,
    "diagnosis" TEXT,
    "treatment" TEXT,
    "notes" TEXT,
    "recordId" TEXT NOT NULL,
    "veterinarianId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Consultation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medication" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "MedicationCategory" NOT NULL,
    "species" "Species",
    "defaultIntervalDays" INTEGER,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "InventoryCategory" NOT NULL,
    "unit" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "expirationDate" TIMESTAMP(3),
    "medicationId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnimalGroup_recordId_key" ON "AnimalGroup"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "Pet_recordId_key" ON "Pet"("recordId");

-- CreateIndex
CREATE UNIQUE INDEX "User_clientId_key" ON "User"("clientId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalRecord" ADD CONSTRAINT "MedicalRecord_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pet" ADD CONSTRAINT "Pet_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "MedicalRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimalGroup" ADD CONSTRAINT "AnimalGroup_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "MedicalRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "MedicalRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consultation" ADD CONSTRAINT "Consultation_veterinarianId_fkey" FOREIGN KEY ("veterinarianId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "MedicalRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vaccination" ADD CONSTRAINT "Vaccination_consultationId_fkey" FOREIGN KEY ("consultationId") REFERENCES "Consultation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_medicationId_fkey" FOREIGN KEY ("medicationId") REFERENCES "Medication"("id") ON DELETE SET NULL ON UPDATE CASCADE;
