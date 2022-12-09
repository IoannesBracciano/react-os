import classNames from 'classnames'
import { HTMLAttributes } from 'react'
import { nameWeekday } from '../../date'
import './DateIcon.css'

export interface DateIconProps extends HTMLAttributes<HTMLDivElement> {
    compact?: boolean
    date: Date
}

export function DateIcon({ compact = false, date, ...attrs }: DateIconProps) {
    return (
        <div {...attrs}
            className={classNames('date-icon', {
                compact
            })}
            id={`date::${date.toISOString()}`}
        >
            <div className='day-of-week'>
                {nameWeekday(date).slice(0, 3)}
            </div>
            <div className='day-of-month'>
                {date.getDate()}
            </div>
        </div>
    )
}