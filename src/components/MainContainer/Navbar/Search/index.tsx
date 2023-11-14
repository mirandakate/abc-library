'use client'
import React, { useEffect, useRef } from "react";
import { useSearch } from "@/common/store/globalStore";
import {
    SearchIcon,
} from '@heroicons/react/solid'
import worldtrigger from 'world-trigger'

interface NavbarSearchProps {

}

const NavbarSearch: React.FunctionComponent<NavbarSearchProps> = (props) => {
    const cleanupTimeout = useRef<any>(null)
    const [search, setSearch] = useSearch()

    const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        const value = event.target.value

        setSearch(value)
    }

    const handleSearch: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault()
        clearTimeout(cleanupTimeout.current)
        worldtrigger.dispatchTrigger('search')
    }

    const initialRender = useRef<boolean>(false)

    useEffect(() => {
        if(initialRender.current === true) {
            cleanupTimeout.current = setTimeout(() => {
                worldtrigger.dispatchTrigger('search')
            }, 500)

            return () => clearTimeout(cleanupTimeout.current)
        }
    }, [search])

    useEffect(() => {
        initialRender.current = true
    }, [])

    return (
        <div className="flex-1 flex justify-center lg:justify-end">
        <div className="w-full px-2 lg:px-6">
            <label htmlFor="search" className="sr-only">
                Search Book
            </label>
            <form onSubmit={handleSearch} className="relative text-blue-200 focus-within:text-gray-400">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5" aria-hidden="true" />
                </div>
                <input
                    type="search"
                    name="search"
                    value={search}
                    onChange={handleSearchChange}
                    className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-blue-400 bg-opacity-25 text-blue-100 placeholder-blue-200 focus:outline-none focus:bg-white focus:ring-0 focus:placeholder-gray-400 focus:text-gray-900 sm:text-sm"
                    placeholder="Search books"
                />
            </form>
        </div>
    </div>
    )
}

export default NavbarSearch