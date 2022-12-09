import React  from 'react'

export function useClientRect<T extends Element>(ref: React.RefObject<T>) {
    const [rect, setRect] = React.useState<DOMRect>()

    React.useEffect(() => {
        if (ref && ref.current) {
            setRect(ref.current.getBoundingClientRect())
        }
    }, [ref])

    return rect
}
