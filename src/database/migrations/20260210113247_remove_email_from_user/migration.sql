/*
  Warnings:

  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "email";

-- AlterTable
ALTER TABLE "UserProfile" ALTER COLUMN "email" DROP NOT NULL;
