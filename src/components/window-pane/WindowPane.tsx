import React from 'react'
import './WindowPane.css'

export interface WindowPaneProps {
    children?: React.ReactNode
    color?: string
    grow?: boolean
    id?: string
    opacity?: number
    shrink?: boolean
    size?: string
}

export function WindowPane({ children, color, grow, id, opacity, shrink, size }: WindowPaneProps) {
    return (
        <div
            className={'window-pane window-drag-surface'}
            id={id}
            style={{
                backgroundColor: color || `rgba(255, 252, 250, ${opacity})`,
                flexBasis: size,
                flexGrow: +(!!grow),
                flexShrink: +(!!shrink),
                width: size,
            }}
        >
            {children}
        </div>
    )
}