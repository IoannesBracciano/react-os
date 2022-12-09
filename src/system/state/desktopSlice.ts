import { Action, createSelector, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import DesktopSvc from '../services/desktop'

export interface User {
    imageUrl: string
    name: string
    password: string
}

export interface DesktopState {
    accent: string
    background: { url: string }
    user: User | null
    error: Error | null
}

const INIT_STATE: DesktopState = {
    accent: DesktopSvc.getAccent(),
    background: { url: DesktopSvc.getBackground() },
    user: null,
    error: null,
}

const desktopSlice = createSlice({
    name: 'desktop',
    initialState: INIT_STATE,
    reducers: {
        changeBackground(state, action) {
            state.background.url = action.payload.url
        },
        changeLoggedUserName(state, action) {
            if (state.user && action.payload.password === state.user.password) {
                state.user.name = action.payload.newName
            }
        },
        clearError(state, action: Action) {
            state.error = null
        },
        login(state, action) {
            state.user = action.payload
        },
        loginFailed(state, action) {
            state.error = action.payload
        },
        setAccent(state, action) {
            state.accent = action.payload.color
        }
    }
})

export const { changeBackground, changeLoggedUserName, clearError, login, loginFailed, setAccent } = desktopSlice.actions

export const selectDesktop = (state: RootState) => state.desktop

export const selectAccent = createSelector(selectDesktop, (state) => state.accent)

export const selectBackground = createSelector(selectDesktop, (state) => state.background)

export const selectUser = createSelector(selectDesktop, (state) => state.user)

export const selectError = createSelector(selectDesktop, (state) => state.error)

export default desktopSlice.reducer
