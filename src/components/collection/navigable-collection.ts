import React from 'react'
import { Action, PayloadAction, combineReducers, IndexedCollectionState, KeyProp } from './indexed-collection'

export interface NavigableCollectionState<T, K extends KeyProp<T>> extends IndexedCollectionState<T, K> {
    context: T[K] | null
    selection: T[K][]
    subject: T[K] | null
}

export function useNavigableCollection<T, K extends KeyProp<T>>(keyProp: K, initValue: NavigableCollectionState<T, K>) {
    const reducer = React.useReducer(combineReducers('navigable-collection', {
        navigableCollectionDeselect(
            state: NavigableCollectionState<T, K>,
            action: PayloadAction<'navigable-collection-deselect', T[]>,
        ) {
            const keys = action.payload.map((item) => item[keyProp])
            return {
                ...state,
                selection: state.selection.filter((key) => !keys.includes(key)),
            }
        },
        navigableCollectionDeselectAll(
            state: NavigableCollectionState<T, K>,
            action: Action<'navigable-collection-deselect-all'>,
        ) {
            return {
                ...state,
                selection: [],
            }
        },
        navigableCollectionSelect(
            state: NavigableCollectionState<T, K>,
            action: PayloadAction<'navigable-collection-select', T[]>,
        ) {
            const keys = action.payload.map((item) => item[keyProp])
            return {
                ...state,
                selection: [...state.selection, ...keys],
            }
        },
        navigableCollectionSelectAll(
            state: NavigableCollectionState<T, K>,
            action: Action<'navigable-collection-select-all'>,
        ) {
            return {
                ...state,
                selection: Object.keys(state.index) as T[K][],
            }
        },
        navigableCollectionSetContext(
            state: NavigableCollectionState<T, K>,
            action: PayloadAction<'navigable-collection-set-context', T | null>,
        ) {
            return {
                ...state,
                context: action.payload && action.payload[keyProp],
            }
        },
        navigableCollectionSetSubject(
            state: NavigableCollectionState<T, K>,
            action: PayloadAction<'navigable-collection-set-subject', T | null>,
        ) {
            return {
                ...state,
                subject: action.payload && action.payload[keyProp],
            }
        },
    }), initValue)
    return reducer
}
