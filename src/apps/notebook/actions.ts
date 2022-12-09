import { Note } from './Notebook.app'

export function archiveNote(note: Note) {
    return {
        type: 'archive-note',
        payload: note,
    }
}

export function archiveNotes(notes: Note[]) {
    return {
        type: 'archive-notes',
        payload: notes,
    }
}

export function createNote(note = createEmptyNote()) {
    return {
        type: 'create-note',
        payload: note,
    }
}

export function deleteNote(note: Note) {
    return {
        type: 'delete-note',
        payload: note,
    }
}

export function deleteNotes(notes: Note[]) {
    return {
        type: 'delete-notes',
        payload: notes,
    }
}

export function duplicateNote(note: Note) {
    return {
        type: 'duplicate-note',
        payload: note,
    }
}

export function duplicateNotes(notes: Note[]) {
    return {
        type: 'duplicate-notes',
        payload: notes,
    }
}

export function restoreNote(note: Note) {
    return {
        type: 'restore-note',
        payload: note,
    }
}

export function restoreNotes(notes: Note[]) {
    return {
        type: 'restore-notes',
        payload: notes,
    }
}

export function setActive(note: Note) {
    return {
        type: 'set-active',
        payload: note,
    }
}

export function createEmptyNote(id = `note::${Date.now()}`): Note {
    return {
        content: '',
        created: Date.now(),
        id,
        lastEdited: Date.now(),
        title: '',
    }
}

const actionLabelDictionary = new Map<Function, string>([
    [archiveNote, 'Archive'] as const,
    [archiveNotes, 'Archive'] as const,
    [deleteNote, 'Delete'] as const,
    [deleteNotes, 'Delete'] as const,
    [duplicateNote, 'Clone'] as const,
    [restoreNote, 'Restore'] as const,
    [restoreNotes, 'Restore'] as const,
])

function getContextMenuActionItem(actionCtor: (payload: any) => any, payload: any) {
    return {
        ...actionCtor(payload),
        label: actionLabelDictionary.get(actionCtor),
    }
}

export function getContextMenuActionItems(targetNotes: Note[]) {
    if (targetNotes.length === 1) {
        const [targetNote] = targetNotes
        return targetNote.archived
            ? [
                getContextMenuActionItem(restoreNote, targetNote),
                getContextMenuActionItem(deleteNote, targetNote),
            ] : [
                getContextMenuActionItem(duplicateNote, targetNote),
                getContextMenuActionItem(archiveNote, targetNote),
            ]
    }
}
