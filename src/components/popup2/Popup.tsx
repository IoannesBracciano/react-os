import classNames from 'classnames'
import React, { HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { useClientRect } from '../../hooks/useClientRect'
import { useCurrent } from '../../hooks/useCurrent'
import './Popup.css'

type AlignH = 'after' | 'before' | 'center' | 'end' | 'left' | 'right' | 'start'

type AlignV = 'after' | 'before' | 'bottom' | 'center' | 'end' | 'start' | 'top'

function getAnchor(
    anchor: DOMRect | undefined,
    [alignH, alignV]: [AlignH, AlignV],
    popupRect: DOMRect | undefined = new DOMRect(),
) {
    if (anchor) {
        return ({
            x: alignH === 'after'
                ? anchor.x + anchor.width
                : alignH === 'before'
                ? anchor.x - popupRect.width
                : alignH === 'center'
                ? anchor.x - (popupRect.width / 2) + (anchor.width / 2)
                : alignH === 'left' || alignH === 'start'
                ? anchor.x
                : anchor.x - popupRect.width + anchor.width,
            y: alignV === 'after'
                ? anchor.y + anchor.height
                : alignV === 'before'
                ? anchor.y - popupRect.height
                : alignV === 'center'
                ? anchor.y - (popupRect.height / 2) + (anchor.height / 2)
                : alignV === 'top' || alignV === 'start'
                ? anchor.y
                : anchor.y - popupRect.height + anchor.height,
        })
    }
    return ({ x: 0, y: 0 })
}

export interface ControlledPopupProps {
    align?: [AlignH, AlignV]
    anchor: DOMRect;
    children: React.ReactNode
    gap?: number,
    show?: boolean
}

export const ControlledPopup = React.forwardRef(({
    align: [alignH, alignV] = ['left', 'bottom'],
    anchor,
    children,
    gap = 12,
    show,
}: ControlledPopupProps,
ref: React.ForwardedRef<HTMLDivElement>,
) => {
    const [popupRef, popupElement] = useCurrent<HTMLDivElement>()

    const [popupRect, setPopupRect] = useState<DOMRect>(new DOMRect())

    const left = useMemo(() => (
        alignH === 'after'
            ? anchor.x + anchor.width + gap
            : alignH === 'before'
            ? anchor.x - popupRect.width - gap
            : alignH === 'center'
            ? anchor.x - (popupRect.width / 2) + (anchor.width / 2)
            : alignH === 'left' || alignH === 'start'
            ? anchor.x
            : anchor.x - popupRect.width + anchor.width
    ), [alignH, anchor.width, anchor.x, gap, popupRect.width])

    const top = useMemo(() => (
        alignV === 'after'
            ? anchor.y + anchor.height + gap
            : alignV === 'before'
            ? anchor.y - popupRect.height - gap
            : alignV === 'center'
            ? anchor.y - (popupRect.height / 2) + (anchor.height / 2)
            : alignV === 'top' || alignV === 'start'
            ? anchor.y
            : anchor.y - popupRect.height + anchor.height
    ), [alignV, anchor.height, anchor.y, gap, popupRect.height])

    const containerEl = document.getElementById('popup-portal')

    useEffect(() => {
        if (popupElement) {
            const rect = popupElement.getBoundingClientRect()
            setPopupRect(DOMRect.fromRect({
                height: rect.height + gap,
                width: rect.width + gap,
                x: rect.x - gap,
                y: rect.y - gap,
            }))
        }
    }, [gap, popupElement])

    useEffect(() => {
        if (typeof ref === 'function') {
            ref(popupElement)
        } else if (typeof ref === 'object' && ref) {
            ref.current = popupElement
        }
    }, [popupElement, ref])

    useEffect(() => {
        if (popupElement && show) {
            popupElement.animate([
                { opacity: '0', transform: 'scale(0.95)' },
                { opacity: '1', transform: 'scale(1)' },
            ], {
                duration: 100,
                iterations: 1,
                easing: 'cubic-bezier(0, 0.5, 0.5, 1)',
              })
        }
    }, [popupElement, show])

    return (
        ReactDOM.createPortal(!!show &&
            <div
                className='popup'
                ref={popupRef}
                style={{
                    left: `${left}px`,
                    top: `${top}px`,
                }}
            >
                <div className='popup-pane'>
                    {children}
                    <div
                        className='popup-pointer'
                    ></div>
                </div>
            </div>,
            containerEl as HTMLElement,
        )
    )
})

export interface PopupProps<T extends Element> extends HTMLAttributes<HTMLDivElement> {
    align?: [AlignH, AlignV]
    children: React.ReactNode
    targetRef: React.RefObject<T>
    show?: boolean
}

export function Popup<T extends Element>({
    align = ['center', 'bottom'],
    children,
    targetRef,
    show = false,
    ...attrs
}: PopupProps<T>) {
    const popupRef = useRef<HTMLDivElement>(null)
    const popupRect = useClientRect(popupRef)
    const targetRect = useClientRect(targetRef)

    const containerEl = document.getElementById('popup-portal')

    return show ? ReactDOM.createPortal(
        <div {...attrs}
            className={classNames('popup', attrs.className)}
            ref={popupRef}
            style={{
                left: `${getAnchor(targetRect, align, popupRect).x}px`,
                top: `${getAnchor(targetRect,align, popupRect).y}px`,
            }}
        >
            {children}
        </div>,
        containerEl as HTMLElement,
    ) : null
}

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
