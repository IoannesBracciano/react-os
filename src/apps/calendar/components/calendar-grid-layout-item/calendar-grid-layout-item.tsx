import React from 'react'
import { useCalendarGridCoordinates } from '../calendar-grid-layout/calendar-grid-coordinates'

export interface CalendarGridLayoutItemProps {
    children: React.ReactNode
    date: Date
    duration?: number | undefined
}

export const CalendarGridLayoutItem = ({
    children,
    date,
    duration = 1,
}: CalendarGridLayoutItemProps) => {
    const { column, row } = useCalendarGridCoordinates(date)
    return (
        <div className='calendar-grid-item'
            style={{
                gridColumn: `${column} / span 1`,
                gridRow: `${row} / span 1`,
            }}
        >
            {children}
        </div>
    )
}
