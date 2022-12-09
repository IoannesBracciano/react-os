import classNames from 'classnames'
import { HTMLAttributes, MouseEvent } from 'react'
import { isToday, nameWeekday } from '../../date'
import { CalendarEvent } from '../../state'
import './MonthDateView.css'

export interface MonthDateViewProps extends HTMLAttributes<HTMLDivElement> {
    date: Date
    month: Date
    selected?: boolean
}

export type CalendarEventClickHandler = (CalendarEvent: CalendarEvent, event: MouseEvent) => void

export function MonthDateView({
    className,
    date,
    month,
    selected = false,
    ...attrs
}: MonthDateViewProps) {
    return (
        <div {...attrs}
            className={classNames(className, 'day', {
                // 'day': day.getMonth() ===  month.getMonth(),
                'last-month-day': date.getMonth() <  month.getMonth(),
                'next-month-day': date.getMonth() >  month.getMonth(),
                'selected': selected,
                'today': isToday(date),
            })}
            id={`date::${date.toISOString()}`}
            // key={date.toISOString()}
            style={{
                ...attrs.style,
                gridColumn: `${nameWeekday(date)} 1`,
            }}
        >
            <span className='date'>{date.getDate()}</span>
        </div>
    )
}
