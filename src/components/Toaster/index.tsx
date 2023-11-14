'use client';
import { Fragment, useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/outline'
import { XIcon } from '@heroicons/react/solid'
import worldtrigger from 'world-trigger'
import ToasterDuration from './Duration';

export const toast = ({ key = window.crypto.randomUUID(), title, message, variant = 'success', show = true, duration = 10000 }: StateProps) => {
    worldtrigger.dispatchTrigger('gb.toaster', { key, title, message, variant, show, duration })
}

type StateProps = {
    key?: string;
    title: string;
    message: string;
    variant?: 'success' | 'danger';
    show?: boolean;
    duration?: number;
}

interface ToasterProps {
}

const Toaster: React.FunctionComponent<ToasterProps> = ({ }) => {
    const [states, setStates] = useState<StateProps[]>([])

    useEffect(() => {
        const exiting = states.filter(state => state.show === false)

        if (exiting.length === 0) return;

        const cleanup = setTimeout(() => {
            setStates((prev) => prev.filter((state) => state.show === true))
        }, 300)

        return () => clearTimeout(cleanup)
    }, [states])

    useEffect(() => {
        const handleDispatch = (data: StateProps) => {
            setStates((prev) => {
                const update = prev.filter((state) => state.key !== data.key)

                return [...update, data]
            })
        }

        worldtrigger.addTrigger('gb.toaster', handleDispatch)

        return () => worldtrigger.removeTrigger('gb.toaster', handleDispatch)
    }, [])

    const handleHideBuilder = (state: StateProps) => () => {
        setStates((prev) => [...prev.filter((each) => each.key !== state.key), { ...state, show: false }])
    }

    return (
        <>
            {/* Global notification live region, render this permanently at the end of the document */}
            <div
                aria-live="assertive"
                className="fixed inset-0 z-50 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start"
            >
                <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                    {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
                    {states.map((state) => {
                        const handleHide = handleHideBuilder(state)
                        return (
                            <Transition
                                key={state.key}
                                show={state.show}
                                as={Fragment}
                                enter="transform ease-out duration-300 transition"
                                enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                                enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden">
                                    <div className="p-4">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0">
                                                {state.variant === 'success' ? (
                                                    <CheckCircleIcon className="h-6 w-6 text-green-400" aria-hidden="true" />
                                                ) : (
                                                    <ExclamationCircleIcon className="h-6 w-6 text-red-400" aria-hidden="true" />
                                                )}
                                            </div>
                                            <div className="ml-3 w-0 flex-1 pt-0.5">
                                                <p className="text-xs font-medium text-gray-900">{state.title}</p>
                                                <p className="mt-1 text-xs text-gray-500">{state.message}</p>
                                            </div>
                                            <div className="ml-4 flex-shrink-0 flex">
                                                <button
                                                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                    onClick={handleHide}
                                                >
                                                    <span className="sr-only">Close</span>
                                                    <XIcon className="h-5 w-5" aria-hidden="true" />
                                                </button>
                                                <ToasterDuration duration={state.duration!} onHide={handleHide} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Transition>
                        )
                    })}
                </div>
            </div>
        </>
    )
}

export default Toaster