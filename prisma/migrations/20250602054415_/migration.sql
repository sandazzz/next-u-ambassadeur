/*
  Warnings:

  - You are about to drop the column `isScheduled` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "isScheduled",
ALTER COLUMN "status" SET DEFAULT 'created';
