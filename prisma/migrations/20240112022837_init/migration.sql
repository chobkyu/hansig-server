/*
  Warnings:

  - Added the required column `userGradeId` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "userGradeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "userGrade" (
    "id" SERIAL NOT NULL,
    "userGrade" VARCHAR(10),
    "description" VARCHAR(100),

    CONSTRAINT "userGrade_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_userGradeId_fkey" FOREIGN KEY ("userGradeId") REFERENCES "userGrade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
