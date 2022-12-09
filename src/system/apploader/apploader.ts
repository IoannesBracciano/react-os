import React from 'react'

const cache: Record<string, React.ComponentType> = {}

export function getCached(path: string | undefined = '_0') {
    return cache[path]
}

export async function load(path: string) {
    const cachedComponent = getCached(path)
    if (cachedComponent) {
        return cachedComponent
    }
    const module = await import(`../../apps/${path}`)
    return _cache(path, module.default)
}

function _cache(path: string, component: React.ComponentType) {
    cache[path] = component
    return component
}
