import React from 'react'
import './WindowPaneHeader.css'

export interface WindowPaneHeaderProps {
    children?: React.ReactNode
}

export function WindowPaneHeader({ children }: WindowPaneHeaderProps) {
    return (
        <div className='window-pane-header window-drag-surface'>
            {children}
        </div>
    )
}

WindowPaneHeader.Spring = function () {
    return <div className='window-pane-header-spring' style={{ flexGrow: 1 }}></div>
}
