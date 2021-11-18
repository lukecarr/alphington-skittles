/*
  Warnings:

  - You are about to drop the column `gameId` on the `Score` table. All the data in the column will be lost.
  - You are about to drop the column `playerId` on the `Score` table. All the data in the column will be lost.
  - Added the required column `gamePlayerId` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Score` DROP COLUMN `gameId`,
    DROP COLUMN `playerId`,
    ADD COLUMN `gamePlayerId` INTEGER UNSIGNED NOT NULL;

-- CreateTable
CREATE TABLE `GamePlayer` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `position` TINYINT UNSIGNED NOT NULL,
    `playerId` SMALLINT UNSIGNED NOT NULL,
    `gameId` SMALLINT UNSIGNED NOT NULL,

    UNIQUE INDEX `GamePlayer_playerId_gameId_key`(`playerId`, `gameId`),
    UNIQUE INDEX `GamePlayer_gameId_position_key`(`gameId`, `position`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
