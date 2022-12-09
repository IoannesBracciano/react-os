import Immutable from 'immutable'
import _ from 'lodash'
import React from 'react'

export interface IndexedCollectionState<T, K extends keyof T> {
    readonly index: Record<string, T>
    readonly keygenFn: (existingKeys: Immutable.Set<string>) => string
    readonly keyProp: K
    // readonly keys: Immutable.Set<string>
}

export type ActionAddItems<T, K extends keyof T> = {
    type: 'addItems'
    payload: Omit<T, K>[]
}

export type ActionRemoveItems = {
    type: 'removeItems'
    payload: string[]
}

export type ActionUpdateItem<T> = {
    type: 'updateItem'
    payload: { key: string, changes: Partial<T> }
}

export type IndexedCollectionAction<T, K extends keyof T> =
    ActionAddItems<T, K> | ActionRemoveItems | ActionUpdateItem<T>

const IndexedCollectionActions = [
    { type: 'addItems' },
    { type: 'removeItems' },
    { type: 'updateItem' },
] as const

export type IndexedCollectionActionType = typeof IndexedCollectionActions[number]['type']

// export type CollectionCaseReducer = (state: CollectionState<any, any>, action: CollectionAction<any, any>) => CollectionState<any, any>

const caseReducers = Object.freeze({
    addItems<T, K extends keyof T>(
        state: IndexedCollectionState<T, K>,
        action: ActionAddItems<T, K>,
    ): IndexedCollectionState<T, K> {
        const newItems = action.payload
        const newIndex = newItems.reduce((index, item) => {
            const key = generateKey(Immutable.Set(Object.keys(index)))
            return {
                ...index,
                [key]: ({ ...item, [state.keyProp]: key } as T),
            }
        }, state.index)
        return { ...state, index: newIndex }
    },
    removeItems<T, K extends keyof T>(
        state: IndexedCollectionState<T, K>,
        action: ActionRemoveItems,
    ) {
        const keys = action.payload
        const newIndex = Object.fromEntries(
            Object.entries(state.index).filter(([key]) => !keys.includes(key)))
        return { ...state, index: newIndex }
    },
    updateItem<T, K extends keyof T>(
        state: IndexedCollectionState<T, K>,
        action: ActionUpdateItem<T>,
    ) {
        const { key, changes } = action.payload
        if (!state.index[key]) {
            return state
        }
        const newIndex = {
            ...state.index,
            [key]: {
                ...state.index[key],
                ...changes,
                // making sure key prop won't change
                [state.keyProp]: key,
            },
        }
        return { ...state, index: newIndex }
    },
}) as Record<IndexedCollectionActionType, Function>

export function useIndex<T, P extends keyof T>(
    by: P,
    items: T[] = [],
) {
    const [index, dispatch] = React.useReducer(
        (
            state: IndexedCollectionState<T, P>,
            action: IndexedCollectionAction<T, P>,
        ): IndexedCollectionState<T, P> => {
            const caseReducer = caseReducers[action.type]
            return (
                typeof caseReducer === 'function'
                    ? caseReducer(state, action)
                    : state
            )
        },
        {
            index: _.keyBy(items, by),
            keygenFn: generateKey,
            keyProp: by,
        },
    )
    return [index, dispatch];
    // return {
    //     add(...newItems: Omit<T, P>[]): void {
    //         dispatch({
    //             type: 'addItems',
    //             payload: newItems,
    //         })
    //     },
    //     get entries() {
    //         return collection.index
    //     },
    //     getItem(key: string) {
    //         return collection.index.get(key)
    //     },
    //     getItems(...keys: string[]) {
    //         return keys.map((key) => collection.index.get(key))
    //     },
    //     getItemKey(item: T) {
    //         return collection.index.keyOf(item)
    //     },
    //     get items() {
    //         return collection.index.valueSeq()
    //     },
    //     get keys() {
    //         return collection.index.keySeq()
    //     },
    //     remove(...keys: string[]) {
    //         dispatch({
    //             type: 'removeItems',
    //             payload: keys,
    //         })
    //     },
    //     update(key: string, changes: Partial<T>) {
    //         dispatch({
    //             type: 'updateItem',
    //             payload: { key, changes },
    //         })
    //     },
    // }
}

/**
 * Generates a random key value that is guaranted not to be in the
 * given set of `existingKeys`.
 * 
 * The key is generated using the hash of existing keys and the current
 * system time (obtained with `Date.now()`). You can override this
 * generator by passing a custom one when calling the `useCollection`
 * hook.
 * 
 * @param existingKeys Set of existing unique keys.
 * @returns A random unique key value.
 */
function generateKey(existingKeys: Immutable.Set<string>): string {
    const key = hash(existingKeys.join('') + Date.now()).toString()
    if (existingKeys.has(key)) {
        // Try again if key is not unique in collection
        return generateKey(existingKeys)
    }
    return key
}

/**
 * Simple Hash Algorithm
 * 
 * Copied from stackoverflow
 */
function hash(value: string) {
    if (value.length === 0) {
        return 0
    }
    let hash = 0, i, chr
    for (i = 0; i < value.length; i++) {
      chr = value.charCodeAt(i)
      hash = ((hash << 5) - hash) + chr
      hash |= 0 // Convert to 32bit integer
    }
    return hash;
}
