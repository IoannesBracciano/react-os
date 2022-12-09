import { faCalendarDays } from '@fortawesome/free-regular-svg-icons'
import { faCalendarWeek } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useCallback, useState } from 'react'
import { ToggleButton } from '../../../../components/toggle-button/ToggleButton'
import './ViewSelector.css'

export type CalendarView = 'day' | 'week' | 'month' | 'year'

export interface ViewSelectorProps {
    onViewSelect?: (view: CalendarView) => void
    view?: CalendarView
}

export function ViewSelector({ onViewSelect, view = 'month' }: ViewSelectorProps) {
    const [selectedView, setSelectedView] = useState(view)

    const handleViewSelect = useCallback((view: CalendarView) => {
        setSelectedView(view)
        if (typeof onViewSelect === 'function') {
            onViewSelect(view)
        }
    }, [onViewSelect])

    return (
        <div className='button-group'>
            <ToggleButton
                active={selectedView === 'week'}
                onToggle={() => handleViewSelect('week')}
            >
                <FontAwesomeIcon icon={faCalendarWeek} />
            </ToggleButton>
            <ToggleButton
                active={selectedView === 'month'}
                onToggle={() => handleViewSelect('month')}
            >
                <FontAwesomeIcon icon={faCalendarDays} />
            </ToggleButton>
        </div>
    )
}
