import classNames from 'classnames'
import React, { KeyboardEventHandler, useState } from 'react'
import { useSelection } from './useSelection'
import './ListView.css'
import { IndexedCollectionState } from '../indexed-collection/IndexedCollection'
import { withContextMenu6 } from '../context-menu/ContextMenu'
import { MenuItem } from '../menu/Menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons'

export type ListViewSelectionMethod = 'click' | 'contextmenu' | 'doubleclick' | 'touch'

export type ListViewSelectionMode = 'none' | 'multiple' | 'single'

export type ComparatorFn<T> = (itemA: T, itemB: T) => number

export type PredicateFn<T> = (item: T, key: string) => boolean

export type SortDirection = 'asc' | 'desc'

export interface List<T, K extends keyof T> extends IndexedCollectionState<T, K>{
    readonly items: T[]
    filter(propertyNameOrPredicateFn: keyof T | PredicateFn<T>): void
    sort(propertyNameOrComparatorFn: keyof T | ComparatorFn<T>, direction: SortDirection): void
    swap(indexA: number, indexB: number): void
}

export interface ListViewProps<
T extends { [key in K]: string },
K extends keyof T
> extends Omit<React.HTMLAttributes<HTMLLIElement>, 'children'> {
    children: (item: T) => JSX.Element
    collection: { index: Record<string, T> }
    filter?: PredicateFn<T> | undefined
    group?: ({ keyBy: keyof T, label?: (value: any) => string }) | undefined
    initSelection?: string | string[] | undefined
    // items: T[]
    onActionTargetsChange?: ((items: string[]) => void) | undefined
    onCreateContextMenu?: ((targets: T[]) => MenuItem[]) | undefined
    onSelectionChange?: ((selection: string[]) => void) | undefined
    selectionMethods?: ListViewSelectionMethod[] | undefined
    selectionMode?: ListViewSelectionMode | undefined
    sort?: ComparatorFn<T>
}

export const ListView = function ListView<
    T extends { [key in K]: string },
    K extends keyof T
>({
    children,
    collection,
    filter,
    group,
    initSelection = [],
    // items,
    onActionTargetsChange,
    onContextMenu,
    onCreateContextMenu,
    onMouseDown,
    onSelectionChange,
    selectionMethods = ['click'],
    selectionMode = 'none',
    sort,
    ...rest
}: ListViewProps<T, K>) {
    const [actionTargets, setActionTargets] = useState<string[]>([])

    const [isContextMenuShown, setIsContextMenuShown] = useState(false)

    const contextMenuItems = React.useMemo(() => (
        typeof onCreateContextMenu === 'function'
            ? onCreateContextMenu(actionTargets.map((target) => collection.index[target]))
            : []
    ), [actionTargets, collection.index, onCreateContextMenu])

    const filtered = React.useMemo(() => {
        if (typeof filter === 'function') {
            return Object.keys(collection.index)
                .filter((key) => filter(collection.index[key], key))
        }
        return Object.keys(collection.index)
    }, [collection.index, filter])

    const sorted = React.useMemo(() => {
        if (typeof sort === 'function') {
            return filtered.sort((keyA, keyB) =>
                sort(collection.index[keyA], collection.index[keyB]))
        }
        return filtered
    }, [collection.index, filtered, sort])

    const grouped = React.useMemo(() => {
        if (group && group.keyBy) {
            return sorted.reduce((grouped, key) => {
                const value = collection.index[key][group.keyBy]
                const groupLabel = typeof group.label === 'function'
                    ? group.label(value)
                    : value
                return {
                    ...grouped,
                    [groupLabel]: [
                        ...(grouped[groupLabel] || []),
                        key,
                    ],
                }
            }, { default: [] } as Record<string, string[]>)
        }
        return { default: sorted }
    }, [collection.index, group, sorted])

    // const groups = [
    //     // default is always first
    //     'default',
    //     ...Object.keys(grouped).filter((groupLabel) => groupLabel !== 'default'),
    // ]
    const groups = Object.keys(grouped)

    const [expandedGroups, setExpandedGroups] = useState<string[]>([])

    const flatKeys = Object.values(grouped).flat()

    const [selection, { setSelection, toggle }] = useSelection(
        selectionMode,
        ([grouped[groups[0]][0]]).concat(initSelection),
    )

    React.useEffect(() => {
        if (typeof onActionTargetsChange === 'function') {
            onActionTargetsChange(actionTargets)
        }
    }, [actionTargets, onActionTargetsChange])

    React.useEffect(() => {
        if (typeof onSelectionChange === 'function') {
            onSelectionChange(selection.toArray())
        }
    }, [onSelectionChange, selection])

    const handleItemMouseDown = React.useCallback(
        (event: React.MouseEvent<HTMLLIElement>, item: T, key: string, index: number) => {
            if (typeof onMouseDown === 'function') {
                onMouseDown(event)
            }
            if (isContextMenuShown) {
                // Interpret action as user trying to hide the context menu
                return
            }
            if (event.button !== 0) {
                // Only handle event if the left mouse button is down
                return
            }
            
            if (event.ctrlKey || event.metaKey) {
                if (selectionMode === 'multiple') {
                    toggle(key)
                } else if (selectionMode === 'single') {
                    setSelection([key])
                }
            } else if (event.shiftKey) {
                event.preventDefault()
                if (selection.size === 0) {
                    toggle(key)
                } else {
                    const lastSelectedKey = selection.last()
                    const lastSelectedIndex = flatKeys.findIndex((key) => key === lastSelectedKey)
                    const currentSelectedIndex = flatKeys.findIndex((_key) => _key === key)
                    const [minIndex, maxIndex] = lastSelectedIndex > currentSelectedIndex
                        ? [currentSelectedIndex, lastSelectedIndex]
                        : [lastSelectedIndex + 1, currentSelectedIndex + 1]
                    flatKeys.slice(minIndex, maxIndex).forEach((_key) => {
                        toggle(_key)
                    })
                }
            } else if (selectionMode !== 'none') {
                setSelection([key])
            }
    }, [flatKeys, isContextMenuShown, onMouseDown, selection, selectionMode, setSelection, toggle])

    const handleItemContextMenu = React.useCallback(
        (event: React.MouseEvent<HTMLLIElement>, item: T, key: string, index: number) => {
            if (!selection.has(key)) {
                setActionTargets([key])
            } else {
                setActionTargets(selection.toArray())
            }
            if (typeof onContextMenu === 'function') {
                onContextMenu(event)
            }
        }, [onContextMenu, selection, setActionTargets])

    const handleContextMenuHide = React.useCallback(() => {
        setActionTargets([])
        setIsContextMenuShown(false)
    }, [])

    const handleContextMenuShow = React.useCallback(() => {
        setIsContextMenuShown(true)
    }, [])

    const toggleExpandGroup = React.useCallback((groupLabel: string) => {
        setExpandedGroups((expandedGroups) => (
            expandedGroups.includes(groupLabel)
                ? expandedGroups.filter((expandedGroup) => expandedGroup !== groupLabel)
                : [groupLabel, ...expandedGroups]
        ))
    }, [])

    const selectNext = React.useCallback(() => {
        if (selection.size === 1) {
            const [selectedKey] = selection.valueSeq().toArray()
            const keys = Object.values(grouped).flat()
            const selectedIndex = keys.findIndex((key) => key === selectedKey)
            if (selectedIndex < keys.length - 1) {
                setSelection([keys[selectedIndex + 1]])
            }
        }
    }, [grouped, selection, setSelection])

    const selectPrev = React.useCallback(() => {
        if (selection.size === 1) {
            const [selectedKey] = selection.valueSeq().toArray()
            const keys = Object.values(grouped).flat()
            const selectedIndex = keys.findIndex((key) => key === selectedKey)
            if (selectedIndex > 0) {
                setSelection([keys[selectedIndex - 1]])
            }
        }
    }, [grouped, selection, setSelection])

    const handleKeyDown: KeyboardEventHandler = React.useCallback((event) => {
        switch (event.key) {
            case 'ArrowDown':
                return selectNext()
            case 'ArrowUp':
                return selectPrev()
        }
    }, [selectNext, selectPrev])

    return (
        <ListWithContextMenu
            menuItems={contextMenuItems}
            onHide={handleContextMenuHide}
            onKeyDown={handleKeyDown}
            onShow={handleContextMenuShow}
        >{
            groups.map((groupLabel) => {
                const itemKeys = grouped[groupLabel] || []
                return <>
                    {groupLabel !== 'default' && (
                        <li
                            className='list-header-item'
                            key={'group-' + groupLabel}
                            onClick={() => toggleExpandGroup(groupLabel)}
                        >
                            <span className='expand-icon'>
                                <FontAwesomeIcon
                                    icon={
                                        expandedGroups.includes(groupLabel)
                                            ? faCaretDown
                                            : faCaretRight
                                    }
                                />
                            </span>
                            <span className='header-title'>
                                {groupLabel} ({itemKeys.length})
                            </span>
                        </li>
                    )}
                    {groupLabel === 'default' || expandedGroups.includes(groupLabel) ? itemKeys.map((key, index, keys) => {
                        const item = collection.index[key]
                        const prevKey = index === 0 ? '' : keys[index - 1]
                        const nextKey = index === keys.length - 1 ? '' : keys[index + 1]
                        return (
                            <ListItem
                                {...rest}
                                className={classNames({
                                    selected: selection.has(key),
                                    'selected-first': selection.has(key) && !selection.has(prevKey),
                                    'selected-last': selection.has(key) && !selection.has(nextKey),
                                    targeted: actionTargets.includes(key),
                                    'targeted-first': actionTargets.includes(key) && !actionTargets.includes(prevKey),
                                    'targeted-last': actionTargets.includes(key) && !actionTargets.includes(nextKey),
                                })}
                                id={`${key}`}
                                index={index}
                                item={item}
                                key={`${key}`}
                                // onClick={(event) => handleItemClick(event, item, index)}
                                onContextMenu={(event) => handleItemContextMenu(event, item, key, index)}
                                onMouseDown={(event) => handleItemMouseDown(event, item, key, index)}
                                selected={selection.has(key)}
                                targeted={actionTargets.includes(key)}
                            >
                                {children}
                            </ListItem>
                        )
                    }) : null}
                </>
            })
        }</ListWithContextMenu>
    )
}

export interface ListItemProps<T>
extends Omit<React.HTMLAttributes<HTMLLIElement>, 'children'> {
    children: (item: T) => JSX.Element
    index: number
    item: T
    selected?: boolean | undefined
    targeted?: boolean | undefined
}

export function ListItem<T>({
    children,
    className,
    index,
    item,
    selected = false,
    targeted = false,
    ...rest
}: ListItemProps<T>) {
    return (
        <li
            {...rest}
            className={classNames('list-item', className, { focused: targeted, selected })}
            tabIndex={index}
        >
            {children(item)}
        </li>
    )
}

const ListWithContextMenu = withContextMenu6(
    ({ children, ...props }: { children: React.ReactNode } & React.HTMLAttributes<HTMLUListElement>) => {
        return (
            <ul className='list-view' {...props}>
                {children}
            </ul>
        )
    }
)
