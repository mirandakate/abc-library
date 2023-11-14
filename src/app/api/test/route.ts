import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { NextRequest } from "next/server"
import * as schema from "@/server/schema"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    try {

        const sqliteConnection = new Database("sqlite.db")
    
         const db = drizzle(sqliteConnection, { schema })

         return Response.json({
            query
        })
    } catch (error: any) {
        return Response.json({
            query: error.message
        }) 
    }

    
}