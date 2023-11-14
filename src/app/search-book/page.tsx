'use client'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import type { AddBookPayloadType } from '../api/book/route'
import { useSearch } from '@/common/store/globalStore'
import BookThumbnail from '@/components/BookThumbnail'
import worldtrigger from 'world-trigger'
import { toast } from '@/components/Toaster'
import { confirmDialog } from '@/components/Modal/Confirm'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { slideOverDialog } from '@/components/Modal/SlideOver'
import FormManager from '@/components/FormManager'

type GoogleBookType = {
    id: string;
    volumeInfo: {
        publishedDate: string;
        authors: string[];
        title: string;
        imageLinks: {
            thumbnail: string;
        }
    }
}

export default function SearchBook() {
    const [search] = useSearch()

    const query = useQuery({
        queryKey: ['google-books'],
        queryFn: async () => {
            const fetchGoogleBook = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${search || 'a'}&maxResults=24&key=${process.env.NEXT_PUBLIC_GOOGLE_API}`)
            const { items, totalItems, error } = await fetchGoogleBook.json()

            if (error) {
                return {
                    error
                }
            }

            return {
                items: items as GoogleBookType[],
                totalItems
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

    const mutation = useMutation({
        mutationFn: async (payload: AddBookPayloadType) => {
            const addbook = await fetch(`/api/book`, {
                method: 'POST',
                body: JSON.stringify(payload)
            })

            return await addbook.json()
        },

    })

    const handleAddBook = (item: GoogleBookType): React.MouseEventHandler<HTMLButtonElement> => (event) => {
        event.preventDefault()
        slideOverDialog({
            key: 'add-book',
            title: 'Add Book to My Library',
            subtitle: 'Fill in the information below.',
            body: (
                <>
                    <div className="aspect-w-4 aspect-h-3 rounded-lg bg-gray-100 overflow-hidden m-5">
                        <img src={item?.volumeInfo.imageLinks.thumbnail} className="w-full h-48 object-scale-down" />
                    </div>
                    <div className="space-y-1 px-4 mb-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6">
                        <div>
                            <label
                                className="block text-sm text-gray-900 "
                            >
                                Title
                            </label>
                        </div>
                        <div className="text-sm sm:col-span-2">
                            {item?.volumeInfo.title}
                        </div>
                    </div>
                    <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6">
                        <div>
                            <label
                                className="block text-sm text-gray-900 "
                            >
                                Author
                            </label>
                        </div>
                        <div className="text-sm sm:col-span-2">
                            {item?.volumeInfo.authors?.[0]} ({item.volumeInfo.publishedDate?.slice(0, 4)})
                        </div>
                    </div>
                    <FormManager.ComboBox
                        type="radio"
                        name="bookTypeID"
                        label="Book Type"
                        value={1}
                        options={[
                            {
                                label: 'Free to hire',
                                value: 1
                            },
                            {
                                label: 'Fee Charge',
                                value: 2
                            }
                        ]}
                    />
                </>
            ),
            onSubmit(event) {
                const FORM_DATA = event.json();
                const randKey = crypto.randomUUID()
                toast({
                    key: randKey,
                    title: 'Loading...',
                    message: 'Please wait'
                })
                mutation.mutate({
                    title: item.volumeInfo.title,
                    author: item.volumeInfo.authors?.[0] || 'N/A',
                    year: parseInt(item.volumeInfo.publishedDate?.slice(0, 4)),
                    book_type_id: FORM_DATA.bookTypeID,
                    thumbnail: item.volumeInfo.imageLinks?.thumbnail || '/images/default-image.png',
                    google_book_ref: item.id
                },
                {
                    onSuccess: (response: any) => {
                        if(response.data.success === true) {
                            toast({
                                key: randKey,
                                title: 'Success',
                                message: response.data?.message
                            })
                            event.close()
                            query.refetch()
                            worldtrigger.dispatchTrigger('recent.borrowed')
                        } else {
                            toast({
                                key: randKey,
                                title: 'Failed',
                                variant: 'danger',
                                message: response.data?.message
                            })
                            event.removeLoader()
                            event.setErrors(response.data.errors.map((error: any) => error.message))
                        }
                    },
                    onError: (response: any) => {
                        toast({
                            key: randKey,
                            title: 'Error',
                            message: response.data?.message
                        })
                        event.removeLoader()
                    }
                })
            },
        })

    }

    if (query.isError || query.data?.error) {
        return (
            <div>{query.error?.message || query.data?.error.message}</div>
        )
    }

    return (
        <div className="bg-white lg:min-w-0 lg:flex-1">
            <div className="pl-4 pr-6 pt-4 pb-4 border-b border-t border-gray-200 sm:pl-6 lg:pl-8 xl:pl-6 xl:pt-6 xl:border-t-0">
                <div className="flex items-center">
                    <h1 className="flex-1 text-md font-medium">Add Book to My Library</h1>
                </div>
            </div>
            <div className="pl-4 pr-6 pt-4 pb-4  border-gray-200 sm:pl-6 lg:pl-8 xl:pl-6 xl:pt-6 xl:border-t-0">
                {(Array.isArray(query.data?.items) && query.data?.items.length > 0) ? (
                    <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
                        {query.data?.items?.map((item) => {
                            return (

                                <BookThumbnail
                                    key={item.id}
                                    title={item.volumeInfo.title}
                                    author={item.volumeInfo.authors?.[0]}
                                    year={item.volumeInfo.publishedDate ? parseInt(item.volumeInfo.publishedDate?.slice(0, 4)) : undefined}
                                    image={item.volumeInfo.imageLinks?.thumbnail || '/images/default-image.png'}
                                >
                                    <div className="absolute top-24 w-full h-full flex flex-col items-center opacity-0 p-4 group-hover:opacity-100 z-10" aria-hidden="true">
                                        <button
                                            type="button"
                                            className="w-full bg-blue-200 bg-opacity-75 backdrop-filter backdrop-blur mb-2 py-2 px-4 rounded-md text-xs font-medium text-blue-700 text-center"
                                            onClick={handleAddBook(item)}
                                        >
                                            Add to My Library
                                        </button>
                                        {/* <button
                                            type="button"
                                            className="w-full bg-green-200 bg-opacity-75 backdrop-filter backdrop-blur mb-2 py-2 px-4 rounded-md text-xs font-medium text-green-700 text-center"
                                            onClick={handleAddBook(item, false)}
                                        >
                                            Add as Free
                                        </button>
                                        <button
                                            type="button"
                                            className="w-full bg-purple-200 bg-opacity-75 backdrop-filter backdrop-blur py-2 px-4 rounded-md text-xs font-medium text-purple-700 text-center"
                                            onClick={handleAddBook(item, true)}
                                        >
                                            Add as Charged
                                        </button> */}
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


