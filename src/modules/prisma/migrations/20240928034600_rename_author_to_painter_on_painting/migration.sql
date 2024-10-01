/*
  Warnings:

  - You are about to drop the column `authorId` on the `Painting` table. All the data in the column will be lost.
  - Added the required column `painterId` to the `Painting` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Painting" DROP CONSTRAINT "Painting_authorId_fkey";

-- AlterTable
ALTER TABLE "Painting" DROP COLUMN "authorId",
ADD COLUMN     "painterId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Painting" ADD CONSTRAINT "Painting_painterId_fkey" FOREIGN KEY ("painterId") REFERENCES "Painter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
