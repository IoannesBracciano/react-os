import { ActionWithPayload, combineReducers } from '../notebook/reducers'

// function createReducer<T extends string, P, S>(
//     actionType: T,
//     reducerFn: (state: S, action: ActionWithPayload<T, P>) => S,
// ) {
//     return (state: S, action: ActionWithPayload<any, any>) => {
//         if (action.type === actionType) {
//             return reducerFn(state, action)
//         }
//     }
// }

export type CalendarEntry = {
    // calendarId: string
    date: number
    name: string
}

export type CalendarEvent = {
    allDay?: boolean
    calendarId: string
    end: string
    id: string
    name: string
    notes?: string
    start: string
}

export type IndexedCollection<T, K extends keyof T>
    = T[K] extends PropertyKey ? Record<T[K], T> : never

export interface CalendarEventCollectionState {
    draft: CalendarEvent['id'] | null
    focused: CalendarEvent | null
    index: IndexedCollection<CalendarEvent, 'id'>
    selection: CalendarEvent['id'][]
}

export function createCalendarEvent(
    state: CalendarEventCollectionState,
    action: ActionWithPayload<'create-calendar-event', CalendarEvent>,
) {
    const newCalendarEvent = action.payload
    return ({
        ...state,
        draft: newCalendarEvent.id,
        index: {
            ...state.index,
            [newCalendarEvent.id]: newCalendarEvent,
        },
    })
}

export function createAndSelectCalendarEvent(
    state: CalendarEventCollectionState,
    action: ActionWithPayload<'create-and-select-calendar-event', CalendarEvent>,
) {
    const newState = createCalendarEvent(state, {
        type: 'create-calendar-event',
        payload: action.payload,
    })
    return {
        ...newState,
        selection: [
            action.payload.id,
        ],
    }
}

export function deleteCalendarEvent(
    state: CalendarEventCollectionState,
    action: ActionWithPayload<'create-calendar-event', CalendarEvent>,
) {
    const { [action.payload.id]: _, ...newIndex } = state.index
    return ({
        ...state,
        index: newIndex,
    })
}

export function deselectAll(
    state: CalendarEventCollectionState,
    action: ActionWithPayload<'deselect-all', null>,
) {
    return ({
        ...state,
        selection: [],
    })
}

export function selectCalendarEvent(
    state: CalendarEventCollectionState,
    action: ActionWithPayload<'select-calendar-event', CalendarEvent>,
) {
    return ({
        ...state,
        selection: [
            ...state.selection,
            action.payload.id,
        ],
    })
}

export function setDraftCalendarEvent(
    state: CalendarEventCollectionState,
    action: ActionWithPayload<'set-draft-calendar-event', CalendarEvent['id'] | null>,
) {
    return ({
        ...state,
        draft: action.payload,
    })
}

export function setFocusedCalendarEvent(
    state: CalendarEventCollectionState,
    action: ActionWithPayload<'set-focused-calendar-event', CalendarEvent | null>,
) {
    return ({
        ...state,
        focused: action.payload,
    })
}

export function updateCalendarEvent(
    state: CalendarEventCollectionState,
    action: ActionWithPayload<'update-calendar-event', CalendarEvent>,
) {
    return ({
        ...state,
        index: {
            ...state.index,
            [action.payload.id]: {
                ...action.payload,
            },
        },
    })
}

export default combineReducers({
    'create-calendar-event': createCalendarEvent,
    'create-and-select-calendar-event': createAndSelectCalendarEvent,
    'delete-calendar-event': deleteCalendarEvent,
    'deselect-all': deselectAll,
    'select-calendar-event': selectCalendarEvent,
    'set-draft-calendar-event': setDraftCalendarEvent,
    'set-focused-calendar-event': setFocusedCalendarEvent,
    'update-calendar-event': updateCalendarEvent,
})
