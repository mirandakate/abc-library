import React, { createContext, useContext, useRef } from "react";
import { createStore, useStoreSelectorState } from "shomai";
import FormInput from "./Input";
import FormTextarea from "./Textarea";
import FormComboBox from "./ComboBox";

const FormManagerContext = createContext<ReturnType<typeof createStore<Record<string, any>>>>(null as any)

export const useFormStore = () => useContext(FormManagerContext)

export function useFormField<P = any>(name: string) {
    const store = useFormStore()

    return useStoreSelectorState<P>(store, name)
}

export type FormEvent = React.FormEvent & { json: () => Record<string, any>, resetForm: () => void }

interface FormManagerProps extends Omit<React.HTMLProps<HTMLFormElement>, 'onSubmit'> {
    onSubmit: (event: FormEvent) => void;
}

interface FormManagerControl<P> extends React.FunctionComponent<P> {
    Input: typeof FormInput;
    Textarea: typeof FormTextarea;
    ComboBox: typeof FormComboBox;
}

const FormManager: FormManagerControl<FormManagerProps> = ({children, onSubmit, ...props}) => {
    const store = useRef(createStore<Record<string, any>>({})).current
    
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault()
        onSubmit({...event, json: store.getState, resetForm: () => store.setState(() => ({})) })
    }

    return (
        <FormManagerContext.Provider value={store}>
            <form onSubmit={handleSubmit} {...props}>
                {children}
            </form>
        </FormManagerContext.Provider>
        
    )
}

FormManager.Input = FormInput
FormManager.Textarea = FormTextarea
FormManager.ComboBox = FormComboBox

export default FormManager