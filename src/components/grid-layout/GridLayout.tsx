import classNames from 'classnames'
import { HTMLAttributes, ReactNode } from 'react'
import './GridLayout.css'

export interface GridLayoutProps extends HTMLAttributes<HTMLDivElement>{
    children: ReactNode
    columns?: number | string[]
    rows?: number | string[]
}

export function GridLayout({
    children,
    columns = [],
    rows = [],
    ...attrs
}: GridLayoutProps) {
    return (
        <div {...attrs}
            className={classNames('grid-layout', attrs.className)}
            style={{
                ...attrs.style,
                gridTemplateColumns: typeof columns === 'number'
                    ? '1fr '.repeat(columns)
                    : columns.join(' '),
                gridTemplateRows: typeof rows === 'number'
                    ? '1fr '.repeat(rows)
                    : rows.length ? rows.join(' ') : undefined,
            }}>
            {children}
        </div>
    )
}