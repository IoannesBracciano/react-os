import classNames from 'classnames'
import React, { MouseEventHandler } from 'react'
import { format, isToday } from '../../date'
import { CalendarGridLayoutItem } from '../calendar-grid-layout-item'
import './calendar-grid-cell.css'

export interface CalendarGridCellProps
extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect' | 'onSelectCapture'> {
    date: Date
    format?: string | undefined
    onSelect?: ((date: Date) => void) | undefined
}

export const CalendarGridCell = ({
    className,
    date,
    format: formatString = 'dd',
    onClick,
    onSelect,
    style,
    ...rest
}: CalendarGridCellProps) => {
    const handleClick: MouseEventHandler<HTMLDivElement> = React.useCallback((event) => {
        if (typeof onClick === 'function') {
            onClick(event)
        }
        if (typeof onSelect === 'function') {
            onSelect(date)
        }
    }, [date, onClick, onSelect])

    return (
        <CalendarGridLayoutItem date={date}>
            <div {...rest}
                className={classNames(
                    className,
                    'calendar-grid-cell', {
                    'today': isToday(date),
                })}
                onClick={handleClick}
            >
                <span className='date'>{format(date, formatString)}</span>
            </div>
        </CalendarGridLayoutItem>
    )
}
