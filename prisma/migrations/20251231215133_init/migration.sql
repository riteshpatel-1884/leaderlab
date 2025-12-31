/*
  Warnings:

  - You are about to drop the column `customRole` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_collegeName_idx";

-- DropIndex
DROP INDEX "User_experience_idx";

-- DropIndex
DROP INDEX "User_state_idx";

-- DropIndex
DROP INDEX "User_totalPoints_idx";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "customRole",
DROP COLUMN "role";
