import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { MouseEvent, MouseEventHandler, useCallback, useEffect, useRef, useState } from 'react'
import { Button } from '../button/Button'
import { Menu, MenuItem } from '../menu/Menu'
import './Select.css'

export interface SelectOption<T> {
    as?: string
    key: string
    label: string
    value: T
}

export interface SelectProps<T> {
    defaultOption?: SelectOption<T>
    drop?: 'left' | 'center' | 'right'
    id?: string
    onChange?: (option: SelectOption<T> | undefined) => void
    onMouseDown?: MouseEventHandler
    options: SelectOption<T>[]
    placeholder?: string
    selectedOption?: SelectOption<T>
}

export function Select<T>({
    defaultOption,
    drop = 'center',
    id,
    onChange,
    onMouseDown,
    options = [],
    placeholder = '',
    selectedOption: controlledSelectedOption,
}: SelectProps<T>) {
    const [dropped, setDropped] = useState(false)
    const [selectedOption, setSelectedOption] = useState<SelectOption<T> | undefined>(defaultOption)

    useEffect(() => {
        const handler = (ev: Event) => {
            setDropped(false)
        }
        document.addEventListener('click', handler)
        return () => {
            document.removeEventListener('click', handler)
        }
    }, [])

    useEffect(() => {
        setSelectedOption(controlledSelectedOption || defaultOption)
    }, [controlledSelectedOption, defaultOption])
    
    const onMenuItemClick = useCallback((item: MenuItem) => {
        const selectedOption = options.find(({ key }) => key === item.key)
        setSelectedOption(selectedOption)
        if (typeof onChange === 'function') {
            onChange(selectedOption)
        }
    }, [onChange, options])

    const onSelectClick = useCallback((ev: MouseEvent) => {
        ev.stopPropagation()
        setDropped((dropped) => !dropped)
    }, [])

    const selectBtnRef = useRef<HTMLButtonElement>(null)

    return (
        <div className={'select ' + (dropped ? 'dropped' : '')} id={id}>
            <Button forwardedRef={selectBtnRef} onClick={onSelectClick} onMouseDown={onMouseDown}>
                {selectedOption?.label || placeholder}
                <FontAwesomeIcon icon={faCaretDown} size='sm' />
            </Button>{dropped &&
            <div className={'select-options-pane ' + drop}>
                <Menu
                    items={options.map(({ as, key, label }) => ({ as, key, label }))}
                    onItemClicked={onMenuItemClick}
                />
            </div>
        }</div>
    )
}
