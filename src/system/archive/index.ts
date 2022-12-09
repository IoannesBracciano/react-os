const LOCAL_KEY_ROOT = '/'
const LOCAL_KEY_SYSTEM = '/system'
const LOCAL_KEY_USER = '/user'

// const LOCAL_KEY_DIRECTOR = LOCAL_KEY_SYSTEM + '/director'
// const LOCAL_KEY_DIRECTOR_PERSIST = LOCAL_KEY_DIRECTOR + '/persist'

const LOCAL_MOUNT_POINT = 'ioannes@nephOS-dev$'

export function composeKey(...parts: string[]) {
    return LOCAL_MOUNT_POINT + parts.join('/').replace(/(\/)+/g, '/')
}

export function createSystemArchive(unit: 'director' | 'anchor') {
    const unitArchiveKey = composeKey(LOCAL_KEY_SYSTEM, unit)
    return {
        persist<T>(persistKey: string, value: T, overwrite = true) {
            const key = composeKey(unitArchiveKey, '/persist', persistKey)
            const archivedValue = read(key)
            if (!archivedValue || overwrite) {
                try {
                    const serializedValue = JSON.stringify(value)
                    localStorage.setItem(key, serializedValue)
                } catch (error) {
                    throw WriteError(key, value, error as Error)
                }
                return true
            }
            return false
        }
    }
}

export function read(key: string) {
    return localStorage.getItem(key)
}

function WriteError<T>(key: string, value: T, wrappedError: Error) {
    const error = Object.create(new Error(
        `[WriteError] Failed to archive value ${value} under ${key}.`
    ))
    return Object.assign(error, { key, value, wrappedError })
}
