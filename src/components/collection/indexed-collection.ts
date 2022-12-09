import React from 'react'

export type IndexedCollection<T, K extends KeyProp<T>> = T[K] extends React.Key ? Record<T[K], T> : never

export interface IndexedCollectionState<T, K extends KeyProp<T>> {
    index: IndexedCollection<T, K>
    key: K
}

export type KeyOfType<T, U> = keyof {
    [K in keyof T as T[K] extends U ? K : never]: T[K]
}

export type KeyProp<T> = KeyOfType<T, React.Key>

export function useIndexedCollection<P, K extends KeyProp<P>, I extends string>(id: I, indexKey: K, initValue: IndexedCollectionState<P, K>) {
    const indexedCollectionReducer = combineReducers(id, {
        update(
            state: IndexedCollectionState<P, K>,
            action: PayloadAction<`${I}/update`, P>,
        ) {
            const key = action.payload[indexKey]
            return {
                ...state,
                index: { 
                    ...state.index,
                    ...{ [key as React.Key]: action.payload } as IndexedCollection<P, K>,
                },
            }
        },
        delete(
            state: IndexedCollectionState<P, K>,
            action: PayloadAction<`${I}/delete`, P>,
        ) {
            const key = action.payload[indexKey]
            delete state.index[key]
            return {
                ...state,
                index: { 
                    ...state.index,
                },
            }
        },
    })
    
    const [state, dispatch] = React.useReducer(indexedCollectionReducer, initValue)
    return {
        actions: indexedCollectionReducer.actions,
        collection: state,
        dispatch,
    }
}

export type Action<T extends PropertyKey = any> = {
    type: T
}

export type PayloadAction<T extends PropertyKey = any, P = any> = {
    payload: P
    type: T
}

export type AnyAction = PayloadAction

export type Reducer<S, A extends AnyAction = AnyAction> = (state: S, action: A) => S

// export type ReducerRecord<T extends string, P, S> = {
//     [K in T]: Reducer<K, P, S>
// }

export function combineReducers<S, R extends { [key in string]: Reducer<S> }>(name: string, reducers: R) {
    function combinedReducer<A extends PayloadAction<T, P>, T extends keyof R, P>(state: S, action: A) {
        return reducers[action.type](state, action)
    }
    combinedReducer.actions = Object.fromEntries(
        Object.keys(reducers).map((type) => ([
            name + '/' + type,
            (payload: any) => ({
                payload,
                type: name + '/' + type,
            })
        ]))
    )
    return combinedReducer
}
