import { Set } from 'immutable'
import React from 'react'
import { ListViewSelectionMode } from './ListView'

export type ActionDeselect<K> = {
    type: 'deselect'
    payload: { key: K | null }
}

export type ActionSelect<K> = {
    type: 'select'
    payload: { key: K | null }
}

export type ActionSetSelection<K> = {
    type: 'setSelection'
    payload: { selection: K[] }
}

export type ActionToggle<K> = {
    type: 'toggle'
    payload: { key: K | null }
}

export type ListViewSelectionAction<K> =
    ActionDeselect<K> | ActionSelect<K> | ActionSetSelection<K> | ActionToggle<K>

export function useSelection<K>(mode: ListViewSelectionMode, init: K[]) {
    const [selection, dispatch] = React.useReducer(
        (selection: Set<K>, action: ListViewSelectionAction<K>) => {
            switch (action.type) {
                case 'deselect':
                    return deselect(selection, action.payload.key)
                case 'select':
                    return select(selection, action.payload.key)
                case 'setSelection':
                    return setSelection(action.payload.selection)
                case 'toggle':
                    return toggle(selection, action.payload.key)
                default:
                    return selection
            }
        },
        // Get only the first item (if any) in initSelection 
        // if single selection mode is enabled
        setSelection(mode === 'none' ? [] : mode === 'single' ? init.slice(0,1) : init),
    )

    const actions = Object.freeze({
        deselect: React.useCallback((key: K | null) => dispatch({
            type: 'deselect',
            payload: { key },
        }), [dispatch]),
    
        select: React.useCallback((key: K | null) => dispatch({
            type: 'select',
            payload: { key },
        }), [dispatch]),
    
        setSelection: React.useCallback((selection: K[]) => dispatch({
            type: 'setSelection',
            payload: { selection },
        }), [dispatch]),

        toggle: React.useCallback((key: K | null) => dispatch({
            type: 'toggle',
            payload: { key },
        }), [dispatch]),
    })

    return [selection, actions] as const
}

function deselect<K>(selection: Set<K>, key: K | null) {
    return !!key && selection.has(key) ? selection.delete(key) : selection
}

function select<K>(selection: Set<K>, key: K | null) {
    return !!key && !selection.has(key) ? selection.add(key) : selection
}

function setSelection<K>(selection: K[]) {
    return Set(selection)
}

function toggle<K>(selection: Set<K>, key: K | null) {
    if (!!key) {
        return selection.has(key)
            ? selection.delete(key)
            : selection.add(key)
    }
    return selection
}
