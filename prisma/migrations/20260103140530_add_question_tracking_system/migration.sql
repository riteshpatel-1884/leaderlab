-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "SubjectType" AS ENUM ('DSA', 'OS', 'CN', 'DBMS', 'HR', 'OOPS', 'SYSTEM_DESIGN');

-- AlterEnum
ALTER TYPE "PointSourceType" ADD VALUE 'SUBJECT_QUESTION';

-- AlterTable
ALTER TABLE "PointTransaction" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "cnPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dbmsPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dsaPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "hrPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "oopsPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "osPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "systemDesignPoints" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "SolvedQuestion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subject" "SubjectType" NOT NULL,
    "questionId" TEXT NOT NULL,
    "difficulty" "DifficultyLevel" NOT NULL,
    "pointsEarned" DOUBLE PRECISION NOT NULL,
    "solvedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SolvedQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubjectProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subject" "SubjectType" NOT NULL,
    "totalQuestions" INTEGER NOT NULL DEFAULT 0,
    "solvedQuestions" INTEGER NOT NULL DEFAULT 0,
    "totalPoints" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "easyCount" INTEGER NOT NULL DEFAULT 0,
    "mediumCount" INTEGER NOT NULL DEFAULT 0,
    "hardCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SubjectProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SolvedQuestion_subject_idx" ON "SolvedQuestion"("subject");

-- CreateIndex
CREATE INDEX "SolvedQuestion_userId_subject_idx" ON "SolvedQuestion"("userId", "subject");

-- CreateIndex
CREATE UNIQUE INDEX "SolvedQuestion_userId_subject_questionId_key" ON "SolvedQuestion"("userId", "subject", "questionId");

-- CreateIndex
CREATE INDEX "SubjectProgress_subject_idx" ON "SubjectProgress"("subject");

-- CreateIndex
CREATE UNIQUE INDEX "SubjectProgress_userId_subject_key" ON "SubjectProgress"("userId", "subject");

-- AddForeignKey
ALTER TABLE "SolvedQuestion" ADD CONSTRAINT "SolvedQuestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubjectProgress" ADD CONSTRAINT "SubjectProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
