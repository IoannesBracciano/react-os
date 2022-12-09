import { useCallback, useEffect, useMemo, useState } from 'react'

const LOCAL_KEY_APP_STORAGE = '/system/apps'

export function getAppStorageKey(appId: string, key: string) {
    return LOCAL_KEY_APP_STORAGE + '/' + appId + '/' + key
}

export function useStorage<T>(key: string, defValue: T) {
    const storedItem = useMemo<T>(() =>
        JSON.parse(localStorage.getItem(key) || 'null'),
        [key],
    )
    const [item, setItem] = useState<T>(storedItem || defValue)
    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(item))
    }, [key, item])
    return [item, setItem] as const
}

export function useAppStorage<T>(appId: string, key: string, defValue: T) {
    const storageKey = useMemo(() => getAppStorageKey(appId, key), [appId, key])
    const storedItem = useMemo<T>(() =>
        JSON.parse(localStorage.getItem(storageKey) || 'null'),
        [storageKey],
    )
    const [item, setItem] = useState<T>(storedItem || defValue)
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(item))
    }, [storageKey, item])
    return [item, setItem] as const
}

export function getApplicationStorageKey(applicationId: number) {
    return `ioannes@nuvem_dev:~/applications/${applicationId}`
}

export function getApplicationResourceStorageKey(
    applicationId: string,
    resourceName: string,
) {
    return `ioannes@nuvem_dev:~/applications/${applicationId}/resources/${resourceName}`
}

export function useApplicationResource<T>(
    applicationId: string,
    resourceName: string,
    serializerFn = JSON.stringify,
    deserializerFn = JSON.parse,
) {
    const resourceIndexKey = useMemo(
        () => getApplicationResourceStorageKey(applicationId, resourceName),
        [applicationId, resourceName],
    )
    const serializedIndexOrNull = localStorage.getItem(resourceIndexKey)
    const [resourceIndex, setResourceIndex] = useState<string[]>(
        serializedIndexOrNull
            ? serializedIndexOrNull.split(',')
            : []
    )

    useEffect(() => {
        localStorage.setItem(resourceIndexKey, resourceIndex.join(','))
    }, [resourceIndex, resourceIndexKey])

    const read = useCallback((itemKey: string) => deserializerFn(
        localStorage.getItem(`${resourceIndexKey}/${itemKey}`) || 'null'
    ), [deserializerFn, resourceIndexKey])

    const write = useCallback((itemKey: string, item: T | null) => {
        if (item === null && resourceIndex.includes(itemKey)) {
            setResourceIndex((resourceIndex) =>
                resourceIndex.filter((key) => key !== itemKey))
            localStorage.removeItem(`${resourceIndexKey}/${itemKey}`)
        }
        if (item !== null) {
            if (!resourceIndex.includes(itemKey)) {
                setResourceIndex((resourceIndex) =>[itemKey, ...resourceIndex])
            }
            localStorage.setItem(`${resourceIndexKey}/${itemKey}`, serializerFn(item))
        }
    }, [resourceIndex, resourceIndexKey, serializerFn])

    return [resourceIndex, read, write]
    // const [item, setItem] = useState<T>(storedItem || defValue)
    // useEffect(() => {
    //     localStorage.setItem(storageKey, JSON.stringify(storageItem))
    // }, [storageKey, storageItem])
    // return [storageItem, setItem] as const
}
