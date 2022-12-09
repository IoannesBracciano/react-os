import './Window.css'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { MouseEventHandler, RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { filter, fromEvent, map, switchMap, takeUntil, tap } from 'rxjs'
import { useStorage } from '../../sdk/storage'
import LauncherSvc from '../../system/services/launcher'
import { DragEvent, DragStartEvent } from './events/drag-event'
import { ResizeDirection, ResizeEvent, ResizeStartEvent } from './events/resize-event'
import { useDispatch, useSelector } from 'react-redux'
import { focusActor, selectFocusedActor, unstageActor } from '../../system/director/slice'
import classNames from 'classnames'

export interface WindowProps {
    appId: string
    defaultRect?: DOMRect | DOMRectInit
    children: React.ReactNode
    rect?: DOMRect | DOMRectInit
    resize?: 'horizontal' | 'vertical' | 'both' | 'none'
}

const DEFAULT_WINDOW_RECT = {
    height: 400,
    width: 600,
    x: 100,
    y: 100,
}

export function Window({
    appId,
    defaultRect = DEFAULT_WINDOW_RECT,
    children,
    rect,
    resize = 'both',
}: WindowProps) {
    const windowElRef = useRef<HTMLDivElement>(null)

    useDrag<HTMLDivElement>(windowElRef)

    const handleRefs = useResize<HTMLDivElement, HTMLDivElement>(windowElRef)

    const [lastRect, setLastRect] = useStorage(
        `/system/env/${appId}/lastRect`,
        DOMRect.fromRect(defaultRect),
    )

    const [controlledRect, setControlledRect] = useState(rect)

    const dispatch = useDispatch()

    const focusedActor = useSelector(selectFocusedActor)

    useEffect(() => {
        if (rect) {
            setControlledRect((controlledRect) => DOMRect.fromRect({
                ...lastRect,
                ...controlledRect,
                ...rect,
            }))
        } else {
            setControlledRect(undefined)
        }
    }, [lastRect, rect])

    const onWindowCloseButtonClicked: MouseEventHandler<HTMLButtonElement> =
        useCallback(() => {
            if (windowElRef && windowElRef.current) {
                const _rect = windowElRef.current.getBoundingClientRect()
                // setLastRect(_rect)
                setLastRect(DOMRect.fromRect({
                    height: resize === 'none' || resize === 'horizontal' ? defaultRect.height : _rect.height,
                    width: resize === 'none' || resize === 'vertical' ? defaultRect.width : _rect.width,
                    x: _rect.x,
                    y: _rect.y,
                }))
            }
            // make sure useEffect for rect storage is called before
            // destroying window component
            setTimeout(() => {
                LauncherSvc.close(appId)
                dispatch(unstageActor({ id: appId }))
            }, 0)
        }, [appId, defaultRect, dispatch, resize, setLastRect, windowElRef])
    
    const handleMouseDown: MouseEventHandler<HTMLDivElement> = useCallback(() => {
        dispatch(focusActor({ id: appId }))
    }, [appId, dispatch])

    return (
        <div
            className={classNames('window-base', {
                focused: focusedActor?.id === appId
            })}
            id={appId + '-app'}
            onMouseDown={handleMouseDown}
            ref={windowElRef}
            style={{
                height: controlledRect?.height || lastRect.height,
                left: lastRect.x,
                top: lastRect.y,
                width: controlledRect?.width || lastRect.width,
            }}
        >
            <WindowCloseButton onClick={onWindowCloseButtonClicked} />
            {children}
            {(resize === 'vertical' || resize === 'both') && (<>
                <div className='resize-handler vertical north' ref={handleRefs.n}></div>
                <div className='resize-handler vertical south' ref={handleRefs.s}></div>
            </>)}
            {(resize === 'horizontal' || resize === 'both') && (<>
                <div className='resize-handler horizontal east' ref={handleRefs.e}></div>
                <div className='resize-handler horizontal west' ref={handleRefs.w}></div>
            </>)}
            {resize === 'both' && (<>
                <div className='resize-handler diagonal south-east' ref={handleRefs.se}></div>
                <div className='resize-handler diagonal south-west' ref={handleRefs.sw}></div>
                <div className='resize-handler diagonal north-east' ref={handleRefs.ne}></div>
                <div className='resize-handler diagonal north-west' ref={handleRefs.nw}></div>
            </>)}
        </div>
    )
}

interface WindowCloseButtonProps {
    onClick: MouseEventHandler<HTMLButtonElement>
}

function WindowCloseButton({ onClick }: WindowCloseButtonProps) {
    return (
        <button
            aria-label='Close'
            className='window-ctrl window-close-btn'
            onClick={onClick}
        >
            <FontAwesomeIcon icon={faXmark} />
        </button>
    )
}

function useDrag<T extends HTMLElement>(ref: RefObject<T>) {
    const [target, setTarget] = useState<T | null>(null)

    useEffect(() => {
        if (ref && ref.current) {
            setTarget(ref.current)
        }
    }, [ref])

    useEffect(() => {
        if (target) {
            const mouseDown$ = fromEvent<MouseEvent>(target, 'mousedown')
            const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove')
            const mouseUp$ = fromEvent<MouseEvent>(document, 'mouseup')
            const dragStart$ = mouseDown$.pipe(
                filter((ev) => {
                    if (!ev.defaultPrevented) {
                        const targetIndex = ev.composedPath().findIndex(
                            (eventTarget) => eventTarget === target
                        )
                        // if (targetIndex !== -1) {
                        //     return ev.composedPath().slice(0, targetIndex).reduce(
                        //         (shouldInitDrag, target) => (
                        //             shouldInitDrag && (target as Element).tagName === 'DIV'
                        //         ), true)
                        // }
                        return targetIndex !== -1 && targetIndex < 4
                    }
                    return false
                }),
                tap((mouseEvent) => mouseEvent.preventDefault()),
                map((mouseEvent) => DragStartEvent(mouseEvent, target))
            )
            const drag$ = dragStart$.pipe(
                switchMap((dragStartEvent) => mouseMove$.pipe(
                    tap((mouseEvent) => mouseEvent.preventDefault()),
                    map((mouseEvent) => DragEvent(mouseEvent, dragStartEvent)),
                    takeUntil(mouseUp$)
                ))
            )

            const subscription = drag$.subscribe((dragEvent) => {
                const rect = dragEvent.newTargetRect
                // const { height, left, top, width, ...rest } = Object.fromEntries(target.getAttribute('style')?.split(';').map((rule) => rule.trim().split(':')) || [])
                target.setAttribute('style', `height: ${rect.height}px; left: ${rect.x}px; top: ${rect.y}px; width: ${rect.width}px;`)
            })
            return () => subscription.unsubscribe()
        }
    }, [target])
}


export type ResizeHandle<T extends Element> = {
    direction: ResizeDirection
    element: T
}

function useResize<T extends Element, U extends Element>(
    resizeTargetRef: RefObject<T>,
) {
    const nHandleRef = useRef<U>(null)
    const neHandleRef = useRef<U>(null)
    const eHandleRef = useRef<U>(null)
    const seHandleRef = useRef<U>(null)
    const sHandleRef = useRef<U>(null)
    const swHandleRef = useRef<U>(null)
    const wHandleRef = useRef<U>(null)
    const nwHandleRef = useRef<U>(null)

    const [handles, setHandles] = useState<ResizeHandle<U>[]>([])

    useEffect(() => {
        const availableHandles: ResizeHandle<U>[] = [
            { direction: 'n', ref: nHandleRef },
            { direction: 'ne', ref: neHandleRef },
            { direction: 'e', ref: eHandleRef },
            { direction: 'se', ref: seHandleRef },
            { direction: 's', ref: sHandleRef },
            { direction: 'sw', ref: swHandleRef },
            { direction: 'w', ref: wHandleRef },
            { direction: 'nw', ref: nwHandleRef },
        ].filter(({ ref }) => ref && ref.current)
            .map(({ direction, ref }) => ({ direction, element: ref.current } as ResizeHandle<U>))
        setHandles(availableHandles)
    }, [nHandleRef,
        neHandleRef,
        eHandleRef,
        seHandleRef,
        sHandleRef,
        swHandleRef,
        wHandleRef,
        nwHandleRef,
    ])

    useEffect(() => {
        if (resizeTargetRef && resizeTargetRef.current) {
            const resizeTargetEl = resizeTargetRef.current
            const mouseDown$ = fromEvent<MouseEvent>(handles.map((handle) => handle.element), 'mousedown')
            const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove')
            const mouseUp$ = fromEvent<MouseEvent>(document, 'mouseup')

            const resizeStart$ = mouseDown$.pipe(
                tap((ev) => {
                    ev.preventDefault()
                    ev.stopPropagation()
                }),
                map((ev) => {
                    const handle = handles.find((handle) => handle.element === ev.target)
                    return ResizeStartEvent(ev, handle?.direction || 'se', resizeTargetEl)
                }),
            )
            const resize$ = resizeStart$.pipe(
                switchMap((resizeStartEvent) => mouseMove$.pipe(
                    tap((ev) => ev.preventDefault()),
                    map((mouseEvent) => ResizeEvent(mouseEvent, resizeStartEvent)),
                    takeUntil(mouseUp$)
                ))
            )

            const subscription = resize$.subscribe((resizeEvent) => {
                const rect = resizeEvent.newTargetRect
                resizeTargetEl.setAttribute('style', `height: ${rect.height}px; left: ${rect.x}px; top: ${rect.y}px; width: ${rect.width}px;`)
            })
            return () => subscription.unsubscribe()
        }
    }, [resizeTargetRef, handles])

    return {
        n: nHandleRef,
        ne: neHandleRef,
        e: eHandleRef,
        se: seHandleRef,
        s: sHandleRef,
        sw: swHandleRef,
        w: wHandleRef,
        nw: nwHandleRef,
    }
}
