import React from 'react'
import { ControlledPopover } from '../popover'
import { Alignment, pad } from '../popover/rect'
import './tooltip.css'

export interface TooltipProps<P> {
    align?: Alignment
    content: (props: P) => string
    delayIn?: number | undefined
    delayOut?: number | undefined
    textWrap?: boolean | undefined
    triggerIn?: string | undefined
    triggerOut?: string | undefined
}

export function withTooltip<P>(
    Component: React.ComponentType<P>, {
        align = 'center bottom',
        content,
        delayIn = 1000,
        delayOut = 500,
        textWrap = false,
        triggerIn = 'onMouseEnter',
        triggerOut = 'onMouseLeave',
    }: TooltipProps<P>,
) {
    return (props: P) => {
        const anchorRef = React.useRef<HTMLDivElement>(null)
        const anchorRect = anchorRef?.current?.getBoundingClientRect() || new DOMRect()
        const [show, setShow] = React.useState(false)
        const [hideTimeout, setHideTimeout] = React.useState<NodeJS.Timeout | null>(null)
        const [showTimeout, setShowTimeout] = React.useState<NodeJS.Timeout | null>(null)

        const handleTriggerInEvent = React.useCallback(() => {
            if (hideTimeout !== null) {
                clearTimeout(hideTimeout)
            } 
            if (showTimeout !== null) {
                clearTimeout(showTimeout)
            } 
            const timeout = setTimeout(() => {
                setShow(true)
            }, delayIn)
            setHideTimeout(null)
            setShowTimeout(timeout)
        }, [hideTimeout, showTimeout])

        const handleTriggerOutEvent = React.useCallback(() => {
            if (hideTimeout !== null) {
                clearTimeout(hideTimeout)
            }
            if (showTimeout !== null) {
                clearTimeout(showTimeout)
            } 
            const timeout = setTimeout(() => {
                setShow(false)
            }, delayOut)
            setHideTimeout(timeout)
            setShowTimeout(null)
        }, [hideTimeout, showTimeout])
    
        return <>
            <div className='anchor-wrapper' ref={anchorRef}>
                <Component
                    {...props}
                    {...{ [triggerIn]: handleTriggerInEvent }}
                    {...{ [triggerOut]: handleTriggerOutEvent }}
                />
            </div>
            <ControlledPopover
                align={align}
                anchor={pad(anchorRect, { top: 8 })}
                show={show}
            >
                <div className='tooltip'>
                    <span className='tooltip-content'>
                        {content(props)}
                    </span>
                </div>
            </ControlledPopover>
        </>
    }
}