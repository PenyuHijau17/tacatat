/*
  Warnings:

  - You are about to drop the column `isPublic` on the `Diary` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DiaryStatus" AS ENUM ('draft', 'public', 'private');

-- AlterTable
ALTER TABLE "Diary" DROP COLUMN "isPublic",
ADD COLUMN     "status" "DiaryStatus" NOT NULL DEFAULT 'draft',
ALTER COLUMN "mood" DROP NOT NULL;
