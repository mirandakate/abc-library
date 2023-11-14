import { InferSelectModel, relations } from "drizzle-orm";
import { sqliteTable, int, text,  } from "drizzle-orm/sqlite-core";
import { BookProps, book } from "./book.sql";
import { borrowStatus } from "./borrow.status.sql";
import { BookConditionProps, bookCondition } from "./book.condition.sql";
 
export const borrow = sqliteTable("borrow", {
    id: int("id").primaryKey(),
    book_id: int("book_id").notNull(),
    borrower_name: text("borrower_name").notNull(),
    borrowed_date_time: int("borrowed_date_time", { mode: 'timestamp' }).notNull(),
    returned_date: int("returned_date", { mode: 'timestamp' }),
    returned_book_condition_id: int("returned_book_condition_id"),
    borrow_status_id: int("borrow_status_id").notNull(),
})

export const meetingAttendanceRelationships = relations(borrow, ({ one, many }) => ({
    book: one(book, {
        fields: [borrow.book_id],
        references: [book.id]
    }),
    status: one(borrowStatus, {
        fields: [borrow.borrow_status_id],
        references: [borrowStatus.id]
    }),
    returned_book_condition: one(bookCondition, {
        fields: [borrow.returned_book_condition_id],
        references: [bookCondition.id]
    })
}))

export type BorrowProps = InferSelectModel<typeof borrow> & {
    book: BookProps;
    returned_book_condition: BookConditionProps;
}