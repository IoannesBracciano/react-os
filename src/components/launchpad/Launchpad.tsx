import { HTMLAttributes, MouseEventHandler, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectInstalledApps } from '../../system/state/launcherSlice';
import { AppLauncher, AppLauncherTooltip } from '../app-launcher/AppLauncher';
import './Launchpad.css'

export interface LaunchpadProps {
    scale?: string
    size?: string
    style?: HTMLAttributes<HTMLDivElement>['style']
}

export type LaunchbarState = 'minimized' | 'expanded'

export function Launchpad({ scale, size = '36px', style }: LaunchpadProps) {
    const [state, setState] = useState<LaunchbarState>('minimized')
    const onLaunchpadBtnClicked: MouseEventHandler = useCallback((ev) => {
        ev.stopPropagation()
        setState('expanded')
    }, [])

    useEffect(() => {
        if (state === 'expanded') {
            const clickListener = () => setState('minimized')
            document.addEventListener('click', clickListener)
            return () => document.removeEventListener('click', clickListener)
        }
    }, [state])

    const installedApps = useSelector(selectInstalledApps)

    return (
        <div className='launchpad-container' style={style}>
            <div className='launchpad-panel' style={state === 'minimized' ? ({
                flexGrow: 0,
                height: size,
            }) : ({
                flexGrow: 1,
                height: '80vh',
                background: '#eaeaeace',
                backdropFilter: 'blur(80px) saturate(4)'
            })}>{state === 'expanded' &&
                <div className='launchpad-header'>
                    <input name='search' onClick={(ev) => ev.stopPropagation()} placeholder='Search apps' />
                </div>
                }<div className='apps' style={{
                    padding: state === 'minimized' ? '0' : '0 32px'
                }}>
                    <div
                        aria-label='Open launchpad'
                        className='launchpad-btn'
                        onClick={onLaunchpadBtnClicked}
                        role='button'
                        style={{
                            backgroundImage: `url(https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F736x%2Fce%2F30%2F8e%2Fce308e3b82b4bb9579af01f8a682e136--launcher-icon-logo-design-inspiration.jpg&f=1&nofb=1&ipt=dbed6826f24ca986138b931303305910607b890507150e7edcf4652e5819baef&ipo=images)`,
                            backgroundPosition: 'center center',
                            backgroundSize: `calc(100% + ${scale || '24px'})`,
                            borderRadius: '6px',
                            display: state === 'minimized' ? 'block' : 'none',
                            height: size,
                            width: size,
                        }}>
                    </div>{
                    Object.values(installedApps).filter((app) => app.showInLaunchpad).map((app) => (
                        <AppLauncherTooltip
                            appId={app.id}
                            appName={app.name}
                            iconUrl={app.icon}
                            path={app.url}
                            showAppName={state === 'expanded'}
                            size={state === 'minimized' ? size : '48px'} />
                    ))
                }</div>
            </div>
        </div>
    )
}
