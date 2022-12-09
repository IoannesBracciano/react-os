import React, { CSSProperties, DOMAttributes, DragEventHandler, MouseEventHandler } from 'react'

export interface ForwardedProps {
    className?: string
    id?: string
    style?: CSSProperties
}

// type PickByType<T, Value> = {
//     [P in keyof T as T[P] extends Value | undefined ? P : never]: T[P]
// }

// export type ReactMouseEventHandlers<T> = PickByType<DOMAttributes<T>, MouseEventHandler<T>>

// export interface ReactMouseEvents<T = MouseEventHandler> {
//     onClick?: T
//     onContextMenu?: T
//     onHover?: T
//     onMouseDown?: T
//     onMouseEnter?: T
//     onMouseLeave?: T
//     onMouseMove?: T
//     onMouseUp?: T
// }
