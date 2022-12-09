import { cloneElement, useCallback, useRef } from 'react'

export function useRefClone<T>() {
    const clone = useRef<T>()
    
    const ref = useCallback((node: T) => {
        clone.current = node
    }, [])

    return [ref, clone]
}