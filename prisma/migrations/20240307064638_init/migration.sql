/*
  Warnings:

  - Added the required column `userId` to the `reviewComment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reviewComment" ADD COLUMN     "useFlag" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "reviewComment" ADD CONSTRAINT "reviewComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
