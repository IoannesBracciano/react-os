import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { filter, fromEvent, take, tap } from 'rxjs'
import './Popup.css'

export interface PopupProps {
    anchor?: [
        'mouse-bottom' | 'mouse-top' | 'target-bottom' | 'target-top',
        'mouse-left' | 'mouse-right' | 'target-left' | 'target-right'
    ]
    children: React.ReactNode
    onHide?: () => void
    onShow?: ([x, y]: [number, number]) => any
    target: Element | null
    trigger: 'click' | 'contextmenu' | 'mouseover'
}

export function Popup({
    anchor = ['mouse-bottom', 'mouse-left'],
    children,
    onHide,
    onShow,
    target,
    trigger,
}: PopupProps) {
    const [open, setOpen] = useState(false)
    const [pos, setPos] = useState<[number,number]>([NaN, NaN])
    const [rect, setRect] = useState(target ? target.getBoundingClientRect() : new DOMRect())
    const popupRef = useRef<HTMLDivElement>(null)

    const containerEl = document.getElementById('context-menu-container')

    useEffect(() => {
        if (target) {
            setRect(target.getBoundingClientRect())
        }
    }, [target])

    useEffect(() => {
        if (target) {
            const targetOut = trigger === 'mouseover' ? target : document
            const triggerOut = trigger === 'mouseover' ? 'mouseout' : 'mousedown'
            const show$ = fromEvent<MouseEvent>(target, trigger).pipe(
                filter((mouseEvent) => mouseEvent.composedPath()[0] === target),
                tap((mouseEvent) => mouseEvent.preventDefault()),
            )
            const subscr = show$.subscribe((ev) => {
                if (popupRef && popupRef.current) {
                    const popupEl = popupRef.current
                    fromEvent(targetOut, triggerOut).pipe(
                        filter((event) => !event.composedPath().includes(popupEl)),
                        take(1),
                    ).subscribe(() => {
                        setOpen(false)
                    })
                    const posX = anchor[1] === 'target-left' ? rect.left : anchor[1] === 'target-right' ? rect.right : ev.clientX
                    const posY = anchor[0] === 'target-bottom' ? rect.bottom : ev.clientY
                    setPos([posX, posY])
                    setOpen(true)
                }
                })
                
            return () => subscr.unsubscribe()
        }
    }, [anchor, onShow, popupRef, rect, target, trigger])

    useEffect(() => {
        if (typeof onHide === 'function' && !open) {
            onHide()
        } else if (typeof onShow === 'function' && open) {
            onShow(pos)
        }
    }, [onHide, onShow, open, pos])

    return (
        ReactDOM.createPortal(
            <div
                className='popup-base'
                ref={popupRef}
                style={{
                    display: open ? 'block' : 'none',
                    left: `${pos[0]}px`,
                    top: `${pos[1]}px`,
                    transform: anchor[0] === 'mouse-top' || anchor[0] === 'target-top'
                        ? 'translateY(-100%)'
                        : anchor[1] === 'mouse-right' || anchor[1] === 'target-right'
                        ? 'translateX(-100%)'
                        : undefined,
                }}
            >
                <div className='popup-pane'>
                    {children}
                </div>
            </div>,
            containerEl as HTMLElement,
        )
    )
}