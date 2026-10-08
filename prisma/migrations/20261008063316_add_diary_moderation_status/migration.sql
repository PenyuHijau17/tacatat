-- CreateEnum
CREATE TYPE "DiaryModeration" AS ENUM ('none', 'blocked', 'revision');

-- AlterTable
ALTER TABLE "Diary" ADD COLUMN     "moderationStatus" "DiaryModeration" NOT NULL DEFAULT 'none';
