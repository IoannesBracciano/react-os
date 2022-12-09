import { Note } from './Notebook.app'

export type ActionWithPayload<T extends string, P> = {
    payload: P
    type: T
}

export type Reducer<A extends string, P, S> = (state: S, action: ActionWithPayload<A, P>) => S

export type NoteCollectionState = {
    context: Note | null
    index: Record<string, Note>
    selection: string[]
}

function archiveNote(
    state: NoteCollectionState,
    action: ActionWithPayload<'archive-note', Note>,
) {
    const note = action.payload
    return ({
        ...state,
        index: {
            ...state.index,
            [note.id]: {
                ...note,
                archived: true,
            },
        },
        selection: state.selection.includes(note.id)
            ? [Object.entries(state.index).filter(([key, _note]) => !_note.archived && _note.id !== note.id)[0][0]]
            : state.selection,
    })
}

function archiveNotes(
    state: NoteCollectionState,
    action: ActionWithPayload<'archive-notes', Note[]>,
) {
    const notes = action.payload
    const newIndex = { ...state.index }
    notes.forEach((note) => {
        if (note) {
            newIndex[note.id] = { ...note, archived: true }
        }
    })
    return ({
        ...state,
        index: {
            ...newIndex,
        },
    })
}

function createNote(
    state: NoteCollectionState,
    action: ActionWithPayload<'create-note', Note>,
) {
    const note = action.payload
    return ({
        ...state,
        index: {
            [note.id]: note,
            ...state.index,
        },
        selection: [note.id],
    })
}

function deleteNote(
    state: NoteCollectionState,
    action: ActionWithPayload<'delete-note', Note>,
) {
    const note = action.payload
    const { [note.id]: _, ...rest } = state.index
    return ({
        ...state,
        index: rest,
        selection: state.selection.includes(note.id)
            ? [Object.keys(rest)[0]]
            : state.selection,
    })
}

function deleteNotes(
    state: NoteCollectionState,
    action: ActionWithPayload<'delete-note', Note[]>,
) {
    const noteIds = action.payload.map((note) => note.id)
    const newIndex = Object.fromEntries(
        Object.entries(state.index).filter(([key]) => !noteIds.includes(key))
    )
    return ({
        ...state,
        index: newIndex,
    })
}

function deselectAllNotes(
    state: NoteCollectionState,
    action: ActionWithPayload<'deselect-all-notes', null>,
) {
    return ({
        ...state,
        selection: [],
    })
}

function deselectNote(
    state: NoteCollectionState,
    action: ActionWithPayload<'deselect-note', Note>,
) {
    const note = action.payload
    const i = state.selection.findIndex((noteId) => noteId === note.id)
    if (i > -1) {
        return ({
            ...state,
            selection: [...state.selection.splice(i, 1)]
        })
    }
    return state
}

function duplicateNote(
    state: NoteCollectionState,
    action: ActionWithPayload<'duplicate-note', Note>,
) {
    const note = action.payload
    const newId = `note::${Date.now()}`
    const duplicate: Note = { 
        // All members of `Note` are primitive and copied by value
        ...note,
        id: newId,
        title: note.title.endsWith('(Copy)')
            ? note.title.slice(0, -1) + ' 2)'
            : note.title + ' (Copy)',
        created: Date.now(),
        lastEdited: Date.now(),
    }
    return {
        ...state,
        index: {
            ...state.index,
            [newId]: duplicate,
        },
        selection: [newId],
    }
}

function restoreNote(
    state: NoteCollectionState,
    action: ActionWithPayload<'restore-note', Note>,
) {
    const note = action.payload
    return ({
        ...state,
        index: {
            ...state.index,
            [note.id]: {
                ...note,
                archived: false,
            },
        },
    })
}

function restoreNotes(
    state: NoteCollectionState,
    action: ActionWithPayload<'restore-note', Note[]>,
) {
    const notes = action.payload
    const newIndex = { ...state.index }
    notes.forEach((note) => {
        if (note) {
            newIndex[note.id] = { ...note, archived: false }
        }
    })
    return ({
        ...state,
        index: newIndex,
    })
}

function setActive(
    state: NoteCollectionState,
    action: ActionWithPayload<'set-active', Note>,
) {
    const note = action.payload
    if (!state.selection.includes(note.id)) {
        return ({
            ...state,
            selection: [note.id],
        })
    }
    return state
}

function setContext(
    state: NoteCollectionState,
    action: ActionWithPayload<'set-context', Note | null>,
) {
    const note = action.payload
    if (state.context !== note) {
        return ({
            ...state,
            context: note,
        })
    }
    return state
}

function updateNote(
    state: NoteCollectionState,
    action: ActionWithPayload<'update-note', Note>,
) {
    const note = action.payload
    return ({
        ...state,
        index: {
            ...state.index,
            [note.id]: {
                ...state.index[note.id],
                ...note,
            },
        },
    })
}

export function combineReducers<S>(reducers: Record<string, Reducer<any, any, S>>) {
    return function <T extends string, P> (state: S, action: ActionWithPayload<T, P>) {
        return reducers[action.type](state, action)
    }
}

export default combineReducers({
    'archive-note': archiveNote,
    'archive-notes': archiveNotes,
    'create-note': createNote,
    'delete-note': deleteNote,
    'delete-notes': deleteNotes,
    'deselect-all-notes': deselectAllNotes,
    'deselect-note': deselectNote,
    'duplicate-note': duplicateNote,
    'restore-note': restoreNote,
    'restore-notes': restoreNotes,
    'set-active': setActive,
    'set-context': setContext,
    'update-note': updateNote,
})
