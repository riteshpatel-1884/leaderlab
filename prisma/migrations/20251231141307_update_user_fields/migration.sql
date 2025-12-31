/*
  Warnings:

  - You are about to drop the column `college` on the `User` table. All the data in the column will be lost.
  - The `experience` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "User_college_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "college",
ADD COLUMN     "collegeName" TEXT,
ADD COLUMN     "customRole" TEXT,
ADD COLUMN     "role" TEXT,
DROP COLUMN "experience",
ADD COLUMN     "experience" TEXT;

-- CreateIndex
CREATE INDEX "User_collegeName_idx" ON "User"("collegeName");

-- CreateIndex
CREATE INDEX "User_experience_idx" ON "User"("experience");
