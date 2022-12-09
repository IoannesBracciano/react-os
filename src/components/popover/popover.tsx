import classNames from 'classnames'
import React, { HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { useClientRect } from '../../hooks/useClientRect'
import { useCurrent } from '../../hooks/useCurrent'
import './popover.css'
import { align, Alignment } from './rect'

export interface ControlledPopoverProps {
    align?: Alignment
    anchor: DOMRect | DOMRectInit;
    children: React.ReactNode
    gap?: number,
    keyframes?: any[] | undefined
    show?: boolean
}

export const ControlledPopover = React.forwardRef(({
    align: alignment = 'left bottom',
    anchor,
    children,
    // gap = 12,
    keyframes,
    show,
}: ControlledPopoverProps,
ref: React.ForwardedRef<HTMLDivElement>,
) => {
    const popoverRef = useRef<HTMLDivElement>(null)
    const [popoverRect, setPopoverRect] = React.useState<DOMRect>(new DOMRect())
    const alignedRect = align(popoverRect, anchor, alignment)
    const containerEl = document.getElementById('popup-portal')

    React.useEffect(() => {
        if (show && popoverRef && popoverRef.current) {
            setPopoverRect(popoverRef.current.getBoundingClientRect())
        }
    }, [show])

    React.useEffect(() => {
        if (popoverRef && popoverRef.current && show) {
            PopoverShowAnimation.animate(popoverRef.current)
        }
    }, [show])

    return containerEl && ReactDOM.createPortal(!!show &&
        <div
            className='popover'
            ref={popoverRef}
            style={{
                left: `${alignedRect.x}px`,
                top: `${alignedRect.y}px`,
            }}
        >
            <div className='popover-pane'>
                {children}
            </div>
        </div>,
        containerEl as HTMLElement,
    )
})

export interface PopoverProps<T extends Element> extends HTMLAttributes<HTMLDivElement> {
    align?: Alignment
    children: React.ReactNode
    anchorRef: React.RefObject<T>
    show?: boolean
}

export function Popover<T extends Element>({
    align: alignment = 'center bottom',
    children,
    anchorRef,
    show = false,
    ...attrs
}: PopoverProps<T>) {
    const popoverRef = useRef<HTMLDivElement>(null)
    const popoverRect = useClientRect(popoverRef) || new DOMRect()
    const anchorRect = useClientRect(anchorRef) || new DOMRect()
    const alignedRect = align(popoverRect, anchorRect, alignment)
    const containerEl = document.getElementById('popup-portal')

    return popoverRect && anchorRect && show ? ReactDOM.createPortal(
        <div {...attrs}
            className={classNames('popover', attrs.className)}
            ref={popoverRef}
            style={{
                left: `${alignedRect.x}px`,
                top: `${alignedRect.y}px`,
            }}
        >
            {children}
        </div>,
        containerEl as HTMLElement,
    ) : null
}

const PopoverShowAnimation = Object.freeze({
    get keyframes() {
        return [
            { opacity: '0.5', transform: 'translateY(0px)' },
            { opacity: '1', transform: 'translateY(0)' },
        ]
    },
    get options() {
        return {
            duration: 100,
            iterations: 1,
            easing: 'cubic-bezier(0, 0.5, 0.5, 1)',
        }
    },
    animate(element: HTMLDivElement) {
        element.animate(
            PopoverShowAnimation.keyframes,
            PopoverShowAnimation.options,
        )
    },
})

// export function withPopup<T extends Element, P extends DOMAttributes<T>>(
//     { align, children, trigger }: { align: [AlignH, AlignV], children: React.ReactNode, trigger: 'onClick' | 'onContextMenu' | 'onMouseDown' | 'onMouseEnter' },
//     Component: React.ForwardRefExoticComponent<P>,
// ) {
//     return (props: P) => {
//         const targetRef = useRef(null)
//         const [show, setShow] = useState(false)
//         const onTrigger: React.MouseEventHandler<T> = useCallback((event) => {
//             setShow(true)
//             const cb = props[trigger]
//             if (typeof cb === 'function') {
//                 cb(event)
//             }
//         }, [props])
//         // const hide = trigger === 'onClick' ? ''
//         return (<>
//             <Component {...props} {...{ [trigger]: onTrigger }} ref={targetRef} />
//             <Popup
//                 align={align}
//                 targetRef={targetRef}
//                 show={show}
//             >
//                 {children}
//             </Popup>
//         </>)
//     }
// }
