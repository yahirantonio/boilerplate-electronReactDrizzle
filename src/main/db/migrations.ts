import { app } from 'electron';
import path from 'node:path';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

export function runMigrations(db: BetterSQLite3Database) {
  const migrationsFolder = app.isPackaged
    ? path.join(process.resourcesPath, 'drizzle')
    : path.join(app.getAppPath(), 'drizzle');

  migrate(db, { migrationsFolder });
}
