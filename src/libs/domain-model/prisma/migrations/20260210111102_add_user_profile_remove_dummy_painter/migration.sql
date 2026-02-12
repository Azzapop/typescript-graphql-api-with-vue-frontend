/*
  Warnings:

  - You are about to drop the `Painter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PainterTechnique` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Painting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Technique` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PainterTechnique" DROP CONSTRAINT "PainterTechnique_painterId_fkey";

-- DropForeignKey
ALTER TABLE "PainterTechnique" DROP CONSTRAINT "PainterTechnique_techniqueId_fkey";

-- DropForeignKey
ALTER TABLE "Painting" DROP CONSTRAINT "Painting_painterId_fkey";

-- DropForeignKey
ALTER TABLE "Painting" DROP CONSTRAINT "Painting_techniqueId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT NOT NULL;

-- DropTable
DROP TABLE "Painter";

-- DropTable
DROP TABLE "PainterTechnique";

-- DropTable
DROP TABLE "Painting";

-- DropTable
DROP TABLE "Technique";

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
