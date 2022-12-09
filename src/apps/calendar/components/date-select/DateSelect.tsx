import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { HTMLAttributes } from 'react'
import { Button } from '../../../../components/button/Button'
import { last, nameMonth, next } from '../../date'
import { CalendarGridMonthView } from '../calendar-grid-month-view'
// import { CalendarMiniView } from './CalendarMiniView'
import './DateSelect.css'

export interface DateSelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
    onSelect?: ((date: Date) => void) | undefined
    onSelectionChange?: ((selection: (Date | undefined)[]) => void) | undefined
    selected?: Date | undefined
    selectionInit?: (Date | undefined)[] | undefined
}

export function DateSelect({
    onSelect,
    onSelectionChange,
    selected = new Date(),
    selectionInit = [],
    ...attrs
}: DateSelectProps) {
    const [displayDate, setDisplayDate] = React.useState(selectionInit[0] || new Date())
    const onPrevious: React.MouseEventHandler<HTMLButtonElement>
        = React.useCallback((event) => {
            setDisplayDate((displayDate) => last('month', displayDate))
        }, [])
    const onNext: React.MouseEventHandler<HTMLButtonElement>
        = React.useCallback((event) => {
            setDisplayDate((displayDate) => next('month', displayDate))
        }, [])
    // const handleSelect= React.useCallback((date: Date) => {
    //     if (typeof onSelect === 'function') {
    //         onSelect(date)
    //     }
    // }, [onSelect])

    return (
        <div {...attrs}
            className='container date-select'
        >
            <div className='calendar-mini'>
                <div className='calendar-mini-header'>
                    <Button
                        className='btn-previous'
                        onClick={onPrevious}
                        space='compact'
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </Button>
                    <span className='month'>{nameMonth(displayDate).slice(0, 3)}</span>
                    <span className='year'>{displayDate.getFullYear()}</span>
                    <Button
                        className='btn-next'
                        onClick={onNext}
                        space='compact'
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </Button>
                </div>
                {/* <CalendarMiniView
                    displayDate={displayDate}
                    onSelect={handleSelect}
                    selected={selected}
                /> */}
                <CalendarGridMonthView
                    canSelect='range'
                    date={displayDate}
                    onSelectionChange={onSelectionChange}
                    selectionInit={selectionInit}
                />
            </div>
        </div>
    )
}