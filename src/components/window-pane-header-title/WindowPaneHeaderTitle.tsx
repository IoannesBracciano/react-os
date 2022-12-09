import React from 'react'
import './WindowPaneHeaderTitle.css'

export interface WindowPaneHeaderTitleProps {
    children: string
}

export function WindowPaneHeaderTitle({ children }: WindowPaneHeaderTitleProps) {
    return (
        <span className='window-pane-header-title'>
            <h4>{children}</h4>
        </span>
    )
}