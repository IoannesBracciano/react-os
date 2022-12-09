import classNames from 'classnames'
import { ChangeEvent, ChangeEventHandler, useCallback } from 'react'
import './Switch.css'

export interface SwitchProps {
    defaultState?: number | boolean
    name?: string
    onStateChange?: SwitchStateChangeHandler
    space?: 'normal' | 'compact'
    state?: number | boolean
    states?: [string, string]
}

export type SwitchStateChangeHandler = (state: string, event: ChangeEvent<HTMLInputElement>) => void

export function Switch({
    defaultState = 0,
    name,
    onStateChange,
    space = 'normal',
    state,
    states = ['off', 'on'],
}: SwitchProps) {
    const onChange: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
        const state = +(event.target as HTMLInputElement).checked
        if (typeof onStateChange === 'function') {
            onStateChange(states[state], event)
        }
    }, [onStateChange, states])

    return (
        <input
            checked={!!state}
            className={classNames('switch', {
                'compact': space === 'compact'
            })}
            defaultChecked={!!defaultState}
            name={name}
            onChange={onChange}
            type='checkbox'
        />
    )
}