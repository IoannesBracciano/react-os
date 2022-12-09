import { faCalendarPlus, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faChevronLeft, faChevronRight, faDeleteLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MouseEvent, useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { Button } from '../../components/button/Button'
import { withContextMenu3, withContextMenu4 } from '../../components/context-menu/ContextMenu'
import { FlexLayout } from '../../components/flex-layout/FlexLayout'
import { WindowPaneHeader } from '../../components/window-pane-header/WindowPaneHeader'
import { WindowPane } from '../../components/window-pane/WindowPane'
import { Window } from '../../components/window/Window'
import { useAppStorage } from '../../sdk/storage'
import './Calendar.app.css'
import { EventPopup } from './components/calendar-event-popup/CalendarEventPopup'
import { MonthView } from './components/month-view/MonthView'
import { duration, format, month, nameMonth, today } from './date'
import eventCollectionStateReducer from './state'
import manifest from './manifest.json'
import { createAndSelectCalendarEvent, createDefaultCalendarEventObject, deleteCalendarEvent, deselectAll, selectCalendarEvent } from './actions'
import { WeekView } from './components/week-view/WeekView'
import { CalendarView, ViewSelector } from './components/view-selector/ViewSelector'
import { CalendarEvent } from './state'
import { CollectionContext } from '../../components/collection/context'
import { DateIcon } from './components/date-icon/DateIcon'

export const MonthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
] as const

export type Calendar = {
    color: string
    id: string
    name: string
}

