/*
  Warnings:

  - You are about to drop the column `spare` on the `Score` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `GamePlayer_gameId_position_key` ON `GamePlayer`;

-- DropIndex
DROP INDEX `GamePlayer_playerId_gameId_key` ON `GamePlayer`;

-- AlterTable
ALTER TABLE `Score` DROP COLUMN `spare`;
