-- CreateTable
CREATE TABLE "favorites" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "hansicsId" INTEGER NOT NULL,
    "useFlag" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_hansicsId_fkey" FOREIGN KEY ("hansicsId") REFERENCES "hansics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
