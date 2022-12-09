import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { HTMLAttributes, KeyboardEventHandler, useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import DesktopSvc from '../../system/services/desktop'
import { selectError } from '../../system/state/desktopSlice'
import { Button } from '../button/Button'
import './LockScreen.css'

export interface LockScreenProps {
    style?: HTMLAttributes<HTMLDivElement>['style']
}

export function LockScreen({ style }: LockScreenProps) {
    const pwdInputRef = useRef<HTMLInputElement>(null)
    const error = useSelector(selectError)

    const onLoginButtonClick = useCallback(() => {
        if (pwdInputRef && pwdInputRef.current) {
            DesktopSvc.login('ioannes', pwdInputRef.current.value)
        }
    }, [pwdInputRef])

    const onUserPasswordInputKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback((ev) => {
        if (ev.key === 'Enter') {
            onLoginButtonClick()
        }
    }, [onLoginButtonClick])

    const onChangeUserButtonClick = useCallback(() => {

    }, [])

    return (
        <div className='lockscreen' style={style}>
            <div className='login-pane'>
                <div className='user-info'>
                    <div className='user-avatar'>
                        <img alt='User avatar' src='https://scontent.fbcn7-3.fna.fbcdn.net/v/t1.6435-9/50057218_10156910271328633_608162502915653632_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=vfCZH4uvtEYAX_dzmcG&_nc_ht=scontent.fbcn7-3.fna&oh=00_AT9SK7uZ0zvBVj2ue4fYlEHIQpsj9ZRL9Y3nRKkqqtGtSA&oe=6374307F' />
                    </div>
                    <div className='user-pane'>
                        <h3 className='username'>Ioannes</h3>
                        <input
                            autoFocus
                            className={classNames({
                                error: !!error,
                            })}
                            name='user-password'
                            onKeyDown={onUserPasswordInputKeyDown}
                            ref={pwdInputRef}
                            type='password'
                        />
                        <Button className='login' onClick={onLoginButtonClick}>
                            <FontAwesomeIcon icon={faArrowCircleRight} />
                        </Button>
                        {error ? (
                            <div className='form-error-message'>
                                {error.message}
                            </div>
                        ) : null}
                    </div>
                    <Button className='btn btn-flat change-user' onClick={onChangeUserButtonClick}>Not Ioannes?</Button>
                </div>
            </div>    
        </div>
    )
}