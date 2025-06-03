/*
  Warnings:

  - You are about to drop the column `credits` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `currentParticipants` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `maxParticipants` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the `_EventToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EventToUser" DROP CONSTRAINT "_EventToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToUser" DROP CONSTRAINT "_EventToUser_B_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "credits",
DROP COLUMN "currentParticipants",
DROP COLUMN "maxParticipants";

-- AlterTable
ALTER TABLE "UserEvent" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'registered';

-- DropTable
DROP TABLE "_EventToUser";
