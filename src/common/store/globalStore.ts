import { createStore, useStoreSelectorState } from "shomai";

export interface GlobalStore {
    search: string;
}

export const globalStore = createStore<GlobalStore>({
    search: ''
})

export const useSearch = () => {
    return useStoreSelectorState<string>(globalStore, 'search')
}