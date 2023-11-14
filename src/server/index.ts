import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"
import * as schema from "./schema"

const sqliteConnection = new Database("sqlite.db")

export const db = drizzle(sqliteConnection, { schema })