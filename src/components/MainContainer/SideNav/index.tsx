'use client'
import React from "react";
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import {

    SelectorIcon,
} from '@heroicons/react/solid'
import classNames from "@/common/utils/classNames";
import Link from "next/link";
import SideNavMenu from "./Menu";

interface SideNavProps {

}

const SideNav: React.FunctionComponent<SideNavProps> = (props) => {
    return (
        <div className="xl:flex-shrink-0 xl:w-64 xl:border-r xl:border-gray-200 bg-white">
            <div className="pl-4 pr-6 py-6 sm:pl-6 lg:pl-8 xl:pl-8">
                <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-8">
                        <div className="space-y-8 sm:space-y-0 sm:flex sm:justify-between sm:items-center xl:block xl:space-y-8">
                            {/* Profile */}
                            <Menu as="div" className="relative hidden text-left xl:w-full xl:inline-block">
                                <div>
                                    <Menu.Button className="group w-full bg-gray-50 rounded-md px-3.5 py-2 text-sm text-left font-medium text-gray-700">
                                        <span className="flex w-full justify-between items-center">
                                            <span className="flex items-center justify-between space-x-3">
                                                <img
                                                    className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"
                                                    src="https://katemiranda.vercel.app/images/image.png"
                                                    alt=""
                                                />
                                                <span className="flex-1 flex flex-col min-w-0">
                                                    <span className="text-gray-900 text-sm font-medium truncate">Kate Miranda</span>
                                                    <span className="text-gray-500 text-sm truncate">@katemiranda</span>
                                                </span>
                                            </span>
                                            <SelectorIcon
                                                className="flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </Menu.Button>
                                </div>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="z-10 mx-3 origin-top absolute right-0 left-0 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none">
                                        <div className="py-1">
                                                <a
                                                href="#"
                                                    className={"text-gray-700 block px-4 py-2 text-sm"}
                                                >
                                                    Logout
                                                </a>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                            {/* Action buttons */}
                            <SideNavMenu />
                            {/* <div className="flex flex-col sm:flex-row xl:flex-col">
                                <Link
                                    href="/search-book"
                                    className="mt-3 inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 xl:ml-0 xl:mt-3 xl:w-full"
                                >
                                    Add Book to My Library
                                </Link>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default SideNav