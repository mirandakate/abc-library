import classNames from "classnames";
import React, { useEffect } from "react";
import { useFormField } from "..";

interface FormInputProps extends React.HTMLProps<HTMLInputElement> {
    name: string;
    label: string;
}

const FormInput: React.FunctionComponent<FormInputProps> = ({ id, label, name, value, className, ...props }) => {
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
                <input
                    id={id}
                    name={name}
                    value={fieldValue}
                    onChange={handleChange}
                    className={classNames("shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md", null, className)}
                    {...props}
                />
            </div>
        </div>
    )
}

export default FormInput