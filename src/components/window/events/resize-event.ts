export type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw'


export type ResizeStartEvent = {
    direction: ResizeDirection | undefined
    handleEl: Element | undefined
    resizeOriginClientX: number
    resizeOriginClientY: number
    resizeTarget: Element
    targetRect: DOMRect
    wrappedEvent: MouseEvent
}

export function ResizeStartEvent<T extends Element>(
    mouseEvent: MouseEvent,
    direction: ResizeDirection,
    resizeTarget: Element,
): ResizeStartEvent {
    const resizeOriginClientX = mouseEvent.clientX
    const resizeOriginClientY = mouseEvent.clientY
    const targetRect = resizeTarget.getBoundingClientRect()
    return {
        direction,
        handleEl: mouseEvent.target as Element,
        resizeOriginClientX,
        resizeOriginClientY,
        resizeTarget,
        targetRect,
        wrappedEvent: mouseEvent,
    }
}

export type ResizeEvent = {
    direction: ResizeDirection | undefined
    dX: number
    dY: number
    handleEl: Element | undefined
    resizeStartEvent: ResizeStartEvent
    resizeTarget: Element
    newTargetRect: DOMRect
    wrappedEvent: MouseEvent
}

export function ResizeEvent(mouseEvent: MouseEvent, resizeStartEvent: ResizeStartEvent): ResizeEvent {
    const direction = resizeStartEvent.direction
    const dX = mouseEvent.clientX - resizeStartEvent.resizeOriginClientX
    const dY = mouseEvent.clientY - resizeStartEvent.resizeOriginClientY
    return {
        direction,
        dX,
        dY,
        handleEl: resizeStartEvent.handleEl,
        resizeStartEvent,
        resizeTarget: resizeStartEvent.resizeTarget,
        newTargetRect: mapToResizedElementRect(mouseEvent, direction, resizeStartEvent.targetRect),
        wrappedEvent: mouseEvent,
    }
}

function mapToResizedElementRect(
    ev: MouseEvent,
    direction: ResizeDirection | undefined,
    rect: DOMRect,
) {
    if (!direction) {
        return rect
    }

    const newRect = DOMRect.fromRect(rect)

    if (direction.includes('n')) {
        newRect.height = rect.bottom - ev.clientY
        newRect.y = ev.clientY
    }
    if (direction.includes('e')) {
        newRect.width = ev.clientX - rect.x
    }
    if (direction.includes('s')) {
        newRect.height = ev.clientY - rect.y
    }
    if (direction.includes('w')) {
        newRect.width = rect.right - ev.clientX
        newRect.x = ev.clientX
    }
    return newRect
}
