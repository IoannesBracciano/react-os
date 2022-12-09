import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface Actor {
    componentPath?: string | undefined
    id: string
    
}

export interface DirectorState  {
    focused: Actor | null
    queue: Record<string, Actor | undefined>
    stage: Record<string, Actor | undefined>
}

const slice = createSlice({
    name: 'director',
    initialState: {
        focused: null,
        queue: {},
        stage: {},
    } as DirectorState,
    reducers: {
        focusActor(state, { payload: { id } }: PayloadAction<{ id: string }>) {
            const actor = state.stage[id]
            if (actor) {
                state.focused = actor
            }
        },
        queueActor(state, { payload: { actor } }: PayloadAction<{ actor: Actor }>) {
            if (!state.stage[actor.id] && !state.queue[actor.id]) {
                state.queue[actor.id] = actor
            }
        },
        stageActor(state, { payload: { actor } }: PayloadAction<{ actor: Actor }>) {
            if (state.queue[actor.id]) {
                state.queue[actor.id] = undefined
                state.stage[actor.id] = actor
                state.focused = actor
            } else if (state.stage[actor.id]) {
                state.focused = actor
            } else {
                state.queue[actor.id] = actor
            }
        },
        unstageActor(state, { payload: { id } }: PayloadAction<{ id: string }>) {
            if (state.stage[id]) {
                state.stage[id] = undefined
            }
            if (state.focused && state.focused.id === id) {
                state.focused = null
            }
        },
    },
})

export const { focusActor, queueActor, stageActor, unstageActor } = slice.actions

export const selectDirector = (state: RootState) => state.director

export const selectFocusedActor = createSelector(selectDirector, (state) => state.focused)

export const selectQueue = createSelector(selectDirector, (state) => state.queue)

export const selectStage = createSelector(selectDirector, (state) => state.stage)

export default slice.reducer
