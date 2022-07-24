-- CreateTable
CREATE TABLE "Trip" (
    "id" UUID NOT NULL,
    "start_address" TEXT NOT NULL,
    "destination_address" TEXT NOT NULL,
    "distance" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "day_aggregation" INTEGER NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);
