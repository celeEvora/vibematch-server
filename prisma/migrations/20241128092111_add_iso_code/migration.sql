/*
  Warnings:

  - Added the required column `iso2Code` to the `Country` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Country" ADD COLUMN     "iso2Code" TEXT NOT NULL;
