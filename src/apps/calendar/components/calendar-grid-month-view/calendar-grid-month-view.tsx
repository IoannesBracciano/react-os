import React from 'react'
import { expand, inRange, next, start } from '../../date'
import { CalendarGridCell, CalendarGridLayout } from '../calendar-grid-layout'
import './calendar-grid-month-view.css'

export interface CalendarGridMonthViewProps
extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect' | 'onSelectCapture'> {
    date: Date
    canSelect?: false | 'single' | 'range'
    onSelectionChange?: ((selection: (Date | undefined)[]) => void) | undefined
    selectionInit?: (Date | undefined)[] | undefined
}

export const CalendarGridMonthView = ({
    date,
    canSelect = false,
    onSelectionChange,
    selectionInit = [],
}: CalendarGridMonthViewProps) => {
    const month = useCalendarMonth(date)
    const [monthStart, monthEnd] = [month[0], month[month.length - 1]]
    const [selection, setSelection] = React.useState<(Date | undefined)[]>(selectionInit)
    const [selectingEnd, setSelectingEnd] = React.useState(false)

    const isSelected = (date: Date) => {
        if (canSelect === 'range') {
            const [start, end] = selection
            return (start && end && inRange(start, end, date))
                || (start === date)
        }
        return selection.includes(date)
    }

    React.useEffect(() => {
        if (typeof onSelectionChange === 'function') {
            onSelectionChange(selection)
        }
    }, [onSelectionChange, selection])

    const handleCalendarGridCellMouseDown = React.useCallback(
        (event: React.MouseEvent, date: Date) => {
            if (canSelect === 'range') {
                setSelection((selection) => (
                    selectingEnd ? [...selection, date] : [date]
                ))
                setSelectingEnd((selectingEnd) => !selectingEnd)
            } else if (canSelect === 'single') {
                setSelection([date])
                setSelectingEnd(false)
            }
        }, [canSelect, selectingEnd])

    return (
        <CalendarGridLayout from={monthStart} to={monthEnd}>
            {month.map((date) => (
                <CalendarGridCell
                    className={isSelected(date) ? 'selected' : ''}
                    date={date}
                    onMouseDown={e => handleCalendarGridCellMouseDown(e, date)}
                />
            ))}
        </CalendarGridLayout>
    )
}

function useCalendarMonth(date: Date) {
    const startOfMonth = React.useMemo(() => start('month', date), [date])
    const startOfNextMonth = React.useMemo(() =>
        next('month', startOfMonth), [startOfMonth])
    const month = React.useMemo(() => (
        expand(startOfMonth, startOfNextMonth)
    ), [startOfMonth, startOfNextMonth])
    return month
}
