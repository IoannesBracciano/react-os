import classNames from "classnames"
import { CSSProperties, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { load } from "../../system/apploader"
import { queueActor, selectQueue, stageActor } from "../../system/director/slice"
import LauncherSvc from "../../system/services/launcher"
import { withTooltip } from "../tooltip/tooltip"
import './AppLauncher.css'

export interface AppLauncherProps extends React.HTMLAttributes<HTMLDivElement> {
    appId: string
    appName: string
    forwardedRef?: React.Ref<HTMLDivElement> | undefined
    iconUrl: string
    path?: string
    scale?: string
    showAppName?: boolean
    size?: string
    style?: CSSProperties
}

export function AppLauncher({ appId, appName, forwardedRef, iconUrl, path, scale, showAppName, size, ...rest }: AppLauncherProps) {
    const dispatch = useDispatch()
    const queue = useSelector(selectQueue)

    const onAppLauncherIconClicked = useCallback(() => {
        if (path) {
            const actor = {
                id: appId,
                componentPath: path,
            }
            dispatch(queueActor({ actor }))
            load(path).then(() => {
                setTimeout(() => dispatch(stageActor({ actor })), 870)
            })
        } else {
            LauncherSvc.launch(appId)
        }
    }, [appId, dispatch, path])

    return (
        <div {...rest} className='app-launcher' ref={forwardedRef}>
            <div
                aria-label={appName}
                className={classNames('app-launcher-icon', {
                    queued: !!queue[appId]
                })}
                onClick={onAppLauncherIconClicked}
                role='button'
                style={{
                    backgroundImage: `url(${iconUrl})`,
                    backgroundPosition: 'center center',
                    backgroundSize: `calc(100% + ${scale || '36px'})`,
                    ...(size ? { height: size, width: size } : {})
                }}>
            </div>
            {showAppName && <div className='app-name'>{appName}</div>}
        </div>
    )
}

export const AppLauncherTooltip = withTooltip(
    AppLauncher, {
        align: 'center before',
        content: ({ appName }) => appName,
        delayIn: 100,
        delayOut: 100,
    },
)
