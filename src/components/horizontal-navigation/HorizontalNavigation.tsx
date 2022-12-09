import './HorizontalNavigation.css'
import { IconDefinition } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useCallback, useState } from "react"
import { useSelector } from "react-redux"
import { selectAccent } from "../../system/state/desktopSlice"

export interface NavigationTarget {
    icon: IconDefinition
    id: string
    label: string
}

export interface HorizontalNavigationProps {
    targets: NavigationTarget[]
    onNavigationTargetSelected?: NavigationTargetSelectedHandler
}

export type NavigationTargetSelectedHandler = (
    target: NavigationTarget,
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
) => void

export function HorizontalNavigation({ onNavigationTargetSelected, targets }: HorizontalNavigationProps) {
    const [selectedTarget, setSelectedTarget] =
        useState<NavigationTarget | null>((targets && targets[0]) || null)

    const accent = useSelector(selectAccent)

    const onListItemClick: (
        target: NavigationTarget,
        ev: React.MouseEvent<HTMLLIElement, MouseEvent>,
    ) => void = useCallback((target, ev) => {
        setSelectedTarget(target)
        if (typeof onNavigationTargetSelected === 'function') {
            onNavigationTargetSelected(target, ev)
        }
    }, [])
    
    return (
        <ul className={'navigation-list ' + accent}>{
            targets.map((target) => (
                <>
                    <li
                        className={'navigation-list-item ' + (selectedTarget === target ? 'selected' : '')}
                        onClick={(ev) => onListItemClick(target, ev)}
                    >
                        <div className='item-icon'><FontAwesomeIcon icon={target.icon} /></div>
                        <div className='item-label'>{target.label}</div>
                    </li>
                </>
            ))
        }</ul>
    )
}