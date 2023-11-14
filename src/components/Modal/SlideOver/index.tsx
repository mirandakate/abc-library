'use client';
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/solid'
import worldtrigger from 'world-trigger'
import FormManager, { FormEvent } from '@/components/FormManager';

export const slideOverDialog = ({
    key,
    show = true,
    title,
    subtitle,
    body,
    submitLabel = 'submit',
    cancelLabel = 'cancel',
    onSubmit,
    onCancel
}: Omit<StateProps, 'showLoader' | 'errors'>) => {
    worldtrigger.dispatchTrigger('gb.modal.slide.over', { key, show, showLoader: false, title, subtitle, body, submitLabel, cancelLabel, onSubmit, onCancel })
}

export type SlideOverFormEvent = FormEvent & {
    close: () => void;
    removeLoader: () => void;
    setErrors: (errors: string[]) => void;
}

type StateProps = {
    key: string;
    show?: boolean;
    showLoader?: boolean;
    title: string;
    subtitle?: string;
    body: React.ReactNode;
    submitLabel?: string;
    cancelLabel?: string;
    errors: string[];
    onSubmit: (event: SlideOverFormEvent) => void;
    onCancel?: () => void;
}

interface ModalSlideOverProps {
}

const ModalSlideOver: React.FunctionComponent<ModalSlideOverProps> = ({ }) => {
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

        worldtrigger.addTrigger('gb.modal.slide.over', handleDispatch)

        return () => worldtrigger.removeTrigger('gb.modal.slide.over', handleDispatch)
    }, [])

    const handleSubmit = (state: StateProps) => (event: FormEvent) => {
        setStates((prev) => [...prev.filter((each) => each.key !== state.key), { ...state, showLoader: true }])
        state.onSubmit({
            ...event,
            close: handleHideBuilder(state),
            removeLoader: () => {
                setStates((prev) => [...prev.filter((each) => each.key !== state.key), { ...state, showLoader: false }])
            },
            setErrors: (errors: string[]) => {
                setStates((prev) => [...prev.filter((each) => each.key !== state.key), { ...state, errors }])
            }
        })
    }

    const handleHideBuilder = (state: StateProps) => () => {
        if (state.onCancel)
            state.onCancel()

        setStates((prev) => [...prev.filter((each) => each.key !== state.key), { ...state, show: false }])
    }

    return (
        <>
            {states.map((state) => {
                const handleHide = handleHideBuilder(state)

                return (
                    <Transition.Root key={state.key} show={state.show} as={Fragment}>
                        <Dialog as="div" className="fixed inset-0 overflow-hidden z-40" onClose={handleHide}>
                            <div className="absolute inset-0 overflow-hidden">
                                <Dialog.Overlay className="absolute inset-0" />

                                <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">

                                    <Transition.Child
                                        as={Fragment}
                                        enter="transform transition ease-in-out duration-500 sm:duration-700"
                                        enterFrom="translate-x-full"
                                        enterTo="translate-x-0"
                                        leave="transform transition ease-in-out duration-500 sm:duration-700"
                                        leaveFrom="translate-x-0"
                                        leaveTo="translate-x-full"
                                    >
                                        <div className="relative pointer-events-auto w-screen max-w-2xl">
                                            {state.showLoader && (
                                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100 bg-opacity-60">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                </div>
                                            )}
                                            <FormManager id={state.key} onSubmit={handleSubmit(state)} className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                                <div className="flex-1">
                                                    {/* Header */}
                                                    <div className="bg-gray-50 px-4 py-6 sm:px-6">
                                                        <div className="flex items-start justify-between space-x-3">
                                                            <div className="space-y-1">
                                                                <Dialog.Title className="text-lg font-medium text-gray-900"> {state.title} </Dialog.Title>
                                                                {state.subtitle && (
                                                                    <p className="text-sm text-gray-500">
                                                                        {state.subtitle}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div className="flex h-7 items-center">
                                                                <button
                                                                    type="button"
                                                                    className="text-gray-400 hover:text-gray-500"
                                                                    onClick={handleHide}
                                                                >
                                                                    <span className="sr-only">Close panel</span>
                                                                    <XIcon className="h-6 w-6" aria-hidden="true" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {Array.isArray(state.errors) && state.errors.length > 0 && (
                                                        <ul className="mx-5 my-2 px-2 py-4 rounded sm:px-6 bg-red-200 text-red-900">
                                                            {state.errors?.map((error, index) => (
                                                                <li className="text-xs" key={index}>{error}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                    {/* Divider container */}
                                                    {state.body}
                                                </div>

                                                {/* Action buttons */}
                                                <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
                                                    <div className="flex justify-end space-x-3">
                                                        <button
                                                            type="button"
                                                            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                            onClick={handleHide}
                                                        >
                                                            {state.cancelLabel}
                                                        </button>
                                                        <button
                                                            form={state.key}
                                                            type="submit"
                                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                                        >
                                                            {state.submitLabel}
                                                        </button>
                                                    </div>
                                                </div>
                                            </FormManager>
                                        </div>
                                    </Transition.Child>
                                </div>
                            </div>
                        </Dialog>
                    </Transition.Root>
                )
            })}
        </>
    )
}

export default ModalSlideOver