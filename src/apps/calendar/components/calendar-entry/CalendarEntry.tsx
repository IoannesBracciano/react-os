import classNames from 'classnames'
import { DragEventHandler, HTMLAttributes, useCallback, useMemo, useState } from 'react'
import { useCollectionContext } from '../../../../components/collection/context'
import { withExpandedEventHandlers } from '../../../../components/with-expanded-event-handlers/withExpandedEventHandlers'
import { setDraftCalendarEvent } from '../../actions'
import { expand, duration, start, format } from '../../date'
import { CalendarEvent } from '../../state'
import './CalendarEntry.css'

export interface CalendarEntryProps extends HTMLAttributes<HTMLDivElement> {
    active?: boolean
    entry: CalendarEvent
    view?: 'month' | 'week'
}

export const CalendarEntry = ({
    active = false,
    entry,
    onDragEnd,
    onDragStart,
    style,
    view = 'month',
    ...attrs
}: CalendarEntryProps) => {
    const { dispatch } = useCollectionContext('calendarEvents')
    const startDate = useMemo(() => new Date(entry.start), [entry.start])
    const endDate = useMemo(() => new Date(entry.end), [entry.end])
    const dates = useMemo(() =>
        expand(startDate, endDate), [startDate, endDate])
    const weekStartDates = useMemo(() =>
        dates.slice(1).filter((date) => date.getDay() === 1), [dates])
    const dateOffset = useMemo(() =>
        (start('month', startDate).getDay() || 7) - 1, [startDate])

    const handleDragEnd: DragEventHandler<HTMLDivElement>
        = useCallback((event) => {
            dispatch(setDraftCalendarEvent(null))
            typeof onDragEnd === 'function' && onDragEnd(event)
        }, [dispatch, onDragEnd])

    const handleDragStart: DragEventHandler<HTMLDivElement>
        = useCallback((event) => {
            event.dataTransfer.setData('application/json', JSON.stringify({
                type: ['CalendarEvent.start', 'CalendarEvent.end'],
                id: entry.id,
            }))
            event.dataTransfer.dropEffect = 'move'
            event.dataTransfer.setDragImage(dragImage, 0, 0)
            dispatch(setDraftCalendarEvent(entry.id))
            typeof onDragStart === 'function' && onDragStart(event)
        }, [dispatch, entry.id, onDragStart])
    
    // const EntryButton = useMemo(() => createCalendarEntryButton(entry), [entry])

    return <>{[startDate, ...weekStartDates].map((date) => {
        const eventDurationInDays = entry.allDay ? Math.ceil(duration(entry.start, entry.end)) : duration(entry.start, entry.end)
        const col = view === 'month'
            ? date.getDay() || 7 // 1 to 7
            : (date.getDay() || 7) + 1
        const colSpan = view === 'month'
            ? Math.min(7 - col, Math.floor(duration(date, endDate))) + 1
            : Math.max(1, eventDurationInDays)
        const row = view === 'month'
            ? Math.ceil((date.getDate() + dateOffset) / 7) + 1 // +1 for the header row
            : eventDurationInDays >= 1
            ? 1
            : Math.floor(date.getHours() * 4 + date.getMinutes() / 15) + 1
        const rowSpan = view === 'week' && eventDurationInDays < 1
            ? Math.ceil(duration(date, endDate, 'minute') / 15)
            : 1

        return (
            <div {...attrs}
                className={classNames('calendar-entry', {
                    active,
                })}
                draggable
                id={entry.id}
                key={`${entry.id}@${col}:${row}`}
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
                role='button'
                style={{
                    ...style,
                    gridColumn: `${col} / span ${colSpan}`,
                    gridRow: `${row} / span ${rowSpan}`,
                }}
            >
                {/* <div
                    className='entry-date-handle start'
                    draggable
                /> */}
                <div className='entry-name'>
                    {entry.name}
                </div>{view === 'week' && eventDurationInDays < 1 && (
                    <div className='entry-duration'>
                        <small>
                            {format(entry.start, 'hh:mm') + ' - ' + format(entry.end, 'hh:mm')}
                        </small>
                    </div>
                )}
                {/* <div
                    className='entry-date-handle end'
                /> */}
            </div>
            // <EntryButton {...attrs}
            //     active={active}
            //     col={col}
            //     colSpan={colSpan}
            //     entry={entry}
            //     handleDragEnd={handleDragEnd}
            //     handleDragStart={handleDragStart}
            //     row={row}
            //     rowSpan={rowSpan}
            //     style={style}
            //     view={view}
            // />
        )
    })}</>
}

const dragImage = document.createElement('img')
dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
dragImage.style.cursor = 'move'
