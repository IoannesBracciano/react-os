import { faAdd, faCheck, faPencil, faRightFromBracket, faUserPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { ChangeEventHandler, useCallback, useMemo } from "react"
import { useSelector } from "react-redux"
import { Button } from "../../../../components/button/Button"
import { WindowPaneHeader } from "../../../../components/window-pane-header/WindowPaneHeader"
import DesktopSvc from "../../../../system/services/desktop"
import { selectAccent, selectBackground, selectUser } from "../../../../system/state/desktopSlice"
import './UsersPane.css'

export function UsersPane() {
    const currentBackground = useSelector(selectBackground)

    const loggedUser = useSelector(selectUser)

    const onUserNameChange: ChangeEventHandler = useCallback((ev) => {
    }, [])


    return (
        <div className='users-pane'>
            <WindowPaneHeader>
                <Button className='btn-primary'>
                    <FontAwesomeIcon icon={faUserPlus} /> Add user
                </Button>
                {/* <Button className='btn-secondary'>
                    <FontAwesomeIcon icon={faRightFromBracket} /> Logout
                </Button> */}
            </WindowPaneHeader>
            <div className="scroll-view">
                <div className='section'>
                    {/* <h3>Logged in as</h3> */}
                    <div className='user-badge user-badge-lg' style={{
                        margin: '0 auto',
                        marginTop: '64px',
                    }}>
                    <div className='faint-background' style={{
                        backgroundImage: `url(${currentBackground?.url})`,
                    }}></div>
                        <div>
                            <img
                                alt='User'
                                className='user-image thumb-lg round'
                                src={loggedUser?.imageUrl}
                            />
                        </div>
                        {/* <div>
                            <input
                                className='user-name'
                                value={loggedUser?.name}
                                name='user-name'
                                onChange={onUserNameChange}
                            />
                        </div> */}
                        <Button className='user-name-btn'>
                            <FontAwesomeIcon icon={faPencil} />
                            <span>{loggedUser?.name}</span>
                        </Button>
                        <Button className='btn-secondary'>Change password</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}