import { InferSelectModel } from "drizzle-orm";
import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";
 
export const bookType = sqliteTable("book_type", {
    id: int("id").primaryKey(),
    description: text("description").notNull(),
})

// INSERT INTO `book_type` (`description`) 
// VALUES ('Free to hire'),
// ('Fee charged');

export type BookTypeProps = InferSelectModel<typeof bookType>