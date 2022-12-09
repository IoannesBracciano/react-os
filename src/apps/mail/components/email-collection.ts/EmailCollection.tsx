import { forwardRef } from 'react'
import { Collection, CollectionProps } from '../../../../components/collection/Collection'
import { withContextMenu } from '../../../../components/context-menu/ContextMenu'
import { CommonMenuItemKey, getCommonMenuItem } from '../../../../components/menu/Menu'
import { Email } from '../../Mail.app'

const contextMenuItemKeys: CommonMenuItemKey[] = ['forward', 'delete']

export const EmailCollection = withContextMenu(
    {
        items: contextMenuItemKeys.map(getCommonMenuItem),
    },
    forwardRef<HTMLUListElement, Omit<CollectionProps<Email>, 'children'>>((props, ref) => (
        <Collection {...props} forwardedRef={ref}>{
            ({ subject, senderName }) => (
                <>
                    <h4 className='email-subject'>{subject}</h4>
                    <div className='sender-name'>{senderName}</div>
                </>
            )
        }</Collection>
    )),
)