import { faBoxArchive } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { negate } from 'lodash'
import React from 'react'
// import { Collection, CollectionProps } from '../../../../components/collection/Collection'
import { withContextMenu5, withContextMenu6, WithContextMenuProps } from '../../../../components/context-menu/ContextMenu'
import { ListView, ListViewProps } from '../../../../components/list-view/ListView'
import { MenuItem } from '../../../../components/menu/Menu'
import { Note, timeAgo } from '../../Notebook.app'
import './NoteList.css'

const sortNotesByLastEditedDate = (noteA: Note, noteB: Note) =>
    noteB.lastEdited - noteA.lastEdited

const filterArchivedNotes = (note: Note) => !!note.archived

export const NoteList = React.memo(({ dispatch, ...props }: Omit<ListViewProps<Note, 'id'>, 'children'> & { dispatch: React.Dispatch<any> }) => 
    <ListView<Note, 'id'>
        {...props}
        // filter={negate(filterArchivedNotes)}
        group={{
            keyBy: 'archived',
            label: (value: boolean | undefined) =>
                !!value ? 'Archived' : 'default',
        }}
        onCreateContextMenu={getNoteListContextMenuItems(dispatch)}
        selectionMode='multiple'
        sort={sortNotesByLastEditedDate}
    >{(note) => <>
        <div className='list-item-title'>
            {note.archived && <span className='archived-icon'>
                <FontAwesomeIcon icon={faBoxArchive} />
            </span>}
            <span className='note-title'>
                {note.title || 'Untitled Note'}
            </span>
        </div>
        <div className='list-item-date'>
            {timeAgo(note.lastEdited)}
        </div>
    </>}</ListView>
)

const getNoteListContextMenuItems = (dispatch: React.Dispatch<any>) => (targets: Note[]) => [
    (
        targets.some((note) => !note.archived) && ({
            action: { type: 'archive-notes', payload: targets },
            key: 'action-item-archive-notes',
            label: 'Archive',
            onAction: () => dispatch({
                type: 'archive-notes',
                payload: targets,
            })
        })
    ),
    (
        targets.every((note) => note.archived) && ({
            action: { type: 'delete-notes', payload: targets },
            key: 'action-item-delete-notes',
            label: 'Delete',
            onAction: () => dispatch({
                type: 'delete-notes',
                payload: targets,
            })
        })
    ),
    (
        targets.length === 1 && ({
            action: { type: 'duplicate-note', payload: targets[0] },
            key: 'action-item-duplicate-note',
            label: 'Clone',
            onAction: () => dispatch({
                type: 'duplicate-note',
                payload: targets[0],
            })
        })
    ),
    (
        targets.some((note) => note.archived) && ({
            action: { type: 'restore-notes', payload: targets },
            key: 'action-item-restore-notes',
            label: 'Restore',
            onAction: () => dispatch({
                type: 'restore-notes',
                payload: targets,
            })
        })
    ),
].filter(Boolean) as MenuItem[]

// const contextMenuItems = [
//     {
//         action: { type: 'archive-notes' },
//         key: 'action-item-archive-notes',
//         label: 'Archive',
//         visible: (targets: Note[]) => targets.some((note) => !note.archived),
//     },
//     {
//         action: { type: 'delete-notes' },
//         key: 'action-item-delete-notes',
//         label: 'Delete',
//         // visible: (notes: Note[]) => notes.some((note) => note.archived),
//         visible: (targets: Note[]) => targets.every((note) => note.archived),
//     },
//     {
//         action: { type: 'duplicate-note' },
//         key: 'action-item-duplicate-note',
//         label: 'Clone',
//         // visible: (notes: Note[]) => notes.some((note) => !note.archived),
//         visible: (targets: Note[]) => targets.length === 1,
//     },
//     {
//         action: { type: 'restore-notes' },
//         key: 'action-item-restore-notes',
//         label: 'Restore',
//         // visible: (notes: Note[]) => notes.some((note) => !note.archived),
//         visible: (targets: Note[]) => targets.some((note) => note.archived),
//     },
// ]

// export const NoteList = (props: Omit<ListViewProps<Note, 'id'>, 'children'> & Pick<WithContextMenuProps, 'onMenuItemSelect'>) => {
//     const [menuItems, setMenuItems] = React.useState<MenuItem[]>([])

//     const index = React.useMemo(() => props.collection.index, [props.collection.index])

//     const handleActionTargetsChange = React.useCallback((targets: string[]) => {
//         const targetNotes = targets.map((target) => index[target]).filter(Boolean)
//         setMenuItems(getNoteListContextMenuItems(targetNotes))
//     }, [index])
//     return (
//         <NoteListBase
//             {...props}
//             menuItems={menuItems}
//             onActionTargetsChange={handleActionTargetsChange}
//         />
//     )
// }

// export const NoteList = withContextMenu5(
//     'noteList',
//     _NoteList,
// )


// export const NoteList = withContextMenu5(
//     (props: Omit<CollectionProps<Note>, 'children'>) => 
//         <Collection {...props}>{
//             (note) => (<>
//                 <div className='list-item-title'>
//                     {note.archived && <span className='archived-icon'>
//                         <FontAwesomeIcon icon={faBoxArchive} />
//                     </span>}
//                     <span className='note-title'>{note.title || 'Untitled Note'}</span>
//                 </div>
//                 <div className='list-item-date'>
//                     {timeAgo(note.lastEdited)}
//                 </div>
//             </>)
//         }</Collection>,
// )


// export const NoteList = withContextMenu2(
//     (props: Omit<CollectionProps<Note>, 'children'>) => 
//         <Collection {...props}>{
//             (note) => (<>
//                 <div className='list-item-title'>
//                     {note.archived && <span className='archived-icon'>
//                         <FontAwesomeIcon icon={faBoxArchive} />
//                     </span>}
//                     <span className='note-title'>{note.title || 'Untitled Note'}</span>
//                 </div>
//                 <div className='list-item-date'>
//                     {timeAgo(note.lastEdited)}
//                 </div>
//             </>)
//         }</Collection>,
//     (note: Note, event: MouseEvent<HTMLLIElement>) => {
//         event.preventDefault()
//         return ({
//             anchor: DOMRect.fromRect({ x: event.pageX, y: event.pageY }),
//             items: note.archived ? [{
//                 action: { type: 'restore-note' },
//                 icon: faTrashRestore,
//                 key: 'restore',
//                 label: 'Restore',
//             }, {
//                 action: { type: 'delete-note' },
//                 icon: faDeleteLeft,
//                 key: 'delete',
//                 label: 'Delete',
//             }] : [
//                 // {
//                 //     action: createNote(),
//                 //     icon: faPlus,
//                 //     key: 'create',
//                 //     label: 'Create new',
//                 // }, 
//             {
//                 action: duplicateNote(note),
//                 icon: faClone,
//                 key: 'duplicate',
//                 label: 'Duplicate',
//             }, {
//                 action: archiveNote(note),
//                 icon: faBoxArchive,
//                 key: 'archive',
//                 label: 'Archive',
//             }],
//             payload: note,
//             show: true,
//         })
//     },
//     ['onItemContextMenu'],
// )
