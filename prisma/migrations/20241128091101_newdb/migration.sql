/*
  Warnings:

  - The values [other] on the enum `gender` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `cityId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `sexuality` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `City` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `countryId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orientation` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "orientation" AS ENUM ('heterosexual', 'homosexual', 'bisexual');

-- AlterEnum
BEGIN;
CREATE TYPE "gender_new" AS ENUM ('female', 'male');
ALTER TABLE "User" ALTER COLUMN "gender" TYPE "gender_new" USING ("gender"::text::"gender_new");
ALTER TYPE "gender" RENAME TO "gender_old";
ALTER TYPE "gender_new" RENAME TO "gender";
DROP TYPE "gender_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "City" DROP CONSTRAINT "City_countryId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_cityId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "cityId",
DROP COLUMN "sexuality",
ADD COLUMN     "countryId" INTEGER NOT NULL,
ADD COLUMN     "orientation" "orientation" NOT NULL;

-- DropTable
DROP TABLE "City";

-- DropEnum
DROP TYPE "sexuality";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
