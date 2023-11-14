import classNames from "classnames";
import React from "react";

interface BookThumbnailProps {
    title: string;
    author: string;
    isBorrowed?: boolean;
    type?: string;
    typeID?: number;
    condition?: string;
    image: string;
    year?: number | null;
    isVisited?: boolean;
    children: React.ReactNode
}

const BookThumbnail: React.FunctionComponent<BookThumbnailProps> = ({
    title,
    author,
    isBorrowed,
    type,
    typeID,
    condition,
    image,
    year,
    isVisited,
    children
}) => {
    return (
        <div className={classNames("relative group")}>
            <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100">
                <span className={classNames("absolute right-0 top-0 z-10 inline-flex items-center px-2 py-0.5 text-xs font-medium", { 'bg-green-100 text-green-800': typeID === 1, 'bg-purple-100 text-purple-800': typeID === 2, 'bg-red-100 text-red-800': isBorrowed })}>
                    {isBorrowed ? 'Borrowed' : type}
                </span>
                <img src={image} alt={title} className={classNames("object-scale-down w-full h-40", {"opacity-50": isBorrowed})} />
            </div>
            {children}
            <div className={classNames("mt-4 text-base font-medium", {"opacity-50": isBorrowed})}>
                <p className={classNames("w-full text-xs text-gray-900 text-ellipsis overflow-hidden whitespace-pre", { 'text-blue-500': isVisited })} title={title}>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {title}
                </p>
                <p className={classNames("text-xs text-gray-400 text-ellipsis overflow-hidden whitespace-pre", { 'text-blue-500': isVisited })} title={`${author} (${year})`}>
                    {author || 'N/A'} ({year || 'N/A'})
                </p>
                {/* <p>{type}</p> */}
            </div>
            {/* <p className="mt-1 text-sm text-gray-500">{condition}</p> */}
        </div>
    )
}

export default BookThumbnail