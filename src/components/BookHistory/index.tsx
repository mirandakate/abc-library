import React from "react";
import { BorrowProps } from "@/server/schema";
import { BookOpenIcon, CheckIcon} from '@heroicons/react/solid'
import classNames from "classnames";

interface BookHistoryProps {
    histories: BorrowProps[];
}

const BookHistory: React.FunctionComponent<BookHistoryProps> = ({histories}) => {
    return (
        <div className="flow-root">
            <ul role="list" className="-mb-8">
                {histories.map((history, index) => (
                    <>
                        {history.returned_date && (
                             <li key={history.id}>
                                <div className="relative pb-8">
                                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                    <div className="relative flex space-x-3">
                                        <div>
                                            <span
                                                className={classNames('h-8 w-8 rounded-full flex items-center justify-center ring-8 bg-green-500 ring-white')}
                                            >
                                                <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                                            </span>
                                        </div>
                                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Returned by {' '}
                                                    <span className="font-medium text-gray-900">
                                                        {history.borrower_name} ({history.returned_book_condition.description})
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                                <time>{new Date(history.returned_date).toLocaleString()}</time>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )}
                        <li key={history.id}>
                            <div className="relative pb-8">
                                {index !== histories.length - 1 ? (
                                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                ) : null}
                                <div className="relative flex space-x-3">
                                    <div>
                                        <span
                                            className={classNames('h-8 w-8 rounded-full flex items-center justify-center ring-8 bg-slate-200 ring-white')}
                                        >
                                            <BookOpenIcon className="h-5 w-5 text-white" aria-hidden="true" />
                                        </span>
                                    </div>
                                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Borrowed by {' '}
                                                <span className="font-medium text-gray-900">
                                                    {history.borrower_name}
                                                </span>
                                            </p>
                                        </div>
                                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                            <time>{new Date(history.borrowed_date_time).toLocaleString()}</time>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </>
                ))}
            </ul>
        </div>

    )
}

export default BookHistory