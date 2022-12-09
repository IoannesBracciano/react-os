import React, { ComponentType, Dispatch, MouseEvent, MouseEventHandler, ReactText, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { CalendarEventCollectionState } from '../../apps/calendar/state'
import { useActionContext } from '../application/context'
import { CollectionContextType, useCollectionContext } from '../collection/context'
import { Menu, MenuItem, MenuProps } from '../menu/Menu'
import { ActionContext } from '../window/ActionContext'
import './ContextMenu.css'

// export interface ContextMenu {
//     items: MenuItem[]
// }

export type Anchor = DOMRect

export interface ContextMenuProps {
    anchor?: Anchor
    items?: MenuItem[]
    onSelect?: (item: MenuItem) => void
    show?: boolean
}

export interface ContextMenuState {
    anchor?: Anchor
    items?: MenuItem[]
    payload?: any
    show: boolean
}

export interface ContextMenuState2 {
    anchor: Anchor
    getItems: (item: any) => MenuItem[]
}

export function ContextMenu({
    anchor = new DOMRect(),
    items = [],
    onSelect,
    show = false,
}: ContextMenuProps) {
    const contextMenuContainerEl = useMemo(() => (
        document.getElementById('context-menu-container')
    ), [])
    const onMenuItemClick = useCallback((item: MenuItem, event: React.MouseEvent) => {
        if (typeof onSelect === 'function') {
            onSelect(item)
        }
        if (typeof item.onAction === 'function') {
            item.onAction()
        }
    }, [onSelect])

    const onMenuItemMouseDown = useCallback((item: MenuItem, event: React.MouseEvent) => {
        event.stopPropagation()
    }, [])

    return (contextMenuContainerEl && show && ReactDOM.createPortal(
        <div className='context-menu' style={{
            left: anchor.x,
            position: 'absolute',
            top: anchor.y,
        }}>
            <Menu
                items={items}
                onItemClicked={onMenuItemClick}
                onItemMouseDown={onMenuItemMouseDown}
            />
        </div>,
        contextMenuContainerEl,
    ))
}

// const MenuWithRef = forwardRef((
//     props: MenuProps,
//     ref: ForwardedRef<HTMLUListElement>,
// ) => <Menu {...props} forwardedRef={ref} />)

export interface WithContextMenuProps {
    menuItems: MenuItem[]
    onHide?: (() => void) | undefined
    onMenuItemSelect?: ((item: MenuItem) => void) | undefined
    onShow?: (() => void) | undefined
}

export function withContextMenu6<P>(
    Component: React.ComponentType<P>,
) {
    return function ({ menuItems, onHide, onMenuItemSelect, onShow, ...props }: P & WithContextMenuProps) {
        const popupRef = useRef<HTMLDivElement>(null)
        const [anchor, setAnchor] = useState<DOMRect>(new DOMRect())
        const [show, setShow] = useState(false)
        const contextMenuContainerEl = useMemo(() => (
            document.getElementById('context-menu-container')
        ), [])
    
        useEffect(() => {
            if (popupRef && popupRef.current && show) {
                popupRef.current.animate([
                    { opacity: '0', transform: 'scale(0.95)' },
                    { opacity: '1', transform: 'scale(1)' },
                ], {
                    duration: 100,
                    iterations: 1,
                    easing: 'cubic-bezier(0, 0.5, 0.5, 1)',
                  })
            }
        }, [popupRef, show])

        const _onContextMenu: React.MouseEventHandler = useCallback((event) => {
            if (event && event.type === 'contextmenu') {
                event.preventDefault && event.preventDefault()
                setAnchor(DOMRect.fromRect({
                    x: event.pageX,
                    y: event.pageY
                }))
                setShow(true)
            }
            if (typeof onShow === 'function') {
                onShow()
            }
        }, [])

        const onMenuItemClick = useCallback((item: MenuItem, event: React.MouseEvent) => {
            if (typeof onMenuItemSelect === 'function') {
                onMenuItemSelect(item)
            }
            if (typeof item.onAction === 'function') {
                item.onAction()
            }
            if (typeof onHide === 'function') {
                onHide()
            }
            setShow(false)
        }, [onHide, onMenuItemSelect])

        const onMenuItemMouseDown = useCallback((item: MenuItem, event: React.MouseEvent) => {
            event.stopPropagation()
        }, [])

        // const onMouseDown: MouseEventHandler = useCallback((event) => {
        //     if (show) {
        //         event.stopPropagation()
        //         if (typeof onHide === 'function') {
        //             onHide()
        //         }
        //         setShow(false)
        //     }
        // }, [onHide, show])

        useEventListener('mousedown', document, useCallback((event) => {
            if (show) {
                if (typeof onHide === 'function') {
                    onHide()
                }
                setShow(false)
            }
        }, [onHide, show]))


        return (<>
            <Component {...props as P} onContextMenu={_onContextMenu} />
            {contextMenuContainerEl && show && ReactDOM.createPortal(
                <div 
                    className='context-menu'
                    ref={popupRef}
                    style={{
                    left: anchor.x,
                    position: 'absolute',
                    top: anchor.y,
                }}>
                    <Menu
                        items={menuItems}
                        onItemClicked={onMenuItemClick}
                        onItemMouseDown={onMenuItemMouseDown}
                    />
                </div>,
                contextMenuContainerEl,
            )}
        </>)
    }

}

export function withContextMenu5<P>(
    actionContextId: string,
    Component: React.ComponentType<P>,
) {
    return function (props: P & { onContextMenu?: MouseEventHandler | undefined }) {
        const popupRef = useRef<HTMLDivElement>(null)
        const [anchor, setAnchor] = useState<DOMRect>(new DOMRect())
        const [show, setShow] = useState(false)
        const contextMenuContainerEl = useMemo(() => (
            document.getElementById('context-menu-container')
        ), [])
        const { actionItems: actions, actionTargets, dispatch } = useActionContext(actionContextId)

        const filteredActions = actions.filter((action) => (
            typeof action.visible === 'function'
                ? action.visible(actionTargets)
                : !!action.visible
        ))
    
        useEffect(() => {
            if (popupRef && popupRef.current && show) {
                popupRef.current.animate([
                    { opacity: '0', transform: 'scale(0.95)' },
                    { opacity: '1', transform: 'scale(1)' },
                ], {
                    duration: 100,
                    iterations: 1,
                    easing: 'cubic-bezier(0, 0.5, 0.5, 1)',
                  })
            }
        }, [popupRef, show])

        const _onContextMenu: React.MouseEventHandler = useCallback((event) => {
            if (event && event.type === 'contextmenu') {
                event.preventDefault && event.preventDefault()
                setAnchor(DOMRect.fromRect({
                    x: event.pageX,
                    y: event.pageY
                }))
                setShow(true)
            }
            if (typeof props.onContextMenu === 'function') {
                props.onContextMenu(event)
            }
        }, [props])

        const onMenuItemClick = useCallback((item: MenuItem, event: React.MouseEvent) => {
            if (item.action) {
                dispatch({
                    type: item.action.type,
                    payload: actionTargets,
                })
            }
            setShow(false)
        }, [actionTargets, dispatch])

        const onMenuItemMouseDown = useCallback((item: MenuItem, event: React.MouseEvent) => {
            event.stopPropagation()
        }, [])

        useEventListener('mousedown', document, useCallback(() => {
            if (show) {
                setShow(false)
            }
        }, [show]))


        return (<>
            <Component {...props} onContextMenu={_onContextMenu} />
            {contextMenuContainerEl && show && ReactDOM.createPortal(
                <div 
                    className='context-menu'
                    ref={popupRef}
                    style={{
                    left: anchor.x,
                    position: 'absolute',
                    top: anchor.y,
                }}>
                    <Menu
                        items={filteredActions}
                        onItemClicked={onMenuItemClick}
                        onItemMouseDown={onMenuItemMouseDown}
                    />
                </div>,
                contextMenuContainerEl,
            )}
        </>)
    }

}

export function withContextMenu4<P>(
    Component: ComponentType<P>,
    getItems: (item: any) => MenuItem[],
    collectionContextKey: string,
) {
    return function (props: P) {
        const popupRef = useRef<HTMLDivElement>(null)
        const [anchor, setAnchor] = useState<DOMRect>(new DOMRect())
        const [items, setItems] = useState<MenuItem[]>([])
        const [show, setShow] = useState(false)
        const contextMenuContainerEl = useMemo(() => (
            document.getElementById('context-menu-container')
        ), [])
        const { state, dispatch } = useCollectionContext(collectionContextKey)
    
        useEffect(() => {
            if (popupRef && popupRef.current && show) {
                popupRef.current.animate([
                    { opacity: '0', transform: 'scale(0.95)' },
                    { opacity: '1', transform: 'scale(1)' },
                ], {
                    duration: 100,
                    iterations: 1,
                    easing: 'cubic-bezier(0, 0.5, 0.5, 1)',
                  })
            }
        }, [popupRef, show])

        useEffect(() => {
            const items = getItems(state.focused)
            setItems(items)
        }, [state.focused])

        const _onContextMenu: React.MouseEventHandler = useCallback((event) => {
            if (event && event.type === 'contextmenu') {
                event.preventDefault && event.preventDefault()
                setAnchor(DOMRect.fromRect({
                    x: event.pageX,
                    y: event.pageY
                }))
                setShow(true)
            }
        }, [])

        const onMenuItemClick = useCallback((item: MenuItem, event: React.MouseEvent) => {
            if (item.action) {
                dispatch({
                    type: item.action.type,
                    payload: item.action.payload,
                })
            }
            setShow(false)
        }, [dispatch])

        const onMenuItemMouseDown = useCallback((item: MenuItem, event: React.MouseEvent) => {
            event.stopPropagation()
        }, [])

        useEventListener('mousedown', document, useCallback(() => {
            if (show) {
                setShow(false)
            }
        }, [show]))


        return (<>
            <Component {...props} onContextMenu={_onContextMenu} />
            {contextMenuContainerEl && show && ReactDOM.createPortal(
                <div 
                    className='context-menu'
                    ref={popupRef}
                    style={{
                    left: anchor.x,
                    position: 'absolute',
                    top: anchor.y,
                }}>
                    <Menu
                        items={items}
                        onItemClicked={onMenuItemClick}
                        onItemMouseDown={onMenuItemMouseDown}
                    />
                </div>,
                contextMenuContainerEl,
            )}
        </>)
    }

}

export function withContextMenu3<P, T extends keyof P>(
    Component: ComponentType<P>,
    onContextMenu: (...args: any[]) => ContextMenuState,
    collectionContextKey: string,
) {
    return function (props: P) {
        const popupRef = useRef<HTMLDivElement>(null)
        const [anchor, setAnchor] = useState<DOMRect>(new DOMRect())
        const [items, setItems] = useState<MenuItem[]>([])
        const [show, setShow] = useState(false)
        const contextMenuContainerEl = useMemo(() => (
            document.getElementById('context-menu-container')
        ), [])
        const { dispatch } = useCollectionContext(collectionContextKey)

        useEffect(() => {
            if (popupRef && popupRef.current && show) {
                popupRef.current.animate([
                    { opacity: '0', transform: 'scale(0.95)' },
                    { opacity: '1', transform: 'scale(1)' },
                ], {
                    duration: 100,
                    iterations: 1,
                    easing: 'cubic-bezier(0, 0.5, 0.5, 1)',
                  })
            }
        }, [popupRef, show])

        const _onContextMenu = useCallback((...args: any[]) => {
            if (typeof onContextMenu === 'function') {
                const { anchor = new DOMRect(), items = [], show } = onContextMenu(...args)
                if (show) {
                    args[0] && args[0].preventDefault && args[0].preventDefault()
                    setAnchor(anchor)
                    setItems(items)
                }
                setShow(show)
            }
        }, [])

        const onMenuItemClick = useCallback((item: MenuItem, event: React.MouseEvent) => {
            if (item.action) {
                dispatch({
                    type: item.action.type,
                    payload: item.action.payload,
                })
            }
            setShow(false)
        }, [dispatch])

        const onMenuItemMouseDown = useCallback((item: MenuItem, event: React.MouseEvent) => {
            event.stopPropagation()
        }, [])

        useEventListener('mousedown', document, useCallback(() => {
            if (show) {
                setShow(false)
            }
        }, [show]))


        return (<>
            <Component {...props} onContextMenu={_onContextMenu} />
            {contextMenuContainerEl && show && ReactDOM.createPortal(
                <div 
                    className='context-menu'
                    ref={popupRef}
                    style={{
                    left: anchor.x,
                    position: 'absolute',
                    top: anchor.y,
                }}>
                    <Menu
                        items={items}
                        onItemClicked={onMenuItemClick}
                        onItemMouseDown={onMenuItemMouseDown}
                    />
                </div>,
                contextMenuContainerEl,
            )}
        </>)
    }

}

export function withContextMenu2<P, T extends keyof P>(
    Component: ComponentType<P>,
    onContextMenu: (...args: any[]) => ContextMenuState,
    onEvent: T[],
) {
    return function (props: P) {
        const popupRef = useRef<HTMLDivElement>(null)
        const [anchor, setAnchor] = useState<DOMRect>(new DOMRect())
        const [items, setItems] = useState<MenuItem[]>([])
        const [payload, setPayload] = useState<any>()
        const [show, setShow] = useState(false)
        const contextMenuContainerEl = useMemo(() => (
            document.getElementById('context-menu-container')
        ), [])
        const { dispatch } = useContext(ActionContext)

        useEffect(() => {
            if (popupRef && popupRef.current && show) {
                popupRef.current.animate([
                    { opacity: '0', transform: 'scale(0.95)' },
                    { opacity: '1', transform: 'scale(1)' },
                ], {
                    duration: 100,
                    iterations: 1,
                    easing: 'cubic-bezier(0, 0.5, 0.5, 1)',
                  })
            }
        }, [popupRef, show])

        const _onContextMenu = useCallback((...args: any[]) => {
            if (typeof onContextMenu === 'function') {
                const { anchor = new DOMRect(), items = [], payload, show } = onContextMenu(...args)
                if (show) {
                    args[0] && args[0].preventDefault && args[0].preventDefault()
                    setAnchor(anchor)
                    setItems(items)
                    setPayload(payload)
                }
                setShow(show)
            }
        }, [])

        const onMenuItemClick = useCallback((item: MenuItem, event: React.MouseEvent) => {
            if (item.action) {
                dispatch({ type: item.action.type, payload: item.action.payload || payload })
            }
            setShow(false)
        }, [dispatch, payload])

        const onMenuItemMouseDown = useCallback((item: MenuItem, event: React.MouseEvent) => {
            event.stopPropagation()
        }, [])

        useEventListener('mousedown', document, useCallback(() => {
            if (show) {
                setShow(false)
            }
        }, [show]))

        const contextMenuHandlers = onEvent.reduce((handlers, eventType) => ({ ...handlers, [eventType]: _onContextMenu }), {})

        return (<>
            <Component {...{ ...props, ...contextMenuHandlers }} />
            {contextMenuContainerEl && show && ReactDOM.createPortal(
                <div 
                    className='context-menu'
                    ref={popupRef}
                    style={{
                    left: anchor.x,
                    position: 'absolute',
                    top: anchor.y,
                }}>
                    <Menu
                        items={items}
                        onItemClicked={onMenuItemClick}
                        onItemMouseDown={onMenuItemMouseDown}
                    />
                </div>,
                contextMenuContainerEl,
            )}
        </>)
    }

}

export function withContextMenu<P>(menuProps: MenuProps, Component: ComponentType<P>) {
    return (props: P & { onContextMenuItemClick?: (item: MenuItem, event: React.MouseEvent) => any }) => {
        const { onContextMenuItemClick, ...forwardedProps } = props
        const [anchor, setAnchor] = useState({ x: 0, y: 0 })
        const [show, setShow] = useState(false)
        const contextMenuContainerEl = useMemo(() => (
            document.getElementById('context-menu-container')
        ), [])

        useEventListener('mousedown', document, useCallback(() => {
            if (show) {
                setShow(false)
            }
        }, [show]))

        const onContextMenu = useCallback((event: MouseEvent) => {
            event.preventDefault()
            setAnchor({ x: (event as MouseEvent).pageX, y: (event as MouseEvent).pageY })
            setShow(true)
        }, [])

        const onMenuItemClick = useCallback((item: MenuItem, event: React.MouseEvent) => {
            if (typeof onContextMenuItemClick === 'function') {
                onContextMenuItemClick(item, event)
            }
            setShow(false)
        }, [onContextMenuItemClick, setShow])

        const onMenuItemMouseDown = useCallback((item: MenuItem, event: React.MouseEvent) => {
            event.stopPropagation()
        }, [])
    
        return (<>
            <div className='context-menu-scope' onContextMenu={onContextMenu}>
                <Component {...(forwardedProps as P & JSX.IntrinsicAttributes)} />
            </div>
            {contextMenuContainerEl && show && ReactDOM.createPortal(
                <div className='context-menu' style={{
                    left: anchor.x,
                    position: 'absolute',
                    top: anchor.y,
                }}>
                    <Menu {...menuProps} onItemClicked={onMenuItemClick} onItemMouseDown={onMenuItemMouseDown}/>
                </div>,
                contextMenuContainerEl,
            )}
        </>)
    }
}

function useEventListener(type: string, target: EventTarget | undefined | null, callback: EventListener, capture = false) {
    useEffect(() => {
        if (target) {
            target.addEventListener(type, callback, capture)
            return () => target.removeEventListener(type, callback, capture)
        }
    }, [callback, capture, target, type])
}
