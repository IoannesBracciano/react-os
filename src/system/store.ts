import { configureStore } from '@reduxjs/toolkit'
import directorReducer from './director/slice'

export const store = configureStore({
    reducer: {
        director: directorReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
