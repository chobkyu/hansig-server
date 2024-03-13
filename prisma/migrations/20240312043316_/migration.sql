-- CreateTable
CREATE TABLE "enrollHansic" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "addr" VARCHAR(500),
    "location_id" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "enrollHansic_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "enrollHansic" ADD CONSTRAINT "enrollHansic_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollHansic" ADD CONSTRAINT "enrollHansic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
