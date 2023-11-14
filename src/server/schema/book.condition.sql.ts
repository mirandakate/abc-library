import { InferSelectModel } from "drizzle-orm";
import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";
 
export const bookCondition= sqliteTable("book_condition", {
    id: int("id").primaryKey(),
    description: text("description").notNull(),
})

// INSERT INTO `book_condition` (`description`) 
// VALUES ('Damaged'),
// ('Undamaged');

export type BookConditionProps = InferSelectModel<typeof bookCondition>