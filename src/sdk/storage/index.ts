
export type StorageItem<T> = {
    readonly key: string
    readonly value?: T | undefined
}

export type StorageItemDescriptor = {
    readonly type: string
}

export type StorageIndex = StorageItem<Record<string, StorageItemDescriptor>> & {
    
}

export type ApplicationStorageIndex = StorageIndex & {
    readonly key: string
    readonly resources: StorageIndex
}

export function deserializeStorageIndex(serializedIndex: string): StorageIndex {
    return JSON.parse(serializedIndex)
}

export function useApplicationStorage(applicationId: string) {
    const key = `ioannes@nuvemdev:~/application#${applicationId}/`
    const item = localStorage.getItem(key) || 'null'
    const index = JSON.parse(item)
}

export function useResource(resourceName: string, applicationId: string) {
    const key = `ioannes@nuvemdev:~/application#${applicationId}/resource#${resourceName}`
    const index = JSON.parse(localStorage.getItem(key) || 'null')
}

export function useStorage(key: string) {
    
}
