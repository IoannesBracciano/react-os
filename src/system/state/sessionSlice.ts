import { createSelector, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import DesktopSvc from '../services/desktop'

export interface User {
    imageUrl: string
    name: string
    password: string
}

export interface SessionState {
    dateOpened: number
    loggedUser: User | null
}

const INIT_STATE: SessionState = {
    dateOpened: -1,
    loggedUser: null,
}

const sessionSlice = createSlice({
    name: 'session',
    initialState: INIT_STATE,
    reducers: {
        changeLoggedUserName(state, action) {
            if (state.loggedUser && action.payload.password === state.loggedUser.password) {
                state.loggedUser.name = action.payload.newName
            }
        },
        login(state, action) {
            state.loggedUser = action.payload
        },
    }
})

export const { changeLoggedUserName, login } = sessionSlice.actions

export const selectSession = (state: RootState) => state.session

export const selectLoggedUser = createSelector(selectSession, (state) => state.loggedUser)

export default sessionSlice.reducer
