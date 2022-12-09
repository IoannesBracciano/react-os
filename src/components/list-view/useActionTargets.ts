import { Set } from 'immutable'
import React from 'react'

export function useActionTargets<K = React.Key>() {
    const [actionTargets, setActionTargets] =
        React.useState<Set<K>>(Set([]))
    const _setActionTargets = React.useCallback((actionTargets: K[]) => {
        setActionTargets(Set(actionTargets))
    }, [])
    return [actionTargets, _setActionTargets] as const
}