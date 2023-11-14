import { db } from "@/server"
import { book, borrow } from "@/server/schema"
import { eq } from "drizzle-orm"
import { NextRequest } from "next/server"
import validozer from "validozer"

export async function GET(request: NextRequest) {
    try {
        const borrowed = await db.query.borrow.findMany({
            with: {
                book: {
                    columns: {
                        title: true,
                        author: true,
                        year: true
                    }
                }
            },
            orderBy(fields, {desc}) {
                return desc(fields.borrowed_date_time)
            },
            where: (fields, {eq}) => {
                return eq(fields.borrow_status_id, 1)
            }
        })
    
        return Response.json({
            data: {
                items: borrowed
            }
        })
    } catch (error: any) {
        return new Response(error.message, {
            status: 500
        })
    }
}

export type BorrowPayloadType = {
    book_id: number;
    borrower_name: string;
}

export async function POST(request: NextRequest) {
    const payload = await request.json() as BorrowPayloadType

    const { book_id, borrower_name } = payload

    try {

        const validation = validozer.make(payload, {
            book_id: {
                label: 'Book',
                rules: 'required|min:1'
            },
            borrower_name: {
                label: 'Borrower Name',
                rules: 'required'
            }
        })

        if(validation.fails()) {
            return Response.json({
                data: {
                    success: false,
                    message: `One of the fields has an validation error`,
                    errors: validation.errorsJSON()
                },
            })
        }

        const exists = await db.query.borrow.findFirst({
            where: (fields, {and, eq}) => {
                // borrow.book_id === book_id && borrow.borrow_status_id === 1
                return and(eq(fields.book_id, book_id), eq(fields.borrow_status_id, 1))
            }
        })

        if(exists) {
            return Response.json({
                data: {
                    success: true,
                    message: 'Already borrowed'
                },
            })
        }

        await db.insert(borrow).values({
            book_id,
            borrower_name,
            borrow_status_id: 1,
            borrowed_date_time: new Date()
        })
    
        return Response.json({
            data: {
                success: true,
                message: `Borrowed book`
            },
        })
    } catch (error: any) {
        return new Response(error.message, {
            status: 500
        })
    }
}

export type ReturnPayloadType = {
    id: number;
    returned_book_condition_id: number;
}

export async function PATCH(request: NextRequest) {
    const { id, returned_book_condition_id } = await request.json() as ReturnPayloadType

    try {

        const exists = await db.query.borrow.findFirst({
            where: (fields, {eq}) => {
                return eq(fields.id, id)
            }
        })

        if(!exists) {
            return Response.json({
                data: {
                    success: false,
                    message: 'Borrow data does not exist on your library'
                },
            })
        }

        await db.update(borrow).set({
            returned_book_condition_id,
            returned_date: new Date(),
            borrow_status_id: 2,
        }).where(eq(borrow.id, id))
        
        await db.update(book).set({
            book_condition_id: returned_book_condition_id
        }).where(eq(book.id, exists.book_id))
    
        return Response.json({
            data: {
                success: true,
                message: `Book is returned`
            },
        })
    } catch (error: any) {
        return new Response(error.message, {
            status: 500
        })
    }
}