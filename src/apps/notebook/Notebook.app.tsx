import { faShare, faBold, faItalic, faUnderline, faStrikethrough, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ContentState, convertFromRaw, convertToRaw, Editor, EditorState, RichUtils } from 'draft-js'
import { WindowPaneHeaderTitle } from '../../components/window-pane-header-title/WindowPaneHeaderTitle'
import { WindowPaneHeader } from '../../components/window-pane-header/WindowPaneHeader'
import { WindowPane } from '../../components/window-pane/WindowPane'
import { Window } from '../../components/window/Window'
import { Button } from '../../components/button/Button'
import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useAppStorage } from '../../sdk/storage'
import { ToggleButton } from '../../components/toggle-button/ToggleButton'
import { Select, SelectOption } from '../../components/select/Select'
import { FlexLayout } from '../../components/flex-layout/FlexLayout'
import collectionReducer from './reducers';
import { createNote, setActive } from './actions';
import { NoteList } from './components/note-list/NoteList';
import './Notebook.app.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const appParams = {
    id: 'notebook',
    name: 'Notebook',
    showInLaunchpad: true
}

export type Note = {
    archived?: boolean
    content: string
    created: number
    id: string
    lastEdited: number
    title: string
}

export type NoteCollectionState = {
    active: Note | null
    collection: Record<string, Note>
    filtered: Record<string, Note>
    focused: Note | null
}

export function NotebookApp() {
    const [storedNotes, setStoredNotes] = useAppStorage<Record<string, Note>>('notebook', 'notes', {})
    const [editorState, setEditorState] = useState(EditorState.createEmpty())
    const [boldActive, setBoldActive] = useState(false)
    const [italicActive, setItalicActive] = useState(false)
    const [underlineActive, setUnderlineActive] = useState(false)
    const [strikethroughActive, setStrikethroughActive] = useState(false)
    const blockStyles = useMemo(() => [
        {
            key: 'none',
            label: 'None',
            value: 'unstyled',
        },
        {
            as: 'p',
            key: 'paragraph',
            label: 'Paragraph',
            value: 'paragraph',
        },
        {
            as: 'h1',
            key: 'title',
            label: 'Title',
            value: 'header-one',
        },
        {   as: 'h2',
            key: 'subtitle',
            label: 'Subtitle',
            value: 'header-two',
        },
        {   as: 'h3',
            key: 'heading',
            label: 'Heading',
            value: 'header-three',
        },
        {   as: 'h4',
            key: 'subheading',
            label: 'Subeading',
            value: 'header-four',
        },
        {   as: 'h5',
            key: 'caption',
            label: 'Caption',
            value: 'header-five',
        },
        {   as: 'code',
            key: 'code',
            label: 'Code',
            value: 'code-block',
        },
    ] as SelectOption<string>[], [])
    const [blockStyle, setBlockStyle] = useState<SelectOption<string>>()
    const editorRef = useRef<Editor>(null)
    const [notes, dispatch] = useReducer(collectionReducer, {
        context: null,
        index: storedNotes,
        selection: [],
    })
    const [selection, setSelection] = useState<Note['id'][]>([])
    const [draftNoteId, setDraftNoteId] = React.useState<Note['id'] | null>(selection[0])

    useEffect(() => {
        setStoredNotes(notes.index)
    }, [notes.index, setStoredNotes])

    useEffect(() => {
        const styles = editorState.getCurrentInlineStyle()
        setBoldActive(styles.has('BOLD'))
        setItalicActive(styles.has('ITALIC'))
        setUnderlineActive(styles.has('UNDERLINE'))
        setStrikethroughActive(styles.has('STRIKETHROUGH'))
        const currentBlockType = RichUtils.getCurrentBlockType(editorState)
        const blockStyle = blockStyles.find(({ value }) => currentBlockType === value)
        if (blockStyle) {
            setBlockStyle(blockStyle)
        }
    }, [blockStyles, editorState])

    const loadDraftNote = React.useCallback((noteId: Note['id'] | null | undefined) => {
        if (noteId && noteId !== draftNoteId) {
            try {
                const contentState = JSON.parse(notes.index[noteId].content)
                setEditorState(EditorState.createWithContent(
                    convertFromRaw(contentState)
                ))
            } catch {
                setEditorState(EditorState.createWithContent(
                    ContentState.createFromText(notes.index[noteId].content)
                ))
            }
        }
    }, [draftNoteId, notes.index])

    const handleNoteListSelectionChange = useCallback((selection: Note['id'][]) => {
        setTimeout(() => {
            setSelection(selection)
            setDraftNoteId(selection[0])
            loadDraftNote(selection[0])
        }, 10)
    }, [loadDraftNote])

    const onCreateNoteBtnClick = useCallback(() => {
        const createNoteAction = createNote()
        dispatch(createNoteAction)
        dispatch(setActive(createNoteAction.payload))
    }, [])

    const handleEditorBlur = React.useCallback(() => {
    }, [])

    const onEditorStateChange = useCallback((newEditorState: EditorState) => {
        if (draftNoteId) {
            const title = newEditorState.getCurrentContent().getFirstBlock().getText().slice(0, 160)
            const content = JSON.stringify(convertToRaw(newEditorState.getCurrentContent()))
            if (content !== notes.index[draftNoteId].content) {
                dispatch({ type: 'update-note', payload: {
                    id: draftNoteId,
                    title,
                    content,
                    lastEdited: Date.now(),
                }})
            }
        }
        setEditorState(newEditorState)
    }, [draftNoteId, notes.index])

    const onToggleInlineStyle = useCallback((style: 'BOLD' | 'ITALIC' | 'UNDERLINE' | 'STRIKETHROUGH') => {
        return () => {
            setEditorState((editorState) => RichUtils.toggleInlineStyle(editorState, style));
        }
    }, [])

    const onBlockStyleSelect = useCallback((option: SelectOption<string> | undefined) => {
        if (option) {
            setEditorState((editorState) => RichUtils.toggleBlockType(editorState, option.value))
        }
    }, [])

    return (
        <Window appId={appParams.id}>
            <FlexLayout>
                <WindowPane size='220px' color='rgb(255 245 199 / 62%)'>
                    <WindowPaneHeader>
                        <WindowPaneHeaderTitle>Notebook</WindowPaneHeaderTitle>
                        <Button
                            onClick={onCreateNoteBtnClick}
                        >
                            <FontAwesomeIcon icon={faPlus} />
                        </Button>
                    </WindowPaneHeader>
                    <div className='scroll-view' style={{ padding: '12px' }}>
                        <NoteList
                            collection={notes}
                            dispatch={dispatch}
                            onSelectionChange={handleNoteListSelectionChange}
                        />
                    </div>
                </WindowPane>
                <WindowPane grow opacity={0.88} shrink>
                    <WindowPaneHeader>
                        <div className='button-group'>
                            <ToggleButton
                                active={boldActive}
                                onClick={onToggleInlineStyle('BOLD')}
                            >
                                <FontAwesomeIcon icon={faBold} />
                            </ToggleButton>
                            <ToggleButton 
                                active={italicActive}
                                onClick={onToggleInlineStyle('ITALIC')}
                            >
                                <FontAwesomeIcon icon={faItalic} />
                            </ToggleButton>
                            <ToggleButton 
                                active={underlineActive}
                                onClick={onToggleInlineStyle('UNDERLINE')}
                            >
                                <FontAwesomeIcon icon={faUnderline} />
                            </ToggleButton>
                            <ToggleButton 
                                active={strikethroughActive}
                                onClick={onToggleInlineStyle('STRIKETHROUGH')}
                            >
                                <FontAwesomeIcon icon={faStrikethrough} />
                            </ToggleButton>
                        </div>
                        <Select
                            id='block-style-select'
                            onChange={onBlockStyleSelect}
                            onMouseDown={e => e.preventDefault()}
                            options={blockStyles}
                            placeholder='Select block style'
                            selectedOption={blockStyle}
                        />
                        <div style={{ flexGrow: 1 }}></div>
                        <Button><FontAwesomeIcon icon={faShare} /></Button>
                    </WindowPaneHeader>{
                        draftNoteId ? (
                            <div className='note-container scroll-view'>
                                <Editor editorState={editorState} onBlur={handleEditorBlur} onChange={onEditorStateChange} ref={editorRef} />
                            </div>
                        ) : null
                }</WindowPane>
            </FlexLayout>
        </Window>
    )
}

