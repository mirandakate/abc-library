'use client'
import { BookArchiveType } from '@/app/api/book/route'
import type { BorrowPayloadType, ReturnPayloadType } from '@/app/api/borrow/route'
import BookHistory from '@/components/BookHistory'
import FormManager from '@/components/FormManager'
import { confirmDialog } from '@/components/Modal/Confirm'
import { slideOverDialog } from '@/components/Modal/SlideOver'
import { toast } from '@/components/Toaster'
import type { BookProps } from '@/server/schema'
import { ExclamationCircleIcon } from '@heroicons/react/solid'
import { useMutation, useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { useParams } from 'next/navigation'
import worldtrigger from 'world-trigger'

export default function BookSummary() {
    const { id } = useParams()

    const query = useQuery({
        queryKey: ['book'],
        queryFn: async () => {
            const response = await fetch(`${process.env.VERCEL_URL || ''}/api/book?id=${id}`)
            const json = await response.json()
            return json.data as BookProps
        }
    })

    const data = query.data

    const borrowMutation = useMutation({
        mutationFn: async (payload: BorrowPayloadType) => {
            const response = await fetch(`${process.env.VERCEL_URL || ''}/api/borrow`, {
                method: 'POST',
                body: JSON.stringify(payload)
            })

            return await response.json()
        }
    })

    const handleBorrow = () => {
        slideOverDialog({
            key: 'borrow',
            title: 'Borrow Book',
            subtitle: 'Fill in the information below.',
            body: (
                <>
                    <div className="aspect-w-4 aspect-h-3 rounded-lg bg-gray-100 overflow-hidden m-5">
                        <img src={data?.thumbnail} alt={data?.title} className="w-full h-48 object-scale-down" />
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
                            {data?.title}
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
                            {data?.author} ({data?.year})
                        </div>
                    </div>
                    <FormManager.Input
                        name="borrowerName"
                        label="Borrower Name"
                    />
                    <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6">
                        <div>
                            <label
                                className="block text-sm text-gray-900 "
                            >
                                Charge
                            </label>
                        </div>
                        <div className="text-sm sm:col-span-2">
                            {data?.book_type_id === 1 ? 'Free' : '$3'}
                        </div>
                    </div>
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
                borrowMutation.mutate({
                    book_id: parseInt(id as any),
                    borrower_name: FORM_DATA.borrowerName,
                },
                    {
                        onSuccess: (response: any) => {
                            if (response.data.success === true) {
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
                                variant: 'danger',
                                message: response.data?.message
                            })
                            event.removeLoader()
                        }
                    })
            },
        })
    }

    const returnMutation = useMutation({
        mutationFn: async (payload: ReturnPayloadType) => {
            const response = await fetch(`${process.env.VERCEL_URL || ''}/api/borrow`, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            })

            return await response.json()
        },

    })

    const handleReturn = () => {
        slideOverDialog({
            key: 'return',
            title: 'Return Book',
            subtitle: 'Fill in the information below.',
            body: (
                <>
                    <div className="aspect-w-4 aspect-h-3 rounded-lg bg-gray-100 overflow-hidden m-5">
                        <img src={data?.thumbnail} alt={data?.title} className="w-full h-48 object-scale-down" />
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
                            {data?.title}
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
                            {data?.author} ({data?.year})
                        </div>
                    </div>
                    <FormManager.ComboBox
                        type="radio"
                        name="returnBookConditionID"
                        label="Book Condition"
                        value={data?.book_condition_id}
                        disabled={data?.book_condition_id === 1}
                        options={[
                            {
                                label: 'Damaged',
                                value: 1
                            },
                            {
                                label: 'Undamage',
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
                returnMutation.mutate({
                    id: data?.borrows[0]?.id || 0,
                    returned_book_condition_id: FORM_DATA.returnBookConditionID,
                },
                    {
                        onSuccess: (response: any) => {
                            if (response.data.success === true) {
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
                                variant: 'danger',
                                message: response.data?.message
                            })
                            event.removeLoader()
                        }
                    })
            },
        })
    }

    const archiveMutation = useMutation({
        mutationFn: async (payload: BookArchiveType) => {
            const response = await fetch(`${process.env.VERCEL_URL || ''}/api/book`, {
                method: 'PATCH',
                body: JSON.stringify(payload)
            })

            return await response.json()
        },

    })

    const handleArchived: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault()
        const isArchived = data?.is_archived
        confirmDialog({
            key: 'archive-book',
            title: isArchived ? 'Unarchive' : 'Archive',
            titleIcon: <ExclamationCircleIcon className={isArchived ? "text-green-600" : "text-red-600"} />,
            confirmVariant: isArchived ? 'success' : 'danger',
            confirmLabel: isArchived ? 'unarchive' : 'archive',
            body: (
                <p className="text-sm text-gray-700">
                    Are you sure you want to {isArchived ? 'unarchive' : 'archive'} this book to your library?
                </p>
            ),
            onConfirm: () => {
                archiveMutation.mutate({
                    id: parseInt(id as any)
                },
                    {
                        onSuccess: (response: any) => {
                            if (response.data.success) {
                                toast({
                                    title: 'Success',
                                    message: response.data?.message
                                })
                                query.refetch()
                            } else {
                                toast({
                                    title: 'Failed',
                                    message: response.data?.message
                                })
                            }
                        },
                        onError: (response: any) => {
                            toast({
                                title: 'Error',
                                message: response.data?.message
                            })
                        }
                    })
            }
        })

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
                    <h1 className="flex-1 text-md font-medium">Book Summary</h1>
                </div>
            </div>
            <div className="pl-4 pr-6 pt-4 pb-4  border-gray-200 sm:pl-6 lg:pl-8 xl:pl-6 xl:pt-6 xl:border-t-0">
                <div className="lg:grid lg:grid-rows-1 lg:grid-cols-7 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">

                    {query.isFetching ? (
                        <>
                            <div className={classNames("lg:row-end-1 lg:col-span-4", { "opacity-50": data?.is_archived })}>
                                <div className="aspect-w-4 aspect-h-3 rounded-lg bg-gray-100 overflow-hidden h-72" />
                            </div>
                            <div className="max-w-2xl mx-auto mt-14 sm:mt-16 lg:max-w-none lg:mt-0 lg:row-end-2 lg:row-span-2 lg:col-span-7 w-full">
                                <div className="flex flex-col-reverse">
                                    <div className={classNames("mt-4", { "opacity-50": data?.is_archived })}>
                                        <h1 className="text-2xl font-extrabold tracking-tight mb-6 text-gray-900 sm:text-lg"> <span className="inline-block w-60 bg-gray-100 h-4" /></h1>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Author: <span className="inline-block w-40 bg-gray-100 h-3 ml-2" />
                                        </p>
                                        <p className="text-xs text-gray-500 mb-3">
                                            Published: <span className="inline-block w-40 bg-gray-100 h-3 ml-2" />
                                        </p>
                                        <p className="text-xs text-gray-500 mb-3">
                                            Condition: <span className="inline-block w-40 bg-gray-100 h-3 ml-2" />
                                        </p>
                                        <p className="text-xs text-gray-500 mb-8">
                                            Type:
                                            <span className="inline-block w-40 bg-gray-100 h-3 ml-2" />
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Book image */}
                            <div className={classNames("lg:row-end-1 lg:col-span-4", { "opacity-50": data?.is_archived })}>
                                <div className="aspect-w-4 aspect-h-3 rounded-lg bg-gray-100 overflow-hidden">
                                    <img src={data?.thumbnail} alt={data?.title} className="w-full h-72 object-scale-down" />
                                </div>
                            </div>

                            {/* Book details */}
                            <div className="max-w-2xl mx-auto mt-14 sm:mt-16 lg:max-w-none lg:mt-0 lg:row-end-2 lg:row-span-2 lg:col-span-7 w-full">
                                <div className="flex flex-col-reverse">
                                    <div className={classNames("mt-4", { "opacity-50": data?.is_archived })}>
                                        <h1 className="text-2xl font-extrabold tracking-tight mb-6 text-gray-900 sm:text-lg">{data?.title}</h1>
                                        <p className="text-sm text-gray-600 mb-3">
                                            Author: {data?.author}
                                        </p>
                                        <p className="text-xs text-gray-500 mb-3">
                                            Published: {data?.year}
                                        </p>
                                        <p className="text-xs text-gray-500 mb-3">
                                            Condition: {data?.condition.description}
                                        </p>
                                        <p className="text-xs text-gray-500 mb-8">
                                            Type:
                                            <span className={classNames("inline-flex ml-2 items-center px-2 py-0.5  text-xs font-medium", { 'bg-green-100 text-green-800': data?.book_type_id === 1, 'bg-purple-100 text-purple-800': data?.book_type_id === 2 })}>
                                                {data?.type.description}
                                            </span>
                                        </p>
                                    </div>

                                </div>


                                {Array.isArray(data?.borrows) && query.data!.borrows.length > 0 && query.data!.borrows?.[0]?.borrow_status_id === 1 ? (
                                    <>
                                        <p className="text-xs text-gray-500 mb-3">
                                            Borrowed by: {data?.borrows?.[0]?.borrower_name}
                                        </p>
                                        <p className="text-xs text-gray-500 mb-8">
                                            Date borrowed: {data?.borrows?.[0]?.borrowed_date_time ? new Date(data?.borrows?.[0]?.borrowed_date_time).toLocaleString() : 'N/A'}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={handleReturn}
                                            className="w-full bg-blue-50 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-blue-500"
                                        >
                                            Return Book
                                        </button>
                                    </>
                                ) : data?.is_archived ? (
                                    <button
                                        type="button"
                                        onClick={handleArchived}
                                        className="w-full bg-green-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-green-500"
                                    >
                                        Unarchive
                                    </button>
                                ) : (
                                    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                                        <button
                                            type="button"
                                            onClick={handleBorrow}
                                            className="w-full bg-blue-50 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-blue-500"
                                        >
                                            Borrow
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleArchived}
                                            className="w-full bg-red-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-red-500"
                                        >
                                            Archive
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
                <h1 className='mt-8 mb-5'>Borrow History</h1>
                {(data?.borrows || []).length > 0 ? (
                    <BookHistory
                        histories={data?.borrows || []}
                    />
                ) : (
                    <div className='text-gray-400 text-sm'>No history to display</div>
                )}
            </div>
        </div>
    )
}