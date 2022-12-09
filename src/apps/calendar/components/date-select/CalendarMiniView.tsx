import classNames from 'classnames'
import React from 'react'
import { end, expand, next, start, today } from '../../date'
import './CalendarMiniView.css'

export interface CalendarMiniViewProps {
    displayDate?: Date
    onSelect: (date: Date) => void
    selected?: Date
}

export function CalendarMiniView({
    displayDate = today(),
    onSelect,
    selected,
}: CalendarMiniViewProps) {
    const startOfCurrentMonth = React.useMemo(() =>
        start('month', displayDate), [displayDate])
    const startDayOffset = (startOfCurrentMonth.getDay() + 6) % 7
    const endOfCurrentMonth = React.useMemo(() =>
        end('month', displayDate), [displayDate])
    const endDayOffset = (endOfCurrentMonth.getDay() + 6) % 7
    const startOfNextMonth = React.useMemo(() =>
        next('month', startOfCurrentMonth), [startOfCurrentMonth])
    const currentMonth = React.useMemo(() =>
        expand(startOfCurrentMonth, startOfNextMonth), [startOfCurrentMonth, startOfNextMonth])

    const handleDateMouseDown: React.MouseEventHandler<HTMLDivElement>
        = React.useCallback((event) => {
            if (typeof onSelect === 'function') {
                onSelect(new Date(
                    (event.target as HTMLDivElement).getAttribute('id') as string,
                ))
            }
        }, [onSelect])

    return (
        <div className='calendar-mini-view'>{startDayOffset > 0
                ? (
                    <div className='start-offset' style={{
                        gridColumn: `1 / span ${startDayOffset}`,
                        gridRow: '1 / span 1',
                    }}></div>
                ) : null
            }{[...currentMonth].map((date) => (
                <div
                    className={classNames('date', {
                        selected: selected && date.toDateString() === selected.toDateString()
                    })}
                    id={date.toISOString()}
                    onMouseDown={handleDateMouseDown}
                    style={{
                        gridColumn: `${date.getDay() || 7} / span 1`,
                        gridRow: `${Math.ceil((startDayOffset + date.getDate()) / 7)} / span 1`,
                    }}
                >
                    {date.getDate()}
                </div>
            ))}{6 - endDayOffset > 0
                ? (
                    <div className='end-offset' style={{
                        gridColumn: `${endDayOffset} / span ${6 - endDayOffset}`,
                        gridRow: `${Math.ceil((startDayOffset + currentMonth.length) / 7)} / span 1`,
                    }}></div>
                ) : null
        }</div>
    )
}