export function timeAgo(dateInMilisecond: number) {
    if (dateInMilisecond > Date.now()) {
        // Only the past, sorry!
        return
    }

    const dateInSeconds = dateInMilisecond / 1000
    const now = Date.now() / 1000
    const diffSeconds = now - dateInSeconds
    if (diffSeconds < 60) {
        return 'just now'
    }

    const diffMinutes = Math.round(diffSeconds / 60)
    if (diffMinutes < 28) {
        return `${diffMinutes} minutes ago`
    }
    if (diffMinutes >= 28 && diffMinutes < 33) {
        return 'half hour ago'
    }
    if (diffMinutes < 60) {
        return 'less than an hour ago'
    }

    const diffHours = Math.round(diffMinutes / 60)
    if (diffHours === 1) {
        return 'about an hour ago'
    }
    if (diffHours < 24) {
        return `${diffHours} hours ago`
    }

    const diffDays = Math.round(diffHours / 24)
    if (diffDays === 1) {
        return 'yesterday'
    }
    if (diffDays < 7) {
        return `${diffDays} days ago`
    }
    if (diffDays === 7) {
        return 'last week'
    }

    const date = new Date(dateInMilisecond)
    return `on ${date.toLocaleDateString()}`
}

// eslint-disable-next-line import/no-anonymous-default-export
// export default {
//     ctor: NotebookApp,
//     params: appParams
// }

export default NotebookApp

