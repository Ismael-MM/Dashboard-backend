/*
  Warnings:

  - You are about to drop the column `Group` on the `permissions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `permissions` DROP COLUMN `Group`,
    ADD COLUMN `group` VARCHAR(191) NOT NULL DEFAULT '';
