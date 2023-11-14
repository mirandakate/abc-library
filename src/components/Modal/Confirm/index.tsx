'use client';
import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/solid'
import worldtrigger from 'world-trigger'
import classNames from 'classnames';

export const confirmDialog = ({
    key,
    show = true,
    title,
    titleIcon,
    body,
    center = false,
    confirmVariant = 'success',
    confirmLabel = 'confirm',
    cancelLabel = 'cancel',
    onConfirm,
    onCancel
}: StateProps) => {
    worldtrigger.dispatchTrigger('gb.modal.confirm', { key, show, title, titleIcon, body, center, confirmVariant, confirmLabel, cancelLabel, onConfirm, onCancel })
}

type StateProps = {
    key: string;
    show?: boolean;
    title: string;
    titleIcon?: React.ReactNode;
    body: React.ReactNode;
    center?: boolean;
    confirmVariant?: 'success' | 'danger';
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

interface ModalConfirmProps {
}

const ModalConfirm: React.FunctionComponent<ModalConfirmProps> = ({ }) => {
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

        worldtrigger.addTrigger('gb.modal.confirm', handleDispatch)

        return () => worldtrigger.removeTrigger('gb.modal.confirm', handleDispatch)
    }, [])

    const handleHideBuilder = (state: StateProps) => () => {
        setStates((prev) => [...prev.filter((each) => each.key !== state.key), { ...state, show: false }])
    }

    return (
        <>
            {states.map((state) => {
                const handleHide = handleHideBuilder(state)
                return (
                    <Transition.Root key={state.key} show={state.show} as={Fragment}>
                        <Dialog as="div" className="fixed z-10 inset-0 top-0 overflow-y-auto" onClose={handleHide}>
                            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                                </Transition.Child>

                                {/* This element is to trick the browser into centering the modal contents. */}
                                <span className={classNames("hidden sm:inline-block sm:h-screen", null, state.center ? 'sm:align-middle' : 'sm:align-top')} aria-hidden="true">
                                    &#8203;
                                </span>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-out duration-300"
                                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                                    leave="ease-in duration-200"
                                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                >
                                    <div className={classNames("relative inline-block align-top bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6", null, state.center ? 'sm:align-middle' : 'sm:align-top')}>
                                        <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                                            <button
                                                type="button"
                                                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                                onClick={handleHide}
                                            >
                                                <span className="sr-only">Close</span>
                                                <XIcon className="h-6 w-6" aria-hidden="true" />
                                            </button>
                                        </div>
                                        <div className="sm:flex sm:items-start">
                                            {state.titleIcon && (
                                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                    {state.titleIcon}
                                                </div>
                                            )}
                                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                                    {state.title}
                                                </Dialog.Title>
                                                <div className="mt-2">
                                                    {state.body}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                            <button
                                                type="button"
                                                className={classNames("w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm", {
                                                    'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500': state.confirmVariant === 'success',
                                                    'bg-red-600 hover:bg-red-700 focus:ring-red-500': state.confirmVariant === 'danger',
                                                })}
                                                onClick={() => {
                                                    handleHide()
                                                    state.onConfirm()
                                                }}
                                            >
                                                {state.confirmLabel}
                                            </button>
                                            <button
                                                type="button"
                                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                                onClick={() => {
                                                    handleHide()
                                                    if (state.onCancel)
                                                        state.onCancel()
                                                }}
                                            >
                                                {state.cancelLabel}
                                            </button>
                                        </div>
                                    </div>
                                </Transition.Child>
                            </div>
                        </Dialog>
                    </Transition.Root>
                )
            })}
        </>
    )
}

export default ModalConfirm