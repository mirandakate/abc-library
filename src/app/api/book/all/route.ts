import { db } from "@/server"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q')

    try {
        const manyBooks = await db.query.book.findMany({
            with: {
                condition: true,
                type: true,
                borrows: {
                    where(fields, {eq}) {
                        return eq(fields.borrow_status_id, 1)
                    },
                }
            },
            orderBy: (fields, {asc}) => {
                return asc(fields.title)
            },
            where: (fields, {like, or, and, eq}) => {
                return q ? and(eq(fields.is_archived, false), or(like(fields.title, `%${q}%`), like(fields.author, `%${q}%`))) : eq(fields.is_archived, false)
            }
        })
    
        return Response.json({
            data: {
                items: manyBooks
            },
        })
    } catch (error: any) {
        return new Response(error.message, {
            status: 200
        })
    }
}