-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "facebookId" TEXT,
    "googleId" TEXT,
    "githubId" TEXT,
    "password" TEXT,
    "authTokenVersion" INTEGER NOT NULL DEFAULT 1,
    "firstName" TEXT,
    "lastName" TEXT
);
INSERT INTO "new_User" ("email", "facebookId", "firstName", "githubId", "googleId", "id", "lastName", "password") SELECT "email", "facebookId", "firstName", "githubId", "googleId", "id", "lastName", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_facebookId_key" ON "User"("facebookId");
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
CREATE UNIQUE INDEX "User_githubId_key" ON "User"("githubId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
