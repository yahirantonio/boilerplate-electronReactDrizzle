import { app } from 'electron';
import path from 'node:path';
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { runMigrations } from './migrations';

export function createDatabase() {
  const databasePath = path.join(app.getPath('userData'), 'electro.sqlite');

  const sqlite = new Database(databasePath);

  try {
    const db = drizzle(sqlite);

    runMigrations(db);

    return { db, sqlite };
  } catch (error) {
    sqlite.close();
    throw error;
  }
}
