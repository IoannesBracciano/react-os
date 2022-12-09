import { WindowPaneHeader } from "../../components/window-pane-header/WindowPaneHeader";
import { WindowPane } from "../../components/window-pane/WindowPane";
import { Window } from "../../components/window/Window";
import { useSelector } from "react-redux";
import './Settings.app.css'
import { useCallback, useState } from "react";
import { faEarthEurope, faSwatchbook, faUsers, faVolumeHigh } from "@fortawesome/free-solid-svg-icons";
import { selectUser } from "../../system/state/desktopSlice";
import { HorizontalNavigation, NavigationTarget, NavigationTargetSelectedHandler } from "../../components/horizontal-navigation/HorizontalNavigation";
import { AppearancePane } from "./setting-panes/appearance-pane/AppearancePane";
import { UsersPane } from "./setting-panes/users-pane/UsersPane";
import { LanguageAndRegionPane } from "./setting-panes/language-and-region-pane/LanguageAndRegionPane";
import { FlexLayout } from "../../components/flex-layout/FlexLayout";

const appParams = {
    id: 'settings',
    name: 'Settings',
}

const SettingsNavigationTargets: NavigationTarget[] = [
    {
        icon: faSwatchbook,
        id: 'settings-nav-target-appearance',
        label: 'Appearance'
    },
    {
        icon: faEarthEurope,
        id: 'settings-nav-target-language-and-region',
        label: 'Language & Region'
    },
    {
        icon: faVolumeHigh,
        id: 'settings-nav-target-sound',
        label: 'Sound'
    },
    {
        icon: faUsers,
        id: 'settings-nav-target-users',
        label: 'Users'
    },
]

export function SettingsApp() {
    const [selectedTarget, setSelectedTarget] = useState<NavigationTarget>(SettingsNavigationTargets[0])

    const loggedUser = useSelector(selectUser)

    const onNavigationTargetSelected: NavigationTargetSelectedHandler = useCallback((target) => {
        setSelectedTarget(target)
    }, [])

    return (
        <Window appId={appParams.id}>
            <FlexLayout>
                <WindowPane size='220px' opacity={0.6}>
                    <WindowPaneHeader>
                        {/* <WindowPaneHeaderTitle>Settings</WindowPaneHeaderTitle> */}
                        {/* <div className='spacer'></div> */}
                        {/* <span><input name='search' placeholder='Search' /></span> */}
                        {/* <div className='spacer'></div> */}
                        <div className='user-badge'>
                            <div>
                                <img
                                    alt='User'
                                    className='user-image thumb-md round'
                                    src={loggedUser?.imageUrl}
                                />
                            </div>
                            <div>
                                <h4 className='user-name'>{loggedUser?.name}</h4>
                                <div className='system-notifications'>All clear :)</div>
                            </div>
                        </div>
                    </WindowPaneHeader>
                    <HorizontalNavigation onNavigationTargetSelected={onNavigationTargetSelected} targets={SettingsNavigationTargets} />
                </WindowPane>
                <WindowPane grow opacity={0.88} shrink>{selectedTarget && (
                    selectedTarget.id === 'settings-nav-target-appearance'
                        ? <AppearancePane />
                        : selectedTarget.id === 'settings-nav-target-language-and-region'
                        ? <LanguageAndRegionPane />
                        : selectedTarget.id === 'settings-nav-target-users'
                        ? <UsersPane />
                        : <div>Under construction...</div>
                )}
                </WindowPane>
            </FlexLayout>
            {/* <div className='window-blocking-pane authorization-pane'>
                <span>You are required to type in your password for this action.</span>
                <input autoFocus name='user-password' type='password' />
                <div className='pane-actions'>
                    <Button className='btn-secondary'>Cancel</Button>
                    <Button className='btn-primary'>Authorize</Button>
                </div>
            </div> */}
        </Window>
    )
}

// eslint-disable-next-line import/no-anonymous-default-export
// export default {
//     ctor: SettingsApp,
//     params: appParams
// }
export default SettingsApp
