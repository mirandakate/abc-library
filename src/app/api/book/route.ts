import { db } from "@/server"
import { book } from "@/server/schema"
import { eq } from "drizzle-orm"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')

    if(!id) {
        return new Response('[id] is not populated', {
            status: 403
        })
    }

    try {
        const firstBook = await db.query.book.findFirst({
            with: {
                condition: true,
                type: true,
                borrows: {
                    with: {
                        returned_book_condition: true
                    },
                    orderBy(fields, {desc}) {
                        return desc(fields.borrowed_date_time)
                    },
                    // where(fields, {eq}) {
                    //     return eq(fields.borrow_status_id, 1)
                    // },
                }
            },
            where: (fields, {eq}) => {
                return eq(fields.id, parseInt(id))
            }
        })

        if(!firstBook) {
            return new Response(`book for [id] = ${id} does not exists`, {
                status: 403
            })
        }

        if(firstBook.is_visited === false) {
            await db.update(book).set({is_visited: true}).where(eq(book.id, firstBook.id))
        }
    
        return Response.json({
            data: firstBook
        })
    } catch (error: any) {
        return new Response(error.message, {
            status: 500
        })
    }
}

export type AddBookPayloadType = {
    title: string;
    author: string;
    year: number;
    book_type_id: number;
    thumbnail: string;
    google_book_ref: string;
}

export async function POST(request: NextRequest) {
    const { title, author, year, book_type_id, thumbnail, google_book_ref } = await request.json() as AddBookPayloadType

    try {

        const exists = await db.query.book.findFirst({
            where: (fields, {eq}) => {
                return eq(fields.google_book_ref, google_book_ref)
            }
        })

        if(exists) {
            if(exists.is_archived) {
                await db.update(book).set({
                    is_archived: !exists.is_archived,
                    book_type_id,
                    book_condition_id: 2
                }).where(eq(book.id, exists.id))

                return Response.json({
                    data: {
                        success: true,
                        message: `Unarchived a book ${title}`
                    },
                })
            }

            return Response.json({
                data: {
                    success: true,
                    message: 'Already exist on your library'
                },
            })
        }

        await db.insert(book).values({
            title,
            author,
            year,
            google_book_ref,
            book_type_id,
            book_condition_id: 2,
            is_visited: false,
            thumbnail
        })
    
        return Response.json({
            data: {
                success: true,
                message: `Added a book ${title}`
            },
        })
    } catch (error: any) {
        return new Response(error.message, {
            status: 500
        })
    }
}

export type BookArchiveType = {
    id: number;
}

export async function PATCH(request: NextRequest) {
    const { id } = await request.json() as BookArchiveType

    try {

        const exists = await db.query.book.findFirst({
            where: (fields, {eq}) => {
                return eq(fields.id, id)
            }
        })

        if(!exists) {
            return Response.json({
                data: {
                    success: false,
                    message: 'Book does not exist on your library'
                },
            })
        }

        await db.update(book).set({
            is_archived: !exists.is_archived
        }).where(eq(book.id, id))
    
        return Response.json({
            data: {
                success: true,
                message: `${exists.is_archived ? 'Unarchived' : 'Archived'} a book ${exists.title}`
            },
        })
    } catch (error: any) {
        return new Response(error.message, {
            status: 500
        })
    }
}