import React from 'react'

export type GridCoordinates = {
    column: number,
    row: number,
}

export type CalendarGridCoordinateContextType = {
    toDate: (coordinates: GridCoordinates) => Date,
    toGridCoordinates: (date: Date) => GridCoordinates,
}

export const CalendarGridCoordinates =
    React.createContext<CalendarGridCoordinateContextType | null>(null)

export function useCalendarGridCoordinates(date: Date) {
    const { toGridCoordinates } = React.useContext(CalendarGridCoordinates) || {}
    if (toGridCoordinates) {
        return toGridCoordinates(date)
    }
    return { column: 0, row: 0 }
}
