import { useSelector } from 'react-redux'
import { selectUser } from '../../system/state/desktopSlice'

export const root = Object.freeze({
    user: '~',
    system: '$',
}) 

export function useStorageKey(scope: 'user' | 'system' = 'user') {
    const env = 'nuvem_dev' // Set it where?
    const user = useSelector(selectUser)

}
