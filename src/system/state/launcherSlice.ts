import { createSelector, createSlice } from '@reduxjs/toolkit'
import { CalendarApp } from '../../apps/calendar/Calendar.app'
import { LaunchpadApp } from '../../apps/launchpad/Launchpad.app'
import { MailApp } from '../../apps/mail/Mail.app'
import { NotebookApp } from '../../apps/notebook/Notebook.app'
import { SettingsApp } from '../../apps/settings/Settings.app'
import { TimeApp } from '../../apps/time/Time.app'
import { RootState } from '../../store'

export type App = {
    description?: string
    icon: string
    id: string
    name: string
    showInLaunchpad?: boolean
    url?: string
    windowed?: boolean
}

export type LaunchInstance = {
    appId: string
    status: 'launching' | 'running' | 'sleeping' | 'waking' | 'killed'
    windowBoundingRect?: DOMRect
}

export interface LauncherState {
    installedApps: Record<string, App>
    launchInstances: Record<string, LaunchInstance>
    stagedApps: Record<string, App>
}

const INIT_STATE: LauncherState = {
    installedApps: {
        'calendar': {
            icon: 'https://cdn.dribbble.com/users/190601/screenshots/1390303/staccalicon800.png',
            id: 'calendar',
            name: 'Calendar',
            showInLaunchpad: true,
            url: 'calendar/Calendar.app',
        },
        'launchpad': {
            icon: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2Fce%2F30%2F8e%2Fce308e3b82b4bb9579af01f8a682e136--launcher-icon-logo-design-inspiration.jpg&f=1&nofb=1&ipt=dbed6826f24ca986138b931303305910607b890507150e7edcf4652e5819baef&ipo=images',
            id: 'launchpad',
            name: 'Launchpad',
            showInLaunchpad: false,
            url: 'launchpad/Launchpad.app',
        },
        'mail': {
            icon: 'https://purepng.com/public/uploads/large/purepng.com-mail-iconsymbolsiconsapple-iosiosios-8-iconsios-8-721522596075clftr.png',
            id: 'mail',
            name: 'Mail',
            showInLaunchpad: true,
            url: 'mail/Mail.app',
        },
        'notebook': {
            icon: 'https://www.notebooksapp.com/wp-content/uploads/ui/NBIOSIconWeb.png',
            id: 'notebook',
            name: 'Notebook',
            showInLaunchpad: true,
            url: 'notebook/Notebook.app',
        },
        'settings': {
            icon: 'https://logodix.com/logo/507094.png',
            id: 'settings',
            name: 'Settings',
            showInLaunchpad: true,
            url: 'settings/Settings.app',
        },
        'time': {
            icon: 'https://i.pinimg.com/originals/02/08/98/0208988471e10959ee6ecbc3fffb6964.jpg',
            id: 'time',
            name: 'Time',
            showInLaunchpad: true,
            url: 'time/Time.app',
        },
    },
    launchInstances: {},
    stagedApps: {}
}

export const AppCtorRegistry: Record<string, () => JSX.Element> = Object.freeze({
    'calendar': CalendarApp,
    'launchpad': LaunchpadApp,
    'mail': MailApp,
    'notebook': NotebookApp,
    'settings': SettingsApp,
    'time': TimeApp,
})

const launcherSlice = createSlice({
    name: 'launcher',
    initialState: INIT_STATE,
    reducers: {
        closeApp(state, action) {
            const id = action.payload.appId
            delete state.stagedApps[id]
        },
        launchApp(state, action) {
            const id = action.payload.appId
            state.stagedApps[id] = state.installedApps[id]
            // const instance = state.launchInstances[action.payload.appId]
            // if (instance) {
            //     if (instance.status === 'sleeping') {
            //         instance.status = 'waking'
            //     } else if (instance.status === 'killed') {
            //         instance.status = 'launching'
            //     }
            // } else {
            //     state.launchInstances[action.payload.appId] = {
            //         appId: action.payload.appId,
            //         status: 'launching'
            //     }
            // }
        }
        // installApp(state, action) {
        //     // const { icon, id, name, ...rest } = action.payload
        //     state.installedApps[action.payload.id] = action.payload
        // }
    }
})

export const { closeApp, launchApp } = launcherSlice.actions

export const selectLauncher = (state: RootState) => state.launcher

export const selectInstalledApps = createSelector(selectLauncher, (state) => state.installedApps)

export const selectInstalledApp = (appId: string) => createSelector(selectLauncher, (state) => state.installedApps[appId])

export const selectLaunchInstances = createSelector(selectLauncher, (state) => state.launchInstances)

export const selectStagedApps = createSelector(selectLauncher, (state) => state.stagedApps)

export const selectLaunchingAppInstances = createSelector(
    selectLauncher,
    (state) => Object.fromEntries(
        Object.entries(state.launchInstances)
            .filter(([, appInstance]) => appInstance.status === 'launching')
    )
)

export default launcherSlice.reducer
