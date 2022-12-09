import { configureStore } from '@reduxjs/toolkit'
import desktopReducer from './system/state/desktopSlice'
import directorReducer from './system/director/slice'
import launcherReducer from './system/state/launcherSlice'
import sessionReducer from './system/state/sessionSlice'

export const store = configureStore({
    reducer: {
        desktop: desktopReducer,
        director: directorReducer,
        launcher: launcherReducer,
        session: sessionReducer
    }
})

export type RootState = ReturnType<typeof store.getState>
