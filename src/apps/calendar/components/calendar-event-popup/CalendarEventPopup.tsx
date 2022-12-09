import { faBell, faLocationDot, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ChangeEvent, ChangeEventHandler, MouseEventHandler, useCallback, useEffect, useMemo, useRef } from 'react'
import { Button } from '../../../../components/button/Button'
import { useCollectionContext } from '../../../../components/collection/context'
import { FlexLayout } from '../../../../components/flex-layout/FlexLayout'
import { ControlledPopup } from '../../../../components/popup2/Popup'
import { SelectOption } from '../../../../components/select/Select'
import { Switch, SwitchStateChangeHandler } from '../../../../components/switch/Switch'
import { ToggleButton } from '../../../../components/toggle-button/ToggleButton'
import { updateCalendarEvent } from '../../actions'
import { Calendar } from '../../Calendar.app'
import { date, duration, format, formatDuration, nameMonth, time } from '../../date'
import { CalendarEvent } from '../../state'
import { DateSelect } from '../date-select/DateSelect'
import './CalendarEventPopup.css'

export interface EventPopupProps {
    alignH?: 'after' | 'before' | 'center' | 'end' | 'left' | 'right' | 'start'
    alignV?: 'after' | 'before' | 'bottom' | 'center' | 'end' | 'start' | 'top'
    anchor: DOMRect
    // calendars: Record<string, Calendar>
    event: CalendarEvent
    onClickOutside?: (event: MouseEvent) => void
    onCalendarEventChange?: CalendarEventChangeHandler
    onDoneClick?: MouseEventHandler
    show?: boolean
}

export type CalendarEventChangeHandler = (calendarEvent: Partial<CalendarEvent>) => void

