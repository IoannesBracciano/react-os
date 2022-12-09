import React from 'react'

export function useClientRectRef<T extends Element>() {
    const [rect, setRect] = React.useState<DOMRect>()
    const ref = React.useCallback((node: T) => {
        if(node) {
            setRect(node.getBoundingClientRect())
        }
    }, [])

    return [ref, rect] as const
}
