'use client'
import { useSearch } from '@/common/store/globalStore'
import BookThumbnail from '@/components/BookThumbnail'
import MainContainer from '@/components/MainContainer'
import type { BookProps } from '@/server/schema'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import worldtrigger from 'world-trigger'

export default function Home() {
    const router = useRouter()
    const [search, setSearch] = useSearch()

    const query = useQuery({
        queryKey: ['books'],
        queryFn: async () => {
            const fetchBook = await fetch(`/api/book/all?q=${search}`)
            const book = await fetchBook.json()
            return {
                items: book.data.items as BookProps[]
            }
        }
    })

    useEffect(() => {
        const handleDispatch = () => {
            query.refetch()
        }

        worldtrigger.addTrigger('search', handleDispatch)

        return () => worldtrigger.removeTrigger('search', handleDispatch)
    })

    const handleClickBook = (item: BookProps): React.MouseEventHandler<HTMLButtonElement> => (event) => {
        event.preventDefault()
        router.push(`/book-summary/${item.id}`)
    }

    if (query.isFetched && !query.data) {
        return (
            <div>{query.error?.message}</div>
        )
    }

    return (
        <div className="bg-white lg:min-w-0 lg:flex-1">
            <div className="pl-4 pr-6 pt-4 pb-4 border-b border-t border-gray-200 sm:pl-6 lg:pl-8 xl:pl-6 xl:pt-6 xl:border-t-0">
                <div className="flex items-center">
                    <h1 className="flex-1 text-md font-medium">My Library</h1>
                </div>
            </div>
            <div className="pl-4 pr-6 pt-4 pb-4  border-gray-200 sm:pl-6 lg:pl-8 xl:pl-6 xl:pt-6 xl:border-t-0">
                {(query.data?.items || []).length > 0 ? (
                    <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
                        {query.data?.items?.map((item) => {
                            return (
                                <BookThumbnail
                                    key={item.id}
                                    title={item.title}
                                    author={item.author}
                                    type={item.type.description}
                                    typeID={item.book_type_id}
                                    condition={item.condition.description}
                                    year={item.year}
                                    isBorrowed={Array.isArray(item.borrows) && item.borrows.length > 0}
                                    image={item.thumbnail}
                                    isVisited={item.is_visited}
                                >
                                    <div className="absolute top-8 w-full h-full flex items-center opacity-0 p-4 group-hover:opacity-100 z-10" aria-hidden="true">
                                        <button
                                            type="button"
                                            className="w-full bg-white bg-opacity-75 backdrop-filter backdrop-blur py-2 px-4 rounded-md text-sm font-medium text-gray-900 text-center"
                                            onClick={handleClickBook(item)}
                                        >
                                            View Book
                                        </button>
                                    </div>
                                </BookThumbnail>
                            )
                        })}
                    </div>
                ) : query.isFetching || query.isRefetching ? (
                    <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
                        {new Array(8).fill(0).map((_, index) => (
                            <div className="animate-pulse" key={index}>
                                <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100 h-40" />
                                <div className="mt-5 w-full h-2 bg-gray-200" />
                                <div className="mt-2 w-full h-2 bg-gray-200" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='text-sm'>No record to display for search "{search}"</div>
                )}
            </div>
        </div>
    )
}