export function EventPopup({
    alignH = 'center',
    alignV = 'after',
    anchor,
    // calendars,
    event: calendarEvent,
    onClickOutside,
    onCalendarEventChange,
    show,
}: EventPopupProps) {
    const startDate = new Date(calendarEvent.start)
    const endDate = new Date(calendarEvent.end)
    const popupRef = useRef(null)
    const { dispatch } = useCollectionContext('calendarEvents')

    useEffect(() => {
        const handleMouseDown = (event: MouseEvent) => {
            if (show && popupRef && popupRef.current
                    && !event.composedPath().includes(popupRef.current)
                    && typeof onClickOutside === 'function') {
                onClickOutside(event)
            }
        }
        document.addEventListener('mousedown', handleMouseDown)
        return () => {
            document.removeEventListener('mousedown', handleMouseDown)
        }
    }, [onClickOutside, popupRef, show])

    // const onDayEventStateChange = useCallback((state: string) => {
    //     if (typeof onCalendarEventChange === 'function') {
    //         onCalendarEventChange({ allDay: state === 'on' })
    //     }
    // }, [onCalendarEventChange])

    const onEventNameChange: ChangeEventHandler = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            // if (typeof onCalendarEventChange === 'function') {
            //     onCalendarEventChange({ name: event.target.value })
            // }
            dispatch(updateCalendarEvent({
                ...calendarEvent,
                name: event.target.value,
            }))
        }, [dispatch, calendarEvent])

    const onEventStartDateChange = useCallback(
            (date: Date) => {
                const oldDate = new Date(calendarEvent.start)
                date.setHours(oldDate.getHours(), oldDate.getMinutes())
                const endDate = new Date(calendarEvent.end)
                if (duration(date, endDate) < 0) {
                    endDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
                }
                dispatch(updateCalendarEvent({
                    ...calendarEvent,
                    start: date.toISOString(),
                    end: endDate.toISOString(),
                }))
            }, [calendarEvent, dispatch])

    const onEventEndDateChange = useCallback(
        (date: Date) => {
            const oldDate = new Date(calendarEvent.end)
            date.setHours(oldDate.getHours(), oldDate.getMinutes())
            const startDate = new Date(calendarEvent.start)
            if (duration(startDate, date) < 0) {
                startDate.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
            }
            dispatch(updateCalendarEvent({
                ...calendarEvent,
                start: startDate.toISOString(),
                end: date.toISOString(),
            }))
        }, [calendarEvent, dispatch])

    const onEventDateTimeChange = useCallback(
        ([start, end]: (Date | undefined)[]) => {
            if (start && end) {
                const oldStartDate = new Date(calendarEvent.start)
                start.setHours(oldStartDate.getHours(), oldStartDate.getMinutes())
                const oldEndDate = new Date(calendarEvent.end)
                end.setHours(oldEndDate.getHours(), oldEndDate.getMinutes())
                dispatch(updateCalendarEvent({
                    ...calendarEvent,
                    start: start.toISOString(),
                    end: end.toISOString(),
                }))
            } else if (start) {
                onEventStartDateChange(start)
                onEventEndDateChange(start)
            }
        }, [calendarEvent, dispatch, onEventEndDateChange, onEventStartDateChange])

    const onEventTimeChange: ChangeEventHandler = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            // if (typeof onCalendarEventChange === 'function') {
            const [hours, minutes] = event.target.value.split(':')
            const which = event.target.getAttribute('name') as 'start' | 'end'
            const newDate = new Date(calendarEvent[which])
            newDate.setHours(+hours, +minutes)
                // onCalendarEventChange({ [which]: newDate.toISOString() })
            // }
            dispatch(updateCalendarEvent({
                ...calendarEvent,
                [which]: newDate.toISOString(),
            }))
        }, [calendarEvent, dispatch])
    
    const onEventAllDayChange: SwitchStateChangeHandler = useCallback((state) => {
        // if (typeof onCalendarEventChange === 'function') {
        //     onCalendarEventChange({ allDay: state === 'on' })
        // }
        dispatch(updateCalendarEvent({
            ...calendarEvent,
            allDay: state === 'on',
        }))
    }, [calendarEvent, dispatch])

    const handleEventDateTimeFieldClick: MouseEventHandler<HTMLDivElement>
        = useCallback((event) => {
            // if ((event.target as HTMLDivElement).classList.contains('event-field')) {
                document.getElementById('event-date-time')?.classList.toggle('collapsed')
            // }
        }, [])
    
    // const handleEventStartDateFieldClick: MouseEventHandler<HTMLDivElement>
    //     = useCallback((event) => {
    //         // if ((event.target as HTMLDivElement).classList.contains('event-field')) {
    //             document.getElementById('event-start-date')?.classList.toggle('collapsed')
    //         // }
    //     }, [])

    // const handleEventEndDateFieldClick: MouseEventHandler<HTMLDivElement>
    //     = useCallback((event) => {
    //         document.getElementById('event-end-date')?.classList.toggle('collapsed')
    //     }, [])

    const onEventNotesChange: ChangeEventHandler<HTMLTextAreaElement>
        = useCallback((event) => {
            // if (typeof onCalendarEventChange === 'function') {
            //     onCalendarEventChange({ name: event.target.value })
            // }
            dispatch(updateCalendarEvent({
                ...calendarEvent,
                notes: event.target.value,
            }))
        }, [dispatch, calendarEvent])
    
    return (
        <ControlledPopup
            align={[alignH, alignV]}
            anchor={anchor}
            gap={6}
            // onClickOutside={onClickOutside}
            ref={popupRef}
            show={show}
        >
            <div className='new-event'>
                <FlexLayout direction='vertical'>
                    <input
                        autoFocus
                        name='event-name'
                        onChange={onEventNameChange}
                        placeholder='New Event'
                        style={{ width: '240px' }}
                        type='text'
                        value={calendarEvent.name}
                    />
                    <div
                        className='event-field editable collapsible collapsed'
                        id='event-date-time'
                        onClick={handleEventDateTimeFieldClick}
                    >
                        <div className='collapsed-toggle'>
                            <span className='field-label'>{
                                calendarEvent.allDay
                                    ? format(calendarEvent.start, 'MMMM dd')
                                    : formatDuration(calendarEvent.start, calendarEvent.end)
                            }</span>
                        </div>
                        <div className='event-start-info'>
                            <span className='field-label'>
                                    Starts:{' '}
                            </span>
                            <span className='field-controls'>
                                {`${startDate.getDate()} ${nameMonth(startDate).slice(0, 3)} ${startDate.getFullYear()}`}
                            </span>
                            <span className='at' style={{
                                display: calendarEvent.allDay ? 'none' : 'inline'
                            }}> at</span>
                            <span className='start-time'>
                                <input
                                    disabled={calendarEvent.allDay}
                                    name='start' 
                                    onChange={onEventTimeChange}
                                    onClick={(event) => event.stopPropagation()}
                                    type='time'
                                    value={time(startDate, 'hh:mm')}
                                />
                            </span>
                        </div>
                        <div className='event-end-info'>
                            <span className='field-label'>
                                Ends:{' '}
                            </span>
                            <span className='field-controls'>
                                {`${endDate.getDate()} ${nameMonth(endDate).slice(0, 3)} ${endDate.getFullYear()}`}
                            </span>
                            <span className='at' style={{
                                display: calendarEvent.allDay ? 'none' : 'inline'
                            }}> at</span>
                            <span className='end-time'>
                                <input
                                    disabled={calendarEvent.allDay}
                                    name='end' 
                                    onChange={onEventTimeChange}
                                    onClick={(event) => event.stopPropagation()}
                                    type='time'
                                    value={time(endDate, 'hh:mm')}
                                />
                            </span>
                        </div>
                        <DateSelect
                            onClick={(event) => event.stopPropagation()}
                            onSelectionChange={onEventDateTimeChange}
                            selectionInit={[date(calendarEvent.start), date(calendarEvent.end)]}
                        />
                    </div>
                    <label
                        className='event-field compact'
                        id='event-all-day'
                    >
                        <span>All day event</span>
                        <Switch
                            name='all-day-event-switch'
                            onStateChange={onEventAllDayChange}
                            space='compact'
                            state={calendarEvent.allDay}
                        />
                    </label>
                    {/* <div
                        className='event-field editable collapsible collapsed'
                        id='event-start-date'
                        onClick={handleEventStartDateFieldClick}
                    >
                        <div className='collapsed-toggle'>
                            <span className='field-label'>
                                Starts:
                            </span>
                            <span className='field-controls'>
                                {`${startDate.getDate()} ${nameMonth(startDate).slice(0, 3)} ${startDate.getFullYear()}`}
                            </span>
                            <span className='at' style={{
                                display: calendarEvent.allDay ? 'none' : 'inline'
                            }}>at</span>
                            <span className='start-time'>
                                <input
                                    disabled={calendarEvent.allDay}
                                    name='start' 
                                    onChange={onEventTimeChange}
                                    onClick={(event) => event.stopPropagation()}
                                    type='time'
                                    value={time(startDate, 'hh:mm')}
                                />
                            </span>
                        </div>
                        <DateSelect
                            onClick={(event) => event.stopPropagation()}
                            onSelect={onEventStartDateChange}
                            selected={new Date(calendarEvent.start)}
                        />
                    </div>
                    <div
                        className='event-field editable collapsible collapsed'
                        id='event-end-date'
                        onClick={handleEventEndDateFieldClick}
                    >
                        <div className='collapsed-toggle'>
                            <span className='field-label'>
                                Ends:
                            </span>
                            <span className='field-controls'>
                                {`${endDate.getDate()} ${nameMonth(endDate).slice(0, 3)} ${endDate.getFullYear()}`}
                            </span>
                            <span className='at' style={{
                                display: calendarEvent.allDay ? 'none' : 'inline'
                            }}>at</span>
                            <span className='end-time'>
                                <input
                                    disabled={calendarEvent.allDay}
                                    name='end' 
                                    onChange={onEventTimeChange}
                                    onClick={(event) => event.stopPropagation()}
                                    type='time'
                                    value={time(endDate, 'hh:mm')}
                                />
                            </span>
                        </div>
                        <DateSelect
                            onClick={(event) => event.stopPropagation()}
                            onSelect={onEventEndDateChange}
                            selected={new Date(calendarEvent.end)}
                        />
                    </div> */}
                    <textarea
                        className='event-field editable'
                        id='event-notes'
                        onChange={onEventNotesChange}
                        placeholder='Add notes'
                        value={calendarEvent.notes}
                    >
                    </textarea>
                    {/* <div className='flex-container flex-horizontal'> */}
                    {/* <FlexLayout>
                        <Button>
                            <FontAwesomeIcon icon={faLocationDot} />
                        </Button>
                        <Button>
                            <FontAwesomeIcon icon={faPaperclip} />
                        </Button>
                        <Button>
                            <FontAwesomeIcon icon={faBell} />
                        </Button>
                    </FlexLayout> */}
                </FlexLayout>
            </div>
        </ControlledPopup>
    )
}