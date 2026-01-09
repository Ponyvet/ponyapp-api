-- AlterTable
ALTER TABLE "Vaccination" ALTER COLUMN "appliedAt" DROP NOT NULL,
ALTER COLUMN "nextDueDate" DROP NOT NULL;
