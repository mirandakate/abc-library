import { InferSelectModel } from "drizzle-orm";
import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";
 
export const borrowStatus = sqliteTable("borrow_status", {
    id: int("id").primaryKey(),
    description: text("description").notNull(),
})

// INSERT INTO `borrow_status` (`description`) 
// VALUES ('Borrowed'),
// ('Returned');

export type BorrowStatusProps = InferSelectModel<typeof borrowStatus>