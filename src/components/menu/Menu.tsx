import { faTrashCan, IconDefinition } from '@fortawesome/free-regular-svg-icons'
import { faDeleteLeft, faShare, faTerminal } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { any } from 'prop-types'
import { createElement, ForwardedRef, MouseEvent, ReactNode, useCallback } from 'react'
import { Action } from '../window/ActionContext'
import './Menu.css'

export interface MenuItem {
    action?: Action & { payload?: any }
    as?: string
    disabled?: boolean
    icon?: IconDefinition
    key: any
    keys?: string
    label: ReactNode
    onAction?: () => void
}

export interface MenuProps {
    items: MenuItem[]
    onItemClicked?: (item: MenuItem, event: MouseEvent) => any
    onItemMouseDown?: (item: MenuItem, event: MouseEvent) => any
    forwardedRef?: ForwardedRef<HTMLUListElement>
}

export function Menu({
    items,
    onItemClicked,
    onItemMouseDown,
    forwardedRef,
}: MenuProps) {
    const onMenuItemClicked: (item: MenuItem, event: MouseEvent) => any =
        useCallback((item, event) => {
            if (typeof onItemClicked === 'function') {
                onItemClicked(item, event)
            }
        }, [onItemClicked])

        const onMenuItemMouseDown: (item: MenuItem, event: MouseEvent) => any =
        useCallback((item, event) => {
            if (typeof onItemMouseDown === 'function') {
                onItemMouseDown(item, event)
            }
        }, [onItemMouseDown])

    return (
        <ul className='menu' ref={forwardedRef}>{
            items.map((item) => (
                <li
                    className={classNames('menu-item', {
                        disabled: item.disabled,
                    })}
                    key={item.key}
                    onClick={(event) => !item.disabled && onMenuItemClicked(item, event)}
                    onMouseDown={(event) => !item.disabled && onMenuItemMouseDown(item, event)}
                >{item.icon &&
                    <span className='menu-item-icon'>
                        <FontAwesomeIcon icon={item.icon} />
                    </span>
                    }
                    {/* <span className='menu-item-label'>{label}</span> */}
                    {createElement(item.as || 'span', { className: 'menu-item-label' }, item.label)}
                    {item.keys ? (
                        <span className='menu-item-keys'>
                            
                                {item.keys.split('+').map((key) => (
                                    <small>{
                                    key === 'cmd'
                                        ? (<FontAwesomeIcon icon={faTerminal} /> )
                                        : key === 'backspace'
                                        ? (<FontAwesomeIcon icon={faDeleteLeft} /> )
                                        : key + ' '
                                    }</small>
                                ))}
                        </span>
                    ) : null}
                </li>
            ))
        }</ul>
    )
}

export type CommonMenuItemKey = 'delete' | 'forward' | 'move'

const CommonMenuItems: Readonly<Record<CommonMenuItemKey, MenuItem>> = {
    'delete': {
        icon: faTrashCan,
        key: 'delete',
        label: 'Delete',
    },
    'forward': {
        icon: faShare,
        key: 'forward',
        label: 'Forward',
    },
    'move': {
        key: 'move',
        label: 'Move',
    },
}

export function getCommonMenuItem(key: CommonMenuItemKey) {
    return CommonMenuItems[key]
}
