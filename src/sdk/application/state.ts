import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit'

// export type Async<T> = {
//     error: Error
//     loading: boolean
//     value?: T | undefined
// }

// export type AsyncRecord<K extends PropertyKey, T> = Record<K, Async<T>>

// export interface ResourceState<T> {
//     index?: string[] | undefined,
//     record: Record<string, T>
// }

// // export type SerializerFn<T> = (o: T) => string

// export type GetItemAction<T> = PayloadAction<T>

// export function createResourceSlice<T>(indexStorageKey: string) {
//     return createSlice({
//         initialState: { record: {} } as ResourceState<T>,
//         name: indexStorageKey,
//         reducers: {
//             getIndex(state) {
//                 state.index = localStorage.get(indexStorageKey)
//                 return state
//             },
//             getItem(state, { payload: key }: PayloadAction<string>) {
//                 state.record[key] = localStorage.get(indexStorageKey + `#${key}`)
//                 return state
//             }
//         },
//     })
// }

