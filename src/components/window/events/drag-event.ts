export type DragStartEvent = {
    dragOriginClientX: number
    dragOriginClientY: number
    dragOriginTargetX: number
    dragOriginTargetY: number
    dragTarget: Element
    targetRect: DOMRect
    wrappedEvent: MouseEvent
}

export function DragStartEvent(mouseEvent: MouseEvent, dragTarget: Element): DragStartEvent {
    const targetRect = dragTarget.getBoundingClientRect()
    const dragOriginClientX = mouseEvent.clientX
    const dragOriginClientY = mouseEvent.clientY
    const dragOriginTargetX = mouseEvent.clientX - targetRect.x
    const dragOriginTargetY = mouseEvent.clientY - targetRect.y
    return {
        dragOriginClientX,
        dragOriginClientY,
        dragOriginTargetX,
        dragOriginTargetY,
        dragTarget,
        targetRect,
        wrappedEvent: mouseEvent,
    }
}

export type DragEvent = {
    dragStartEvent: DragStartEvent
    dragTarget: Element
    dX: number
    dY: number
    newTargetRect: DOMRect
    wrappedEvent: MouseEvent
}

export function DragEvent(mouseEvent: MouseEvent, dragStartEvent: DragStartEvent): DragEvent {
    const dX = mouseEvent.clientX - dragStartEvent.dragOriginClientX
    const dY = mouseEvent.clientY - dragStartEvent.dragOriginClientY
    const newTargetRect = new DOMRect(
        mouseEvent.clientX - dragStartEvent.dragOriginTargetX,
        mouseEvent.clientY - dragStartEvent.dragOriginTargetY,
        dragStartEvent.targetRect.width,
        dragStartEvent.targetRect.height,
    )
    return {
        dragStartEvent,
        dragTarget: dragStartEvent.dragTarget,
        dX,
        dY,
        newTargetRect,
        wrappedEvent: mouseEvent,
    }
}
