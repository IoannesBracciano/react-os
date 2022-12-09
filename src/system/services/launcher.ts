import { store } from '../../store'
import { closeApp, launchApp } from '../state/launcherSlice'


const LauncherSvc = Object.freeze({
    close(appId: string) {
        store.dispatch(closeApp({ appId }))
    },
    launch(appId: string) {
        store.dispatch(launchApp({ appId }))
    }
})

export default LauncherSvc
