import { faInbox, faVoicemail, faDraftingCompass, faPencil } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
// import {ContentState, convertFromRaw, convertToRaw, Editor, EditorState, RichUtils} from 'draft-js'
import { WindowPaneHeaderTitle } from '../../components/window-pane-header-title/WindowPaneHeaderTitle'
import { WindowPaneHeader } from '../../components/window-pane-header/WindowPaneHeader'
import { WindowPane } from '../../components/window-pane/WindowPane'
import { Window } from '../../components/window/Window'
import { Button } from '../../components/button/Button'
import { MouseEventHandler, useCallback, useMemo, useState } from 'react'
import { HorizontalNavigation, NavigationTarget } from '../../components/horizontal-navigation/HorizontalNavigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { EmailCollection } from './components/email-collection.ts/EmailCollection'
import './Mail.app.css'
import { FlexLayout } from '../../components/flex-layout/FlexLayout'

const appParams = {
    id: 'mail',
    name: 'Mail',
    showInLaunchpad: true
}

// const LOCAL_STORAGE_KEY = '/apps/mail'

export type Email = {
    key: string
    senderName: string
    subject?: string
}

export interface Thread {
    id: string
    snippet: string
    historyId: string
}

export function MailApp() {
    const [selectedMail, setSelectedMail] = useState<Email>()

    // const [threads, setThreads] = useState<Thread[]>([])

    // const [selectedThread, setSelectedThread] = useState<Thread>()

    // const [state, dispatch] = useReducer<Email[]>((state, action) => {
    //     switch (action.type) {
    //         case 'archive':
    //             return []
    //         default:
    //             return []
    //     }
    // }, [])

    const mailNavTargets: NavigationTarget[] = useMemo(() => [
        {
            icon: faInbox,
            id: 'mail-nav-target-inbox',
            label: 'Inbox'
        },
        {
            icon: faVoicemail,
            id: 'mail-nav-target-sent',
            label: 'Sent'
        },
        {
            icon: faDraftingCompass,
            id: 'mail-nav-target-draft',
            label: 'Draft'
        },
        {
            icon: faTrashCan,
            id: 'mail-nav-target-spam',
            label: 'Spam'
        },
    ], [])

    // useEffect(() => {
    //     gmailApi.getThreadsList(true, 10, 'me').then((res) => {
    //         setThreads(res.result.threads)
    //       })
    // }, [])

    const mails = useMemo(() => [{
        key: 'inbox#0',
        senderName: 'Joe Garfield',
        subject: 'Check out this design',
    }, {
        key: 'inbox#1',
        senderName: 'Mark Zuckerberg',
        subject: 'Should I buy SHIB?',
    }], [])

    // const onCollectionItemMouseDown: CollectionItemEventHandler<Email>
    //     = useCallback((item) => {
    //         setSelectedMail(item)
    //     }, [])

    const handleClick: MouseEventHandler = useCallback((event) => {
        const key = event.currentTarget.getAttribute('id')
        const mail = mails.find((mail) => mail.key === key)
        setSelectedMail(mail)
    }, [mails])

    return (
        <Window appId={appParams.id}>
            <FlexLayout>
                <WindowPane size='50px' opacity={0.4}>
                    <WindowPaneHeader>
                        <WindowPaneHeaderTitle> </WindowPaneHeaderTitle>
                        {/* <Button>{faUser}</Button> */}
                    </WindowPaneHeader>
                    <HorizontalNavigation targets={mailNavTargets} />
                </WindowPane>
                <WindowPane size='220px' opacity={0.62}>
                    <WindowPaneHeader>
                        <div style={{ flexGrow: 1 }}></div>
                        <Button className='btn-primary'>
                            <FontAwesomeIcon icon={faPencil} /> Compose
                        </Button>
                    </WindowPaneHeader>
                        <EmailCollection
                            items={mails}
                            onClick={handleClick}
                            onMouseDown={handleClick}
                            selectedItem={selectedMail}
                        />
                </WindowPane>
                <WindowPane grow opacity={0.88} shrink>
                    <WindowPaneHeader>
                        <div className='email-brief'>
                            <div className='email-subject'>Should I buy SHIB?</div>
                            <div className='sender-name'>Mark Zuckerberg</div>
                            {/* <div className='sender-address'>zucker@meta.com</div> */}
                        </div>
                    </WindowPaneHeader>
                </WindowPane>
            </FlexLayout>
        </Window>
    )
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    ctor: MailApp,
    params: appParams
}
