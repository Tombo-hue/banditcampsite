-- CreateTable
CREATE TABLE "UniqueVisitor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "visitorId" TEXT NOT NULL,
    "weekStart" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "UniqueVisitor_visitorId_weekStart_key" ON "UniqueVisitor"("visitorId", "weekStart");
