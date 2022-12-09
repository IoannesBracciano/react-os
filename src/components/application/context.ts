import { IconDefinition } from '@fortawesome/free-regular-svg-icons'
import _ from 'lodash'
import React from 'react'

export interface ApplicationContext {
    id: string
    name: string
}

export type Action<T extends string> = {
    type: T
}

export type PayloadAction<T, P> = {
    payload: P
    type: T
}

// export type ActionItem<T extends string = any, P = any> = {
//     action: Action<T> | PayloadAction<T, P>
//     disabled?: boolean
//     icon?: IconDefinition
//     key: string
//     keys?: string
//     label: string
//     // name: string
// }

export type ActionItem<T = any> = {
    action: { type: string }
    icon?: IconDefinition | undefined
    key: React.Key
    label: string
    visible: boolean | ((targets: T[]) => boolean) | undefined
}

export type Dispatch<T extends string = any, A extends ActionItem<T> = any> = (action: A) => void

// export function createAction<T>(ctor: (target: T) => ActionItem) {
//     return (target: T) => ctor(target)
// }

// export function createActions<T>(ctor: (target: T) => ActionMenuItem[]) {
//     return (target: T) => ctor(target)
// }

export type ActionContextType = Record<string, {
    dispatch: Dispatch
    actionItems: ActionItem[]
    actionTargets: any[]
}>

export const ActionContext = React.createContext<ActionContextType>({})

export const useActionContext = (contextId: string) => React.useContext(ActionContext)[contextId]

export const Collection = Object.freeze({
    some(predicate: (v: any, i: number) => boolean) {
        return (c: any[]) => c.some(predicate)
    }
})

export const Schema = Object.freeze({
    property(p: string) {
        return Object.freeze({
            isOwn(o: any) {
                return Object.hasOwn(o, p)
            },
            get value() {
                return Object.freeze({
                    equals(v: string) {
                        return (o: any) => o[p] == v
                    },
                    is(v: string) {
                        return (o: any) => o[p] === v
                    },
                    isFalsy() {
                        return (o: any) => !o[p]
                    },
                    isTruthy() {
                        return (o: any) => !!o[p]
                    },
                })
            }
        })
    }
})
