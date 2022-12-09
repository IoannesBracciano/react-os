import classNames from 'classnames'
import { HTMLAttributes, ReactNode } from 'react'
import './FlexLayout.css'

export interface FlexLayoutProps extends HTMLAttributes<HTMLDivElement> {
    align?: 'center' | 'end' | 'start' | 'unset'
    children: ReactNode
    direction?: 'horizontal' | 'vertical'
    gap?: 'xxxs' | 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'
    justify?: 'center' | 'end' | 'start'
}

export function FlexLayout({
    align = 'unset',
    children,
    className,
    direction = 'horizontal',
    gap = 'xxxs',
    justify = 'start',
    ...attrs
}: FlexLayoutProps) {
    return (
        <div {...attrs}
            className={classNames(className, `align-${align}`, 'flex-layout', `gap-${gap}`, {
                'justify-center': justify === 'center',
                'justify-end': justify === 'end',
                'justify-start': justify === 'start',
                'horizontal': direction === 'horizontal',
                'vertical': direction === 'vertical',
            })}
        >
            {children}
        </div>
    )
}