export function CalendarApp() {
    // const [calendars, setCalendars] = useAppStorage<Record<string, Calendar>>(manifest.appId, 'calendars', {
    //     'default': createCalendar('default', 'Default', '#a0a0a0'),
    //     'bank-holidays': createCalendar('bank-holidays', 'Bank Holidays', '#be6735'),
    // })
    const [storedEvents, setStoredEvents]
        = useAppStorage<Record<string, CalendarEvent>>(manifest.application.id, 'events', {})
    const [view, setView] = useState<CalendarView>('month')
    const [displayedDate, setDisplayedDate] = useState(today())
    const monthLocale = nameMonth(displayedDate)
    const year = displayedDate.getFullYear()
    // const month = displayedDate.getMonth()
    // const newEventBtnRef = useRef<HTMLButtonElement>(null)
    const [popupTargetRect, setPopupTargetRect] = useState<DOMRect | null>(null)
    const [eventCollectionState, dispatch] = useReducer(eventCollectionStateReducer, {
        draft: null,
        focused: null,
        index: storedEvents,
        selection: [],
    })
    const selectedEvent = eventCollectionState.selection.length
        ? eventCollectionState.index[eventCollectionState.selection[0]]
        : null

    // useEffect(() => {
    //     setCalendars({
    //         'default': createCalendar('default', 'Default', '#a0a0a0'),
    //         'bank-holidays': createCalendar('bank-holidays', 'Bank Holidays', '#be6735'),
    //     })
    // }, [])

    useEffect(() => {
        setStoredEvents(eventCollectionState.index)
    }, [eventCollectionState.index, setStoredEvents])

    const onNext = useCallback(() => {
        setDisplayedDate((displayedDate) => {
            const newDisplayedDate = new Date(displayedDate)
            if (view === 'month') {
                newDisplayedDate.setMonth(displayedDate.getMonth() + 1)
            } else if (view === 'week') {
                newDisplayedDate.setDate(displayedDate.getDate() + 7)
            }
            return newDisplayedDate
        })
    }, [view])

    const onPrevious = useCallback(() => {
        setDisplayedDate((displayedDate) => {
            const newDisplayedDate = new Date(displayedDate)
            if (view === 'month') {
                newDisplayedDate.setMonth(displayedDate.getMonth() - 1)
            } else if (view === 'week') {
                newDisplayedDate.setDate(displayedDate.getDate() - 7)
            }
            return newDisplayedDate
        })
    }, [view])

    const onToday = useCallback(() => {
        setDisplayedDate(today())
    }, [])

    // const onDateClick = useCallback((day: Date, event: MouseEvent<HTMLDivElement>) => {
    //     if (day.toISOString() === selectedDay.toISOString()) {
    //         const newCalendarEvent = createCalendarEvent(day)
    //         setCurrEvent(newCalendarEvent)
    //         setPopupTarget(event.target as HTMLDivElement)
    //         return
    //     }
    //     if ((day.getFullYear() === year && day.getMonth() < month) || day.getFullYear() < year) {
    //         onPreviousMonth()
    //     } else if ((day.getFullYear() === year && day.getMonth() > month) || day.getFullYear() > year) {
    //         onNextMonth()
    //     }
    //     setSelectedDay(day)
    // }, [month, onNextMonth, onPreviousMonth, selectedDay, year])

    // const onDateDoubleClick = useCallback((date: Date, event: MouseEvent<HTMLDivElement>) => {
    //     // if (date.toISOString() === selectedDay.toISOString()) {
    //     // const newCalendarEvent = createCalendarEvent(date)
    //     // setCurrEvent(newCalendarEvent)
    //     // setPopupTarget(event.target as HTMLDivElement)
    //     // }
    //     dispatch(createCalendarEvent(createDefaultCalendarEventObject(date)))
    // }, [])

    const onCalendarItemClick: React.MouseEventHandler = useCallback((event) => {
        if (!event.button) {
            const id = (event.currentTarget as HTMLElement).getAttribute('id')
            if (id?.startsWith('calendarEvent')) {
                event.stopPropagation()
                dispatch(deselectAll())
                dispatch(selectCalendarEvent(eventCollectionState.index[id]))
                setPopupTargetRect((event.currentTarget as HTMLElement).getBoundingClientRect())
            }
        }
    }, [eventCollectionState.index])

    const handlePopupClickOutside = useCallback(() => {
        dispatch(deselectAll())
    }, [])

    const handleViewSelect = useCallback((view: CalendarView) => {
        setView(view)
    }, [])

    const getContextMenuItems2 = useCallback((calendarEvent?: CalendarEvent) => {
        if (calendarEvent) {
            // const date = new Date(calendarEvent.start)
            return [
                {
                    disabled: true,
                    key: 'event-menu-header',
                    label: <CalendarEventContextMenuHeader calendarEvent={calendarEvent} />,
                },
                {
                    action: deleteCalendarEvent(calendarEvent),
                    icon: faDeleteLeft,
                    key: 'delete-calendar-event',
                    label: 'Delete Event',
                },
            ]
        }
        return []
    }, [])

    const MonthViewWithContextMenu = useMemo(() => withContextMenu3(MonthView, (event: MouseEvent) => {
        const id = (event.currentTarget as HTMLElement).getAttribute('id') as string
        if (id.startsWith('calendarEvent') && storedEvents[id]) {
            const calendarEvent = storedEvents[id]
            return {
                anchor: DOMRect.fromRect({ x: event.pageX, y: event.pageY }),
                items: getContextMenuItems(new Date(calendarEvent.start), calendarEvent),
                show: true,
            }
        }
        if (id.startsWith('date')) {
            const [_, ms] = (id || '::').split('::')
            return {
                anchor: DOMRect.fromRect({ x: event.pageX, y: event.pageY }),
                items: getContextMenuItems(ms ? new Date(ms) : new Date()),
                show: true,
            }
        }
        return {
            show: false,
        }
    }, 'calendarEvents'), [storedEvents])

    const WeekViewWithContextMenu = useMemo(() => withContextMenu4(
        WeekView,
        getContextMenuItems2,
        'calendarEvents',
    ), [getContextMenuItems2])

    return (
        <CollectionContext.Provider value={{
            'calendarEvents': {
                state: eventCollectionState,
                dispatch,
            }
        }}>
            <Window appId={manifest.application.id}>
                <FlexLayout direction='vertical'>
                    {/* <WindowPane color='rgba(var(--accent-color) / 0.72)'> */}
                    <WindowPane opacity={0}>
                        <WindowPaneHeader>
                            <h1>{monthLocale} {year}</h1>
                            <div style={{ flexGrow: '1' }}></div>
                            <ViewSelector onViewSelect={handleViewSelect} />
                            <Button onClick={onPrevious}><FontAwesomeIcon icon={faChevronLeft} /> </Button>
                            <Button onClick={onToday}>Today</Button>
                            <Button onClick={onNext}><FontAwesomeIcon icon={faChevronRight} /> </Button>
                            {/* <Button onClick={onNewEventBtnClick} ref={newEventBtnRef}><FontAwesomeIcon icon={faCalendarPlus} /> </Button> */}
                        </WindowPaneHeader>
                    </WindowPane>
                    <WindowPane grow opacity={0} shrink>{
                        view === 'week'
                            ? <WeekViewWithContextMenu
                                date={displayedDate}
                                onCalendarItemClick={onCalendarItemClick}
                            />
                            : <MonthViewWithContextMenu
                                date={displayedDate}
                                onClick={onCalendarItemClick}
                            />
                    }</WindowPane>
                </FlexLayout>
                <EventPopup
                    alignH={view === 'month' ? 'center' : 'after'}
                    alignV={view === 'month' ? 'after' : 'top'}
                    // alignV={selectedEvent && (new Date(selectedEvent.start)).getDate() > 23 ? 'top' : 'bottom'}
                    anchor={popupTargetRect || new DOMRect()}
                    // calendars={calendars}
                    event={selectedEvent || createDefaultCalendarEventObject()}
                    onClickOutside={handlePopupClickOutside}
                    show={!!selectedEvent}
                />
            </Window>
        </CollectionContext.Provider>
    )
}

// function createCalendar(id: string, name: string, color: string) {
//     return {
//         color,
//         id,
//         name,
//     }
// }
interface CalendarEventContextMenuHeaderProps {
    calendarEvent: CalendarEvent
}

function CalendarEventContextMenuHeader({ calendarEvent }: CalendarEventContextMenuHeaderProps) {
    const startDate = new Date(calendarEvent.start)
    const endDate = new Date(calendarEvent.end)
    const allDay = !!calendarEvent.allDay
    const diff = duration(startDate, endDate) || 0
    return (
        <FlexLayout align='center' className='calendar-event-context-menu-header' gap='md'>
            <FlexLayout direction='vertical'>
                <FlexLayout align='center' gap='md' justify='start'>
                    <div className='event-calendar-color-badge'></div>
                    <div className='event-duration'>
                        {diff > 1
                            ? (<small><b>{format(startDate, 'MMM dd') + ' - ' + format(endDate, month(startDate) === month(endDate) ? 'dd' : 'MMM dd')}</b></small>)
                            : allDay
                            ? <small><b>{format(startDate, 'MMM dd')}</b></small>
                            : (<small><b>{format(startDate, 'hh:mm')} - {format(endDate, 'hh:mm')}</b></small>)
                        }
                    </div>
                </FlexLayout>
                <span className='event-name'>
                    <b style={{ textTransform: 'capitalize' }}>
                        {calendarEvent.name}
                    </b>
                </span>
            </FlexLayout>
        </FlexLayout>
    )
}

interface MonthDateCellContextMenuHeaderProps {
    date: Date
}

function MonthDateCellContextMenuHeader({ date }: MonthDateCellContextMenuHeaderProps) {
    return (
        <FlexLayout align='center' gap='md' style={{ textTransform: 'capitalize' }}>
            <DateIcon
                date={date}
                style={{
                    marginLeft: '-4px',
                }}
            />
            <FlexLayout direction='vertical' justify='center'>
                <small><b>Nothing</b></small>
                <small><b>Scheduled</b></small>
            </FlexLayout>
        </FlexLayout>
    )
}

function getContextMenuItems(date: Date, calendarEvent?: CalendarEvent) {
    if (calendarEvent) {
        // const date = new Date(calendarEvent.start)
        return [
            {
                disabled: true,
                key: 'event-menu-header',
                label: <CalendarEventContextMenuHeader calendarEvent={calendarEvent} />,
            },
            // {
            //     icon: faCopy,
            //     key: 'copy-calendar-event',
            //     label: 'Copy Event',
            // },
            // {
            //     // action: { type: 'delete-calendar-event' },
            //     icon: faCut,
            //     key: 'cut-calendar-event',
            //     label: 'Cut Event',
            // },
            // {
            //     // action: { type: 'delete-calendar-event' },
            //     icon: faPaste,
            //     key: 'paste-calendar-event',
            //     label: 'Paste Event',
            // },
            {
                action: deleteCalendarEvent(calendarEvent),
                icon: faTrashCan,
                key: 'delete-calendar-event',
                label: 'Delete Event',
            }, 
            // {
            //     as: 'h6',
            //     disabled: true,
            //     key: 'date-menu-header',
            //     label: `${nameWeekday(date)}, ${nameMonth(date)} ${date.getDate()}`,
            // }, 
            // {
            //     action: createAndSelectCalendarEvent(createDefaultCalendarEventObject(date)),
            //     icon: faCalendarPlus,
            //     key: 'create-calendar-event',
            //     label: 'Create Event',
            // },
        ]
    }
    return [{
        disabled: true,
        key: 'event-menu-header',
        label: <MonthDateCellContextMenuHeader date={date} />,
    }, {
        action: createAndSelectCalendarEvent(createDefaultCalendarEventObject(date)),
        icon: faCalendarPlus,
        key: 'create-calendar-event',
        label: 'Create Event',
    }]
}

export default CalendarApp
