'use client'
import diffForHuman from "@/common/hooks/diffForHuman";
import { BorrowProps } from "@/server/schema";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useEffect } from "react";
import worldtrigger from "world-trigger";

interface RecentBorrowedProps {

}

const RecentBorrowed: React.FunctionComponent<RecentBorrowedProps> = (props) => {

    const query = useQuery({
        queryKey: ['borrows'],
        queryFn: async () => {
            const response = await fetch(`/api/borrow`)
            const json = await response.json()
            return {
                items: json.data.items as BorrowProps[]
            }
        }
    })

    useEffect(() => {
        const handleDispatch = () => {
            query.refetch()
        }

        worldtrigger.addTrigger('recent.borrowed', handleDispatch)

        return () => worldtrigger.removeTrigger('recent.borrowed', handleDispatch)
    }, [])

    const data = query.data?.items || []

    return (
        <div className="bg-gray-50 pr-4 sm:pr-6 lg:pr-8 lg:flex-shrink-0 lg:border-l lg:border-gray-200 xl:pr-0 hidden lg:block">
            <div className="lg:w-80">
                <div className="pt-6 px-6 pb-2">
                    <h2 className="text-sm font-semibold">Recently Borrowed</h2>
                </div>
                <div>
                    <ul role="list" className="divide-y divide-gray-200 px-6">
                        {data.length > 0 ? (
                            data.map((item) => (
                                <li className="py-4" key={item.id}>
                                    <Link href={`/book-summary/${item.book_id}`}>
                                        <div className="flex space-x-3">
                                            <div className="flex-1">
                                                <h3 className="text-sm font-medium text-ellipsis overflow-hidden whitespace-pre w-60" title={item.book.title}>{item.book.title}</h3>
                                                <p className="mb-2 text-xs text-gray-500 text-ellipsis overflow-hidden whitespace-pre w-60" title={item.book.author}>
                                                    {item.book.author}
                                                </p>
                                                <small className="text-xs text-gray-500">{diffForHuman(item.borrowed_date_time)}</small>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))
                        ) : query.isFetching  ? (
                            new Array(4).fill(0).map((_, index) => (
                                <li className="py-4" key={index}>
                                    <div className="animate-pulse flex space-x-3">
                                        <div className="flex-1">
                                            <div className="bg-slate-200 h-5 w-60 mb-2 rounded"/>
                                            <div className="bg-slate-200 h-4 w-60 mb-4 rounded"/>
                                            <div className="bg-slate-200 h-3 w-24 mb-1 rounded"/>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="py-4">No borrowed books</li>
                        )}

                    </ul>
                </div>
            </div>
        </div>
    )
}

export default RecentBorrowed