import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useCallback, useMemo } from "react"
import { useSelector } from "react-redux"
import { Button } from "../../../../components/button/Button"
import { WindowPaneHeader } from "../../../../components/window-pane-header/WindowPaneHeader"
import DesktopSvc from "../../../../system/services/desktop"
import { selectAccent, selectBackground } from "../../../../system/state/desktopSlice"
import './AppearancePane.css'

export function AppearancePane() {
    const currentAccent = useSelector(selectAccent)

    const currentBackground = useSelector(selectBackground)

    const preinstalledBackgroundUrls = useMemo(() => DesktopSvc.getPreinstalledBackgroundUrls(), [])

    const onBackgroundThumbClicked = useCallback((url: string) => {
        DesktopSvc.changeBackground(url)
    }, [])

    return (
        <>
            <WindowPaneHeader>
                <h1>Appearance</h1>
            </WindowPaneHeader>
            <div className='settings-pane-body scroll-view'>
            <ul className='settings-list'>
                    <li className='item item-block setting-thumb-list'>
                        <div className='setting-label'>
                            <h4>Desktop Background</h4>
                            <span>Choose an image for your desktop background</span>
                        </div>
                        <div className='setting-control'>
                            <div className='image-grid'>{
                                preinstalledBackgroundUrls.map((url) => (
                                    <div
                                        className={'thumb thumb-md' + (currentBackground.url === url ? ' selected' : '')}
                                        onClick={() => onBackgroundThumbClicked(url)}
                                    >
                                        <img alt='Desktop' src={url} />
                                    </div>
                                ))
                            }</div>
                        </div>
                    </li>
                </ul>
                {/* <div className='section'>
                    <h3>Background Image</h3>
                    <div className='image-grid'>{
                        preinstalledBackgroundUrls.map((url) => (
                            <div
                                className={'thumb thumb-lg' + (currentBackground.url === url ? ' selected' : '')}
                                onClick={() => onBackgroundThumbClicked(url)}
                            >
                                <img className='thumb' src={url} />
                            </div>
                        ))
                    }</div>
                </div> */}
                <div className='section'>
                    <h3>Accent</h3>
                    <div className='accent-palette'>
                        <div className='swatch' id='violete' onClick={() => DesktopSvc.setAccent('violette')}>
                            {currentAccent === 'violette' && <FontAwesomeIcon icon={faCheck} />}
                        </div>
                        <div className='swatch' id='blue' onClick={() => DesktopSvc.setAccent('blue')}>
                            {currentAccent === 'blue' && <FontAwesomeIcon icon={faCheck} />}
                        </div>
                        <div className='swatch' id='green' onClick={() => DesktopSvc.setAccent('green')}>
                            {currentAccent === 'green' && <FontAwesomeIcon icon={faCheck} />}
                        </div>
                        <div className='swatch' id='yellow' onClick={() => DesktopSvc.setAccent('yellow')}>
                            {currentAccent === 'yellow' && <FontAwesomeIcon icon={faCheck} />}
                        </div>
                        <Button className='btn-primary'>Test button</Button>
                    </div>
                </div>
                <div className='section'>
                    <h3>Theme</h3>
                    <div className="theme-list">
                        <div className="theme-preview selected" id="theme-light">
                            <div className="theme-gradient"></div>
                            <div className="highlight"></div>
                            <div className="theme-name">Light</div>
                        </div>
                        <div className="theme-preview" id="theme-dark">
                            <div className="theme-gradient"></div>
                            <div className="highlight"></div>
                            <div className="theme-name">Dark</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}