'use client'
import React from "react";
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import NavbarSearch from "./Search";

interface NavbarProps {

}

const Navbar: React.FunctionComponent<NavbarProps> = (props) => {
    return (
        <nav className="flex-shrink-0 bg-blue-600">
            <div className="mx-auto px-2 sm:px-4 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    {/* Logo section */}
                    <div className="flex items-center px-2 lg:px-0 xl:w-64">
                        <div className="flex-shrink-0">
                            <div className="flex items-center">
                                <p className="text-white">ABC Library</p>
                            </div>
                        </div>
                    </div>

                    {/* Search section */}
                    <NavbarSearch />

                    <div className="flex justify-end xl:w-80">
                        {/* Profile dropdown */}
                        <Menu as="div" className="ml-3 relative block xl:hidden">
                            <div>
                                <Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                                    <span className="sr-only">Open user menu</span>
                                    <img
                                        className="h-8 w-8 rounded-full"
                                        src="https://katemiranda.vercel.app/images/image.png"
                                        alt=""
                                    />
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
                                <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none">
                                    <div className="py-1">
                                        <a
                                            href="#"
                                            className="block px-4 py-2 text-sm text-gray-700"
                                        >
                                            Logout
                                        </a>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar