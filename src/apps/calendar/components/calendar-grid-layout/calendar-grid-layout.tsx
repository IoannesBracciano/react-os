import classNames from 'classnames'
import React from 'react'
import { GridLayout } from '../../../../components/grid-layout/GridLayout'
import { expand, isSameDate } from '../../date'
import { CalendarGridCoordinates, GridCoordinates } from './calendar-grid-coordinates'
import './calendar-grid-layout.css'

export interface CalendarGridLayoutProps {
    children?: React.ReactNode
    from: Date | string
    to: Date | string
}

export const CalendarGridLayout = ({ children, from, to }: CalendarGridLayoutProps) => {
    const dates = React.useMemo(() => expand(from, to), [from, to])
    const [toGridCoordinates, toDate] = _useCalendarGridCoordinates(dates)

    return (
        <GridLayout
            className='calendar-grid-layout'
            // columns={[
            //     '[Monday] calc(100% / 7)',
            //     '[Tuesday] calc(100% / 7)',
            //     '[Wednesday] calc(100% / 7)',
            //     '[Thursday] calc(100% / 7)',
            //     '[Friday] calc(100% / 7)',
            //     '[Saturday] calc(100% / 7)',
            //     '[Sunday] calc(100% / 7)',
            // ]}
            // rows={['32px']}
        >
            <CalendarGridCoordinates.Provider value={{ toDate, toGridCoordinates }}>
                {children}
            </CalendarGridCoordinates.Provider>
        </GridLayout>
    )
}

function _useCalendarGridCoordinates([first, ...rest]: Date[]) {
    const dayOffset = React.useMemo(() => (first.getDay() + 6) % 7, [first])

    const toGridCoordinates = React.useCallback((date: Date) => {
        if (!isSameDate(date, first, 'month')) {
            return {
                column: 0, row: 0,
            }
        }
        return {
            column: date.getDay() || 7,
            row: Math.ceil((dayOffset + date.getDate()) / 7),
        }
    }, [dayOffset, first])

    const toDate = React.useCallback((coordinates: GridCoordinates) => {
        const dayInMonth = (coordinates.row - 1) * 7 + coordinates.column - dayOffset
        return [first, ...rest][dayInMonth]
    }, [dayOffset, first, rest])

    return [toGridCoordinates, toDate] as const
}
