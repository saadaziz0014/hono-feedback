-- CreateTable
CREATE TABLE "VerifyUser" (
    "id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerifyUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerifyUser_userId_key" ON "VerifyUser"("userId");

-- AddForeignKey
ALTER TABLE "VerifyUser" ADD CONSTRAINT "VerifyUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
