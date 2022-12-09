import { createContext, Dispatch } from 'react'

export type Action = {
    type: string
}

export type ActionWithPayload = Action & {
    payload: unknown
}

export interface ActionContext {
    dispatch: Dispatch<{ type: string; payload: any }>
}

export const ActionContext = createContext<ActionContext>({
    dispatch: () => {},
})
