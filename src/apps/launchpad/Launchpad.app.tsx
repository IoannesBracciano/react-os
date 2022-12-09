import { WindowPaneHeaderTitle } from "../../components/window-pane-header-title/WindowPaneHeaderTitle";
import { WindowPaneHeader } from "../../components/window-pane-header/WindowPaneHeader";
import { WindowPane } from "../../components/window-pane/WindowPane";
import { Window } from "../../components/window/Window";
import { useSelector } from "react-redux";
import { selectInstalledApps } from "../../system/state/launcherSlice";
import { AppLauncher, AppLauncherTooltip } from "../../components/app-launcher/AppLauncher";
import './Launchpad.app.css'

const appParams = {
    id: 'launchpad',
    name: 'Launchpad',
}

export function LaunchpadApp() {
    const installedApps = useSelector(selectInstalledApps)

    return (
        <Window appId={appParams.id}>
            <WindowPane size='100%' color='rgb(238 233 226 / 50%)' opacity={0.5}>
                <WindowPaneHeader>
                    <WindowPaneHeaderTitle>Launchpad</WindowPaneHeaderTitle>
                </WindowPaneHeader>
                <div className='grid'>{
                    Object.values(installedApps).filter((app) => app.showInLaunchpad).map((app) => (
                        <div className='grid-item'>
                            <AppLauncherTooltip
                                appId={app.id}
                                appName={app.name}
                                iconUrl={app.icon}
                                showAppName
                                size='64px'
                            />
                        </div>
                    ))
                }
                </div>
            </WindowPane>
        </Window>
    )
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    ctor: LaunchpadApp,
    params: appParams
}
