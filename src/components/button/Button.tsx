import classNames from 'classnames'
import { ButtonHTMLAttributes, forwardRef, ReactNode, RefObject } from 'react'
import './Button.css'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children?: ReactNode
    forwardedRef?: RefObject<HTMLButtonElement>
    space?: 'compact' | 'generous' | 'normal'
    variant?: 'primary' | 'secondary' | 'ghost'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    children,
    className = '',
    forwardedRef,
    space = 'normal',
    variant = 'ghost',
    ...attr
}: ButtonProps, ref) => {
    return (
        <button {...attr}
            className={classNames(className, 'btn', `btn-${variant}`, {
                compact: space === 'compact',
            })}
            ref={forwardedRef || ref}
        >
            {children}
        </button>
    )
})
