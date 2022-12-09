import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import { Button, ButtonProps } from "../button/Button";
import './ToggleButton.css'

export interface ToggleButtonProps extends ButtonProps {
    active?: boolean
    defaultActive?: boolean
    onToggle?: (isActive: boolean) => void
}

export function ToggleButton({ active, defaultActive, onClick, onToggle, ...rest }: ToggleButtonProps) {
    const [isActive, setIsActive] = useState(!!defaultActive)
    const onButtonClick: MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
        if (active === undefined) {
            setIsActive((isActive) => !isActive)
        }
        onClick && onClick(event)
        onToggle && onToggle(!isActive)
    }, [active, isActive, onClick, onToggle])

    useEffect(() => {
        if (active !== undefined) {
            setIsActive(active)
        }
    }, [active])

    // useEffect(() => {
    //     onToggle && onToggle(isActive)
    // }, [isActive, onToggle])

    return (
        <Button {...rest}
            className={'btn-toggle ' + (isActive ? 'active' : '')}
            onClick={onButtonClick}
            onMouseDown={e => e.preventDefault()}
        />
    )
}
