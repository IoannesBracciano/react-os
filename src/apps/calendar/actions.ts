import { CalendarEvent } from './state'

export function createCalendarEvent(calendarEvent = createDefaultCalendarEventObject()) {
    return ({
        type: 'create-calendar-event',
        payload: calendarEvent,
    })
}

export function createAndSelectCalendarEvent(calendarEvent = createDefaultCalendarEventObject()) {
    return ({
        type: 'create-and-select-calendar-event',
        payload: calendarEvent,
    })
}

export function deleteCalendarEvent(calendarEvent: CalendarEvent) {
    return ({
        type: 'delete-calendar-event',
        payload: calendarEvent,
    })
}

export function deselectAll() {
    return ({
        type: 'deselect-all',
        payload: null,
    })
}

export function selectCalendarEvent(calendarEvent: CalendarEvent) {
    return ({
        type: 'select-calendar-event',
        payload: calendarEvent,
    })
}

export function setDraftCalendarEvent(calendarEventId: string | null) {
    return ({
        type: 'set-draft-calendar-event',
        payload: calendarEventId,
    })
}

export function setFocusedCalendarEvent(calendarEvent: CalendarEvent | null) {
    return ({
        type: 'set-focused-calendar-event',
        payload: calendarEvent,
    })
}


export function updateCalendarEvent(calendarEvent: CalendarEvent) {
    return ({
        type: 'update-calendar-event',
        payload: calendarEvent,
    })
}

export function createDefaultCalendarEventObject(date: Date = new Date()): CalendarEvent {
    const startDate = new Date(date)

    const endDate = new Date(date)
    endDate.setHours(date.getHours() + 1, date.getMinutes(), 0)

    return {
        allDay: false,
        calendarId: 'default',
        end: endDate.toISOString(),
        id: `calendarEvent::${Date.now()}`,
        name: '',
        start: startDate.toISOString(),
    }
}