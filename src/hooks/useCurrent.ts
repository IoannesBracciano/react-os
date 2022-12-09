import React from 'react'

export function useCurrent<T>() {
    const ref = React.useCallback((node: T) => {
        setCurrent(node)
    }, [])
    const [current, setCurrent] = React.useState<T | null>(null)
    return [ref, current] as const
}
