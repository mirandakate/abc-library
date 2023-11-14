import classNames from "classnames";
import React, { useEffect } from "react";
import { useFormField } from "..";

type FormComboBoxOption = {
    label: string;
    sublabel?: string;
    value: any;
}

interface FormComboBoxProps extends Omit<React.HTMLProps<HTMLInputElement>, 'type'> {
    type: 'radio' | 'checkbox';
    name: string;
    label: string;
    value?: any;
    options: FormComboBoxOption[];
}

const FormComboBox: React.FunctionComponent<FormComboBoxProps> = ({ id, type, label, name, value, className, options, disabled, ...props }) => {
    const [fieldValue, setFieldValue] = useFormField<any>(name)

    useEffect(() => {
        if(value)
            setFieldValue(value)
    }, [value])

    const handleChange = (option: FormComboBoxOption): React.ChangeEventHandler<any> => (event) => {
        const v = option.value

        if(type === 'checkbox') {
            setFieldValue((prev: any[] = []) => {
                if(prev.includes(v)) {
                    return prev.filter((each: any) => each !== v)
                }

                return [...prev, v]
            })
        } else {
            setFieldValue(v)
        }
    }

    return (
        <fieldset className="space-y-1 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6">
            <div>
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-gray-900 sm:mt-px sm:pt-2"
                >
                    {' '}
                    {label}
                </label>
            </div>
            <div className={classNames("sm:col-span-2", {'opacity-50': disabled})}>
                {options.map((option, key) => (
                    <div key={key} className="mt-2 space-y-5">
                        <div className="relative flex items-start flex-row">
                            <div className="absolute flex h-5 items-center">
                                <input
                                    type={type}
                                    id={`id-${option.value}`}
                                    disabled={disabled}
                                    name={name}
                                    checked={type === 'checkbox' ? (fieldValue || []).includes(option.value) : fieldValue === option.value}
                                    onChange={handleChange(option)}
                                    className={classNames("block w-full px-2 rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm", null, className)}
                                    {...props}
                                />
                            </div>
                            <div className="pl-7 text-sm">
                                <label htmlFor={`id-${option.value}`} className="font-medium text-gray-900">
                                    {' '}
                                    {option.label}{' '}
                                </label>
                                {option.sublabel && (
                                    <p className="text-gray-500">
                                        {option.sublabel}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </fieldset>
    )
}

export default FormComboBox