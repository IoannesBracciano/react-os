export function bottom(rect: DOMRect | DOMRectInit) {
    if (!rect) {
        return 0
    }
    const { height = 0, y = 0 } = rect
    return y + height
}

export function center(rect: DOMRect | DOMRectInit) {
    if (!rect) {
        return { x: 0, y: 0 }
    }
    const { height = 0, width = 0, x = 0, y = 0 } = rect
    return {
        x: Math.round((width / 2) + x),
        y: Math.round((height / 2) + y),
    }
}

export function offset<T extends number | { x: number, y: number }>(
    rectA: DOMRect | DOMRectInit,
    rectB: DOMRect | DOMRectInit,
    measureFnA: (rect: DOMRect | DOMRectInit) => T,
    measureFnB: ((rect: DOMRect | DOMRectInit) => T) = measureFnA,
): T | undefined {
    const [measurementA, measurementB] = [measureFnA(rectA), measureFnB(rectB)]
    if (typeof measurementA === 'number' && typeof measurementB === 'number') {
        return measurementA - measurementB as T
    }
    if (typeof measurementA === 'object' && typeof measurementB === 'object') {
        const { x: xA = 0, y: yA = 0 } = measurementA 
        const { x: xB = 0, y: yB = 0 } = measurementB
        return { x: xA - xB, y: yA - yB } as T
    }
}

export function left(rect: DOMRect | DOMRectInit) {
    if (!rect) {
        return 0
    }
    const { x = 0 } = rect
    return x
}

export type RectSide = 'bottom' | 'left' | 'right' | 'top'

export function pad(
    rect: DOMRect | DOMRectInit = new DOMRect(),
    amount: number | { [key in RectSide]?: number },
) {
    const newRect = DOMRect.fromRect(rect)
    const sides = typeof amount === 'number'
        ? ['bottom', 'left', 'right', 'top']
        : Object.keys(amount)
    const values = typeof amount === 'number'
        ? [amount, amount, amount, amount]
        : Object.values(amount)
    sides.forEach((side, i) => {
        switch (side) {
            case 'all':
            case 'bottom':
                newRect.height += values[i]
                break
            case 'all':
            case 'left':
                newRect.x -= values[i]
                break
            case 'all':
            case 'right':
                newRect.width += values[i]
                break
            case 'all':
            case 'top':
                newRect.y -= values[i]
                break
        }
    })
    return newRect
}

export function right(rect: DOMRect | DOMRectInit) {
    if (!rect) {
        return 0
    }
    const { width = 0, x = 0 } = rect
    return x + width
}

export function top(rect: DOMRect | DOMRectInit) {
    if (!rect) {
        return 0
    }
    const { y = 0 } = rect
    return y
}

export type HorizontalAlignment = 'after' | 'before' | 'center' | 'left' | 'right'

export type VerticalAlignment = 'after' | 'before' | 'bottom' | 'center' | 'top'

export type Alignment = `${HorizontalAlignment} ${VerticalAlignment}`

export function align(
    rect: DOMRect | DOMRectInit,
    anchorRect: DOMRect | DOMRectInit,
    alignment: Alignment,
) {
    const [alignH, alignV] =
        alignment.split(' ') as [HorizontalAlignment, VerticalAlignment]
    return alignHorizontal(
        alignVertical(rect, anchorRect, alignV),
        anchorRect,
        alignH,
    )
}

function alignHorizontal(
    rect: DOMRect | DOMRectInit,
    anchorRect: DOMRect | DOMRectInit,
    alignH: HorizontalAlignment,
) {
    const newRect = DOMRect.fromRect(rect)
    const { width = 0 } = rect
    const { width: anchorWidth = 0 } = anchorRect
    switch (alignH) {
        case 'after':
            newRect.x = right(anchorRect)
            break
        case 'before':
            newRect.x = left(anchorRect) - width
            break
        case 'center':
            newRect.x = center(anchorRect).x - Math.round(width / 2)
            break
        case 'left':
            newRect.x = left(anchorRect)
            break
        case 'right':
            newRect.x = left(anchorRect) - width + anchorWidth
            break
    }
    return newRect
}

function alignVertical(
    rect: DOMRect | DOMRectInit,
    anchorRect: DOMRect | DOMRectInit,
    alignV: VerticalAlignment,
) {
    const newRect = DOMRect.fromRect(rect)
    const { height = 0 } = rect
    const { height: anchorHeight = 0 } = anchorRect
    switch (alignV) {
        case 'after':
            newRect.y = bottom(anchorRect)
            break
        case 'before':
            newRect.y = top(anchorRect) - height
            break
        case 'bottom':
            newRect.y = top(anchorRect) - height + anchorHeight
            break
        case 'center':
            // newRect.y = center(anchorRect).y - Math.round(height / 2)
            newRect.y -= offset(rect, anchorRect, center)?.y || 0
            break
        case 'top':
            newRect.y = top(anchorRect)
            break
    }
    return newRect
}
