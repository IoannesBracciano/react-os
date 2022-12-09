import React, { DragEventHandler, HTMLAttributes, MouseEvent, useCallback, useMemo, useState } from 'react'
import { GridLayout } from '../../../../components/grid-layout/GridLayout'
import { expand, daysInMonth, duration, end, isSameDate, monthAsDayArray, nameWeekday, start, tomorrow, Weekdays, milliseconds, next, dayInMonth } from '../../date'
import './MonthView.css'
import { MonthDateView } from './MonthDateView'
import { CollectionContextType, useCollectionContext } from '../../../../components/collection/context'
import { CalendarItem } from '../calendar-item/CalendarItem'
import { CalendarEvent, CalendarEventCollectionState } from '../../state'
import { faHand } from '@fortawesome/free-regular-svg-icons'
import { updateCalendarEvent } from '../../actions'
import { CalendarEntry } from '../calendar-entry/CalendarEntry'
import classNames from 'classnames'

export interface MonthViewProps extends HTMLAttributes<HTMLDivElement> {
    date: Date
    selectedDate?: Date
}

export type DateEventHandler = (date: Date, event: MouseEvent<HTMLDivElement>) => void

export function MonthView({
    date,
    onClick,
    onContextMenu,
    onMouseDown,
    selectedDate,
}: MonthViewProps) {
    const year = useMemo(() => date.getFullYear(), [date])
    const month = useMemo(() => date.getMonth(), [date])
    const startOfMonth = useMemo(() => start('month', date), [date])
    const startOfNextMonth = useMemo(() => next('month', startOfMonth), [startOfMonth])
    const days = useMemo(() => expand(startOfMonth, startOfNextMonth), [startOfMonth, startOfNextMonth])
    const startOfMonthWeekday = useMemo(() => nameWeekday(startOfMonth), [startOfMonth])
    const startOfMonthDay = useMemo(() => Weekdays.findIndex((weekday) => weekday === startOfMonthWeekday), [startOfMonthWeekday])
    const lastMonth = useMemo(() => new Date(year, month - 1, 1), [month, year])
    const lasTMonthDays = useMemo(() => 
        monthAsDayArray(lastMonth)
            .reverse()
            .slice(0, startOfMonthDay)
            .reverse(),
        [lastMonth, startOfMonthDay])
    const endOfMonth = useMemo(() => end('month', date), [date])
    const endOfMonthWeekday = useMemo(() => nameWeekday(endOfMonth), [endOfMonth])
    const endOfMonthDay = useMemo(() => Weekdays.findIndex((weekday) => weekday === endOfMonthWeekday), [endOfMonthWeekday])
    const nextMonthDays = useMemo(() =>
        monthAsDayArray(startOfNextMonth)
            .slice(0, 6 - endOfMonthDay),
        [startOfNextMonth, endOfMonthDay])
    const { state: calendarEvents, dispatch } = useCollectionContext('calendarEvents')
    const filteredEvents = Object.values<CalendarEvent>(calendarEvents.index)
        .filter((event) => {
            const msStart = milliseconds(event.start)
            return msStart >= days[0].getTime() && msStart <= days[days.length - 1].getTime()
        })
        .sort((a, b) => {
            const durationA = duration(a.start, a.end)
            const durationB = duration(b.start, b.end)
            return durationB - durationA
        })

    const eventCountPerDate: Record<number, number> = days.reduce((counter, date) => ({
            ...counter,
            [date.getDate()]: 0,
        }), {})

    const updateCounts = useCallback((calendarEvent: CalendarEvent) => {
        const startDate = new Date(calendarEvent.start)
        const endDate = new Date(calendarEvent.end)
        const dates = expand(startDate, tomorrow(endDate))
        dates.forEach((date) => {
            const count = eventCountPerDate[date.getDate()] || 0
            eventCountPerDate[date.getDate()] = count + 1
        })
    }, [eventCountPerDate])

    const [dragging, setDragging] = useState(false)

    const handleDateCellDragOver: DragEventHandler<HTMLDivElement>
        = useCallback((event) => {
            event.preventDefault()
            event.dataTransfer.dropEffect = 'move'
            const element = event.currentTarget as HTMLDivElement
            const dateId = element.getAttribute('id')
            const draftId = (calendarEvents as CalendarEventCollectionState).draft
            if (dateId && draftId) {
                const date = new Date(dateId.split('::')[1])
                const calendarEvent = calendarEvents.index[draftId]
                const startDate = new Date(calendarEvent.start)
                const endDate = new Date(calendarEvent.end)
                date.setHours(startDate.getHours(), startDate.getMinutes(), startDate.getSeconds(), startDate.getMilliseconds())
                const diffInDays = duration(startDate, date)
                // Preserving hours
                startDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
                endDate.setFullYear(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + diffInDays)
                dispatch(updateCalendarEvent({
                    ...calendarEvent,
                    start: startDate.toISOString(),
                    end: endDate.toISOString(),
                }))
            }
        }, [calendarEvents, dispatch])

    const handleDragEnd = useCallback(() => {
            setDragging(false)
        }, [])
    
    const handleDragStart = useCallback(() => {
        setDragging(true)
    }, [])

    // const handleDateCellDrop: DragEventHandler<HTMLDivElement>
    //     = useCallback((event) => {
    //         const { type, id: calendarEventId } = JSON.parse(
    //             event.dataTransfer.getData('application/json'),
    //         )
    //         const dateId = (event.currentTarget as HTMLDivElement).getAttribute('id')
    //         if (calendarEventId.startsWith('calendarEvent') && dateId?.startsWith('date')) {
    //             event.preventDefault()
    //             const calendarEvent = calendarEvents.index[calendarEventId]
    //             const dropDate = new Date(dateId.split('::')[1])
    //             const startDate = new Date(calendarEvent.start)
    //             const endDate = new Date(calendarEvent.end)
    //             const diffInDays = difference(startDate, dropDate) || 0
    //             if (type.includes('CalendarEvent.start')) {
    //                 startDate.setFullYear(dropDate.getFullYear(), dropDate.getMonth(), dropDate.getDate())
    //             }
    //             if (type.includes('CalendarEvent.end')) {
    //                 endDate.setFullYear(endDate.getFullYear(), endDate.getMonth(), endDate.getDate() + diffInDays)
    //             }
    //             if (calendarEvent) {
    //                 dispatch(updateCalendarEvent({
    //                     ...calendarEvent,
    //                     start: startDate.toISOString(),
    //                     end: endDate.toISOString(),
    //                 }))
    //             }
    //         }
    //         setEntryPlaceholder(null)
    //     }, [calendarEvents.index, dispatch])
    

    return (
        <div
            className={classNames('grid-container', { dragging })}
            style={{
                height: '100%',
                position: 'relative',
                width: '100%',
            }}
        >
            <GridLayout
                className='month-view'
                columns={[
                    '[Monday] calc(100% / 7)',
                    '[Tuesday] calc(100% / 7)',
                    '[Wednesday] calc(100% / 7)',
                    '[Thursday] calc(100% / 7)',
                    '[Friday] calc(100% / 7)',
                    '[Saturday] calc(100% / 7)',
                    '[Sunday] calc(100% / 7)',
                ]}
                rows={['32px']}
                style={{
                    gridAutoRows: '1fr',
                    height: '100%',
                    position: 'absolute',
                    width: '100%',
                }}
            >
                <div className='day-header' id='monday'>
                    <h3>Mon</h3>
                </div>
                <div className='day-header' id='tuesday'>
                    <h3>Tue</h3>
                </div>
                <div className='day-header' id='wednesday'>
                    <h3>Wed</h3>
                </div>
                <div className='day-header' id='thursday'>
                    <h3>Thu</h3>
                </div>
                <div className='day-header' id='friday'>
                    <h3>Fri</h3>
                </div>
                <div className='day-header' id='saturday'>
                    <h3>Sat</h3>
                </div>
                <div className='day-header' id='sunday'>
                    <h3>Sun</h3>
                </div>{
                    [...lasTMonthDays, ...days, ...nextMonthDays].map((_date, i) => (
                        <MonthDateView
                            date={_date}
                            key={`date::${_date.toISOString()}`}
                            month={date}
                            onClick={onClick}
                            onContextMenu={onContextMenu}
                            onDragOver={handleDateCellDragOver}
                            selected={selectedDate && isSameDate(_date, selectedDate)}
                            style={{
                                gridColumn: `${date.getDay() || 7} / span 1`,
                                gridRow: `${Math.floor(i / 7) + 2} / span 1`,
                            }}
                        />
                    ))}
                    {Object.values(filteredEvents).map((calendarEvent) => {
                        const active = calendarEvents.selection.includes(calendarEvent.id)
                        const date = new Date(calendarEvent.start)
                        updateCounts(calendarEvent)
                        return (
                            <CalendarEntry
                                active={active}
                                entry={calendarEvent}
                                key={calendarEvent.id}
                                onClick={onClick}
                                onContextMenu={onContextMenu}
                                onDragEnd={handleDragEnd}
                                onDragStart={handleDragStart}
                                onMouseDown={onMouseDown}
                                style={{
                                    marginTop: `${(eventCountPerDate[date.getDate()] - 1) * 24}px`,
                                }}
                            />
                        )
                    })}
            </GridLayout>
        </div>
    )
}
