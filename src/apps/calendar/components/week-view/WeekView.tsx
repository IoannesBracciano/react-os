import _ from 'lodash'
import { DragEventHandler, HTMLAttributes, MouseEventHandler, useCallback, useMemo } from 'react'
import { useCollectionContext } from '../../../../components/collection/context'
import { FlexLayout } from '../../../../components/flex-layout/FlexLayout'
import { GridLayout } from '../../../../components/grid-layout/GridLayout'
import { setFocusedCalendarEvent, updateCalendarEvent } from '../../actions'
import { date, duration, expand, format, isSameDateTime, milliseconds, nameWeekday, next, start } from '../../date'
import { CalendarEvent, CalendarEventCollectionState } from '../../state'
import { CalendarEntry } from '../calendar-entry/CalendarEntry'
import './WeekView.css'

export interface WeekViewProps extends HTMLAttributes<HTMLDivElement> {
    activeEvent?: string
    date?: Date
    onCalendarItemClick?: React.MouseEventHandler
    onCalendarItemContextMenu?: React.MouseEventHandler
}

export function WeekView({
    activeEvent,
    date: displayDate = new Date(),
    onCalendarItemClick,
    onCalendarItemContextMenu,
    onContextMenu,
    ...attrs
}: WeekViewProps) {
    const startOfWeek = useMemo(() => start('week', displayDate), [displayDate])
    const startOfNextWeek = useMemo(() => next('week', startOfWeek), [startOfWeek])
    const weekRange = useMemo(() => expand(
        startOfWeek,
        startOfNextWeek,
    ), [startOfWeek, startOfNextWeek])
    const { state: calendarEvents, dispatch } = useCollectionContext('calendarEvents')
    const filteredEvents = useMemo(() => Object.values<CalendarEvent>(calendarEvents.index)
        .filter((event) => {
            return milliseconds(event.start) >= milliseconds(startOfWeek)
                && milliseconds(event.start) < milliseconds(startOfNextWeek)
                // && duration(event.start, event.end) <= 1
        }), [calendarEvents.index, startOfWeek, startOfNextWeek])

    const sortedEvents = filteredEvents.sort((eventA, eventB) =>
        milliseconds(eventA.start) - milliseconds(eventB.start))

    const groupedByDay = sortedEvents.reduce((byDay, event) => {
        const dateFormatted = format(event.start, 'ddMM')
        const scheduledEvents = byDay[dateFormatted] || []
        return {
            ...byDay,
            [dateFormatted]: [
                ...scheduledEvents,
                event,
            ],
        }
    }, {} as Record<string, CalendarEvent[]>)

    const handleContextMenu: MouseEventHandler<HTMLDivElement>
        = useCallback((event) => {
            const id = (event.currentTarget as HTMLElement).getAttribute('id')
            if (id && id.startsWith('calendarEvent')) {
                const calendarEvent = calendarEvents.index[id]
                dispatch(setFocusedCalendarEvent(calendarEvent))
            }
            // if (id.startsWith('date')) {
            //     const [_, ms] = (id || '::').split('::')
            //     return {
            //         anchor: DOMRect.fromRect({ x: event.pageX, y: event.pageY }),
            //         items: getContextMenuItems(ms ? new Date(ms) : new Date()),
            //         show: true,
            //     }
            // }
        }, [calendarEvents.index, dispatch])

    const handleDateCellDragOver: DragEventHandler<HTMLDivElement>
        = useCallback((event) => {
            event.preventDefault()
            event.dataTransfer.dropEffect = 'move'
            
            // const dateId = element.getAttribute('id')
            const draftId = (calendarEvents as CalendarEventCollectionState).draft
            if (draftId && calendarEvents.index[draftId]) {
                const draft = calendarEvents.index[draftId]
                const element = event.currentTarget as HTMLDivElement
                const y = event.pageY - element.getBoundingClientRect().y
                const slot = Math.floor((y) / 10)
                const hours = Math.max(0, Math.min(23, slot / 4))
                const minutes = (slot % 4) * 15
                const x = event.pageX - element.getBoundingClientRect().x - 46
                const col = Math.max(1, Math.min(7, Math.ceil((x / (element.getBoundingClientRect().width - 46)) * 7)))
                const startDate = date(draft.start)
                const endDate = date(draft.end)
                const newDate = date(startDate)
                newDate.setDate(startDate.getDate() + (col - (startDate.getDay() || 7)))
                newDate.setHours(hours, minutes)
                const diffMin = duration(draft.start, newDate, 'minute')
                endDate.setHours(endDate.getHours(), endDate.getMinutes() + diffMin)

                dispatch(updateCalendarEvent({
                    ...draft,
                    start: newDate.toISOString(),
                    end: endDate.toISOString(),
                }))
            }
        }, [calendarEvents, dispatch])

    return (
        <div {...attrs} className='week-view'>
            <FlexLayout direction='vertical'>
                <FlexLayout className='weekday-view-header'>
                    <div className='weekday-view-header-item time-marks'>
                    </div>
                {weekRange.map((date) => (
                    <div className='weekday-view-header-item'>
                        <h3>{nameWeekday(date).slice(0, 3)} <b>{date.getDate()}</b></h3>
                    </div>
                ))}
                </FlexLayout>
                <div className='scroll-view'>
                    <GridLayout
                        columns={[
                            '43px',
                            '[Monday] calc((100% - 50px) / 7)',
                            '[Tuesday] calc((100% - 50px) / 7)',
                            '[Wednesday] calc((100% - 50px) / 7)',
                            '[Thursday] calc((100% - 50px) / 7)',
                            '[Friday] calc((100% - 50px) / 7)',
                            '[Saturday] calc((100% - 50px) / 7)',
                            '[Sunday] calc((100% - 50px) / 7)',
                        ]}
                        rows={['repeat(96, 10px)']}
                        onDragOver={handleDateCellDragOver}
                    >
                        {Array.from({ length: 23 }, (_, i) => (
                            <div
                                className='time-mark o-clock'
                                key={`timemark&${i}`}
                                style={{
                                    gridColumn: '1 / span 1',
                                    gridRow: `${(i + 1) * 4} / span 1`,
                                }}
                            >
                                {(i < 12 ? i : i % 12) + 1}<small>{i < 11 ? 'am' : 'pm'}</small>
                            </div>
                        ))}
                        {Array.from({ length: 7 }, (_, i) => (
                            <div
                                className='week-day-view'
                                key={`weekday&${i}`}
                                style={{
                                    gridColumn: `${i + 2} / span 1`,
                                    gridRow: `1 / span 96`,
                                }}
                            >
                            </div>
                        ))}
                        {/* {filteredEvents.map((calendarEvent) => {
                            const active = calendarEvents.selection.includes(calendarEvent.id)
                            return <CalendarEntry
                                active={active}
                                entry={calendarEvent}
                                key={calendarEvent.id}
                                onClick={onCalendarItemClick}
                                onContextMenu={callSeq(handleContextMenu, onContextMenu)}
                                view='week'
                            />
                        })} */}
                        {_.entries(groupedByDay).map(([date, scheduledEvents]) => {
                            return scheduledEvents.map((event, i) => {
                                const active = calendarEvents.selection.includes(event.id)
                                const [startMs, endMs] = [event.start, event.end].map(milliseconds)
                                const conflictingEvents = scheduledEvents.slice(0, i).filter((prevEvent) => {
                                    const [prevStartMs, prevEndMs] = [prevEvent.start, prevEvent.end].map(milliseconds)
                                    return (startMs >= prevStartMs && startMs < prevEndMs)
                                })
                                return <CalendarEntry
                                    active={active}
                                    entry={event}
                                    key={event.id}
                                    onClick={onCalendarItemClick}
                                    onContextMenu={callSeq(handleContextMenu, onContextMenu)}
                                    style={{
                                        marginLeft: `${100 - (100 / (conflictingEvents.length + 1))}%`,
                                        width: `${100 / (conflictingEvents.length + 1)}%`,
                                    }}
                                    // view={eventDurationInDays >= 1 ? 'month' : 'week'}
                                    view='week'
                                />
                            })
                        })}
                    </GridLayout>
                    {/* <FlexLayout>
                        <div className='weekday-view-item time-marks'>
                            {Array.from({ length: 4 * 24 }, (_, i) => (i % 4 === 0) ? (<div className='time-mark o-clock' key={`timemark${i}`}>{(i / 4).toString().padStart(2, '0')}:00 </div>) : ((<div className='time-mark' key={`timemark${i}`}></div>)))}
                        </div>
                        {weekRange.map((date) => (
                            <div
                                className='weekday-view-item'
                                id={`date::${date.toISOString()}`}
                                key={date.toISOString()}
                                onContextMenu={onContextMenu}
                            >
                                <div className='time-slots'>
                                    {Array.from({ length: 4 * 24 }, (_, i) => (
                                        <div className='time-slot' key={`timeslot${i}`}>
                                            {filterEventsByStartDate(
                                                calendarEvents.state.index,
                                                new Date(date.getFullYear(), date.getMonth(), date.getDate(), Math.floor(i / 4), (i % 4) * 15),
                                            ).map((calendarEvent) => (
                                                <CalendarEntry
                                                    entry={calendarEvent}
                                                    onClick={onCalendarItemClick}
                                                    onContextMenu={onContextMenu}
                                                />
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </FlexLayout> */}
                </div>
            </FlexLayout>
        </div>
    )
}

export function callSeq<A extends Array<any>>(...fns: (((...args: A) => any) | undefined)[]) {
    return (...args: A) => {
        fns.forEach((fn) => {
            if (typeof fn === 'function') {
                fn(...args)
            }
        })
    }
}

export function filterEvents(events: Record<string, CalendarEvent>, start: Date) {
    return Object.values(events).filter((calendarEvent) => 
            isSameDateTime(start, new Date(calendarEvent.start)))
}
