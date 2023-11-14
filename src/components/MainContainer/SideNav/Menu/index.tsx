'use client'
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const menuItems = [
    {
        href: '/',
        label: 'My Library'
    },
    {
        href: '/search-book',
        label: 'Add Book to My Library'
    },
    // {
    //     href: '/recent-borrowed',
    //     label: 'Recent Borrowed'
    // }
]

interface SideNavMenuProps {

}

const SideNavMenu: React.FunctionComponent<SideNavMenuProps> = (props) => {
    const path = usePathname()
    return (
        <div className="flex flex-col sm:flex-row xl:flex-col">
            {menuItems?.map((item, index) => (
                <Link
                    key={index}
                    href={item.href}
                    className={classNames("inline-flex items-center justify-center px-4 py-2 mb-3 border shadow-sm text-sm font-medium rounded-md focus:outline-none text-gray-700 lg:mr-2 sm:mr-2 focus:ring-2 focus:ring-offset-2 xl:w-full", { "border-transparent focus:ring-blue-500 text-white bg-blue-600 hover:bg-blue-700": item.href === path})}
                >
                    {item.label}
                </Link>
            ))}
            
        </div>
    )
}

export default SideNavMenu