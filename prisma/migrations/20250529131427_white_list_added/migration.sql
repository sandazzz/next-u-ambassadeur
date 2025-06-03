-- CreateTable
CREATE TABLE "WhitelistEmail" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "WhitelistEmail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WhitelistEmail_email_key" ON "WhitelistEmail"("email");
