import classNames from 'classnames'
import { HTMLAttributes, MouseEventHandler, useCallback, useState } from 'react'
import { useCollectionContext } from '../../../../components/collection/context'
import { useClientRectRef } from '../../../../hooks/useClientRectRef'
import { createDefaultCalendarEventObject, deselectAll, selectCalendarEvent, updateCalendarEvent } from '../../actions'
import { CalendarEvent } from '../../state'
import { CalendarEventChangeHandler, EventPopup } from '../calendar-event-popup/CalendarEventPopup'
import './CalendarItem.css'

export interface CalendarEventProps extends HTMLAttributes<HTMLDivElement> {
    active?: boolean
    item: CalendarEvent
}

export const CalendarItem = ({ 
    active = false, 
    item,
    // onClick,
    ...attrs
}: CalendarEventProps) => {
    // const [ref, rect] = useClientRectRef<HTMLDivElement>()
    // const [show, setShow] = useState(false)
    // const { state, dispatch } = useCollectionContext('calendarEvents')

    // const handleClick: MouseEventHandler<HTMLDivElement> = useCallback((event) => {
    //     // if (!active) {
    //     //     dispatch(deselectAll())
    //     //     dispatch(selectCalendarEvent(item))
    //     // }
    //     if (typeof onClick === 'function') {
    //         onClick(event)
    //     }
    // }, [dispatch, item, onClick, state])

    return (
        <div {...attrs}
            className={classNames('calendar-item', {
                'active': active,
            })}
            draggable
            id={`${item.id}`}
            // onClick={handleClick}
            // ref={ref}
        >
            {/* <span className='event-name'> */}
                {item.name}
            {/* </span> */}
        </div>
    )
}
