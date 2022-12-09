import React, { ForwardedRef, HTMLAttributes, useMemo } from 'react'

// type Any = { [prop in PropertyKey]: any }

export type CollectionItemView<P> = (props: P) => JSX.Element

export type IndexedCollection<T, K extends keyof T>
    = T[K] extends PropertyKey ? Record<T[K], T> : never

export type KeyOfType<O, T> = {
    [K in keyof O]: O[K] extends T ? K : never
}

export type CollectionItemEventHandler<T>
    = (event: React.MouseEvent, item: T) => void

export interface IndexedCollectionState<T, K extends keyof T = keyof T> {
    focused?: T | null
    index: IndexedCollection<T, K>
    selection: T[K][]
}

export interface CollectionProps<T, K extends keyof T = keyof T> extends Omit<HTMLAttributes<HTMLLIElement>, 'children'> {
    children: CollectionItemView<T>
    forwardedRef?: ForwardedRef<HTMLUListElement>
    items: T[]
    collection?: IndexedCollectionState<T, K>
    keyProp?:  K
    selectedItem?: T | null
}

export function Collection<T, K extends keyof T = keyof T>({
    children,
    forwardedRef,
    items,
    keyProp = 'key' as K,
    // onClick,
    // onContextMenu,
    // onMouseDown,
    selectedItem,
    ...htmlAttrs
}: CollectionProps<T, K>) {
    return (
        <ul className='collection-list' ref={forwardedRef}>{
            items.map((item) => (
                <CollectionItem
                    {...htmlAttrs}
                    id={`${item[keyProp]}`}
                    item={item}
                    key={`${item[keyProp]}`}
                    // onClick={append(onClick, item)}
                    // onContextMenu={append(onContextMenu, item)}
                    // onMouseDown={append(onMouseDown, item)}
                    selected={item === selectedItem}
                    renderFn={children}
                />
            ))
        }</ul>
    )
}

export interface CollectionItemProps<T> extends Omit<HTMLAttributes<HTMLLIElement>, 'children'> {
    item: T
    selected?: boolean
    renderFn: CollectionItemView<T>
}

export function CollectionItem<T>({
    item,
    selected = false,
    renderFn,
    ...htmlAttrs
}: CollectionItemProps<T>) {
    return (
        <li
            {...htmlAttrs}
            className={'collection-item' + (useMemo(() => selected, [selected]) ? ' selected' : '')}
        >
            {renderFn(item)}
        </li>
    )
}

// function append<F, A1, A2>(fn: F, ...args: A1[]) {
//     return (...args2: A2[]) => {
//         if (typeof fn === 'function') {
//             fn(...args2, ...args)
//         }
//     }
// }

// function prepend<F, A1, A2>(fn: F, ...args: A1[]) {
//     return (...args2: A2[]) => {
//         if (typeof fn === 'function') {
//             fn(...args, ...args2)
//         }
//     }
// }

// export type PayloadAction<A extends string, P> = {
//     type: A
//     payload: P
// }

// export type Reducer<S, A extends string, P> = ((state: S, action: PayloadAction<A, P>) => S) & { type: A }

// export function useIndexedCollection<T, K extends keyof T, A extends string, P>(
//     ...reducers: Reducer<IndexedCollectionState<T, K>, A, P>[]
// ) {

// }

// export function createIndex<T, K extends keyof T>(items: T[], by: K | ((item: T) => { [key in K]: T[K] })) {
//     return items.reduce((index, item) => ({
//         ...index,
//         ...getIndexed(item, by),
//     }), {})
// }

// function getIndexed<T, K extends keyof T>(item: T, key: K | ((item: T) => { [key in K]: T[K] })) {
//     if (typeof key === 'number' || typeof key === 'string' || typeof key === 'symbol') {
//         return { [key]: item[key] }
//     }
//     return key(item)
// }
