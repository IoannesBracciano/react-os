import { faBatteryThreeQuarters, faVolumeHigh, faWifi } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCached } from '../../system/apploader'
import { Actor, selectStage } from '../../system/director/slice'
import DesktopSvc from '../../system/services/desktop'
import { selectAccent, selectBackground, selectError, selectUser } from '../../system/state/desktopSlice'
import { AppCtorRegistry, selectStagedApps } from '../../system/state/launcherSlice'
import { Button } from '../button/Button'
import { Launchpad } from '../launchpad/Launchpad'
import { LockScreen } from '../lock-screen/LockScreen'
import { Menu } from '../menu/Menu'
import { Popup } from '../popup/Popup'
import { Window } from '../window/Window'
import './Desktop.css'

export interface DesktopProps {
    children: React.ReactNode
}

export function Desktop({ children }: DesktopProps) {
    const ref = useRef<HTMLDivElement | null>(null)
    const [hostEl, setHostEl] = useState<HTMLDivElement | null>(null)
    const accent = useSelector(selectAccent)
    const background = useSelector(selectBackground)
    const preinstalledBackgroundUrls = useMemo(() => DesktopSvc.getPreinstalledBackgroundUrls(), [])
    const stagedApps = useSelector(selectStagedApps)
    const loggedUser = useSelector(selectUser)
    const stage = useSelector(selectStage)

    useEffect(() => {
        if (ref && ref.current) {
            setHostEl(ref.current)
        }
    }, [ref])

    useEffect(() => {
        if (hostEl) {
            switch (accent) {
                case 'blue':
                    hostEl.style.setProperty('--text-color-highlight', '#0069ff')
                    hostEl.style.setProperty('--accent-color', '00 107 255')
                    hostEl.style.setProperty('--button-primary-bg', '#006bff')
                    hostEl.style.setProperty('--button-primary-active-bg', 'linear-gradient(180deg, #044ce1, #0064ee)')
                    hostEl.style.setProperty('--button-primary-border-bottom-color', '#003ebd')
                    break;
                case 'green':
                    hostEl.style.setProperty('--text-color-highlight', '#10a00b')
                    hostEl.style.setProperty('--bg-highlight', '#f2fee159')
                    hostEl.style.setProperty('--button-primary-bg', 'linear-gradient(350deg, #09b604, #04c500)')
                    break;
                case 'violette':
                    hostEl.style.setProperty('--text-color-highlight', '#8200ff')
                    hostEl.style.setProperty('--accent-color', '142 45 255')
                    hostEl.style.setProperty('--button-primary-bg', '#8e2dff')
                    hostEl.style.setProperty('--button-primary-active-bg', 'linear-gradient(180deg, #6a0bd0, #7412e4)')
                    hostEl.style.setProperty('--button-primary-border-bottom-color', '#570cae')
                    break;
                case 'yellow':
                    hostEl.style.setProperty('--text-color-highlight', '#ae8208')
                    hostEl.style.setProperty('--bg-highlight', '#ffffdd5c')
                    hostEl.style.setProperty('--button-primary-bg', 'linear-gradient(350deg, #ddb200, #fbc300)')
                    break;
            }
        }
    })

    const onBackgroundThumbClicked = useCallback((url: string) => {
        DesktopSvc.changeBackground(url)
    }, [])

    return (
        <div
            className={'desktop ' + (loggedUser ? 'logged' : '')}
            id='context-menu-container'
            ref={ref}
            style={{
                backgroundImage: `url(${background.url})`
            }}
        >
            <div id='popup-portal'></div>
            <LockScreen style={{ display: loggedUser ? 'none' : 'block' }} />{
            hostEl && loggedUser &&
            <Popup target={hostEl} trigger='contextmenu'>
                <h6>Background Image</h6>
                <div className='scroll-container' style={{ maxWidth: '200px' }}>
                    <div className='bg-thumb-carousel'>{
                            preinstalledBackgroundUrls.map((url) => (
                                <div className='bg-thumb' onClick={() => onBackgroundThumbClicked(url)}>
                                    <img alt='User avatar' className='thumb' src={url} />
                                </div>
                            ))
                    }<Button>+</Button></div>
                </div>
                <Menu items={[
                    { key: 'customize', label: 'Customize Desktop' },
                    { key: 'open_overview', label: 'Open Overview' },
                ]} />
            </Popup>
            }{children}{
                // Object.values(stagedApps).map(({ id, url }) => {
                //     // const ComponentApp = AppCtorRegistry[id]
                //     const ComponentApp = url ? React.lazy(() => import(`../../apps/${url}`)) : AppCtorRegistry[id]
                //     return <React.Suspense fallback={<Window appId={id}>Loading</Window>}>
                //         <ComponentApp key={id} />
                //     </React.Suspense>
                // })
                (Object.values(stage).filter(Boolean) as Actor[]).map(({ id, componentPath }) => {
                    const Component = getCached(componentPath)
                    return (
                        <div className='actor-wrapper'>
                            <Component key={id} />
                        </div>
                    )
                })
            }
            
            <div className='eventbar'>
                <div className='bubble'>
                    <div className='avatar'>
                        <img alt={loggedUser ? loggedUser.name + '\'s avatar' : 'User avatar'} src={loggedUser?.imageUrl} width="100%" />
                    </div>
                    {/* <div className='notifications' style={{ display: 'block' }}>
                        <span>Empty schedule and a great start for the week!</span>
                    </div> */}
                </div>
                <div className='bubble'>
                    <div className='clock'><span className='day-of-week'>MO</span> <span className='time'>12:48PM</span></div>
                </div>
                <div className='bubble'>
                    <span className='tray-icon'><FontAwesomeIcon icon={faWifi} /></span>
                    <span className='tray-icon'><FontAwesomeIcon icon={faVolumeHigh} /></span>
                    <span className='tray-icon'><FontAwesomeIcon icon={faBatteryThreeQuarters} /></span>
                </div>
            </div>
            <Launchpad style={{ display: loggedUser ? 'flex' : 'none' }} />
        </div>
    )
}