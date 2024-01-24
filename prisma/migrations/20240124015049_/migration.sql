-- CreateTable
CREATE TABLE "ownerData" (
    "id" SERIAL NOT NULL,
    "ownerNum" VARCHAR(100),
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "hansicsId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ownerData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ownerData_hansicsId_key" ON "ownerData"("hansicsId");

-- AddForeignKey
ALTER TABLE "ownerData" ADD CONSTRAINT "ownerData_hansicsId_fkey" FOREIGN KEY ("hansicsId") REFERENCES "hansics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ownerData" ADD CONSTRAINT "ownerData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
