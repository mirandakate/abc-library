import { InferSelectModel, relations } from "drizzle-orm";
import { sqliteTable, int, text } from "drizzle-orm/sqlite-core";
import { type BookTypeProps, bookType } from "./book.type.sql";
import { type BookConditionProps, bookCondition } from "./book.condition.sql";
import { BorrowProps, borrow } from "./borrow.sql";
 
export const book = sqliteTable("book", {
    id: int("id").primaryKey(),
    year: int("year"),
    title: text("title").notNull(),
    author: text("author").notNull(),
    thumbnail: text("thumbnail").notNull(),
    book_type_id: int("book_type_id").notNull(),
    book_condition_id: int("book_condition_id").notNull(),
    is_visited: int("is_visited", { mode: 'boolean' }).notNull(),
    is_archived: int("is_archived", { mode: 'boolean' }).default(false),
    google_book_ref: text("google_book_ref").notNull()
})

export const bookRelationships = relations(book, ({ one, many }) => ({
    type: one(bookType, {
        fields: [book.book_type_id],
        references: [bookType.id]
    }),
    condition: one(bookCondition, {
        fields: [book.book_condition_id],
        references: [bookCondition.id]
    }),
    borrows: many(borrow)
}))

export type BookProps = InferSelectModel<typeof book> & {
    type: BookTypeProps;
    condition: BookConditionProps;
    borrows: BorrowProps[];
}