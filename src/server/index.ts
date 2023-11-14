import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"
import * as schema from "./schema"
import path from "path"

const sqliteConnection = new Database(path.resolve(process.cwd(), "./sqlite.data"))

export const db = drizzle(sqliteConnection, { schema })