import React from 'react'
import { IndexedCollectionState } from './Collection'

// export type CollectionContext<K extends string, T> = Record<K, CollectionState<T>>

export type CollectionContextType<T, A> = {
    state: IndexedCollectionState<T>,
    dispatch: React.Dispatch<A>
}

export const CollectionContext = React.createContext<Record<string, CollectionContextType<any, any>>>({})

export function useCollectionContext(name: string) {
    const context = React.useContext(CollectionContext)
    return context[name]
}
