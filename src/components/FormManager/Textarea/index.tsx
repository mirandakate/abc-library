import classNames from "classnames";
import React, { useEffect } from "react";
import { useFormField } from "..";

interface FormTextareaProps extends React.HTMLProps<HTMLTextAreaElement> {
    name: string;
    label: string;
}

const FormTextarea: React.FunctionComponent<FormTextareaProps> = ({ id, label, name, value, className, ...props }) => {
    const [fieldValue, setFieldValue] = useFormField(name)

    useEffect(() => {
        if(value)
            setFieldValue(value)
    }, [value])

    const handleChange: React.ChangeEventHandler<any> = (event) => {
        const v = event.target.value
        setFieldValue(v)
    }

    return (
        <div className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div>
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                >
                    {' '}
                    {label}
                </label>
            </div>
            <div className="sm:col-span-2">
                <textarea
                    id={id}
                    name={name}
                    value={fieldValue}
                    onChange={handleChange}
                    rows={3}
                    className={classNames("block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm", null, className)}
                    {...props}
                />
            </div>
        </div>
    )
}

export default FormTextarea