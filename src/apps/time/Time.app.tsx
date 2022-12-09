import './Time.app.css'
import { ChangeEventHandler, useCallback, useMemo, useState } from 'react'
import { WindowPane } from '../../components/window-pane/WindowPane'
import { Window } from '../../components/window/Window'
import { Clock } from './components/clock/Clock'
import { Button } from '../../components/button/Button'
import { useStorage } from '../../sdk/storage'
import { WindowPaneHeader } from '../../components/window-pane-header/WindowPaneHeader'
import { WindowPaneHeaderTitle } from '../../components/window-pane-header-title/WindowPaneHeaderTitle'
import { Select, SelectOption } from '../../components/select/Select'
import { Switch } from '../../components/switch/Switch'

const appParams = {
    id: 'time',
    name: 'Time',
    showInLaunchpad: true
}

export interface ClockCustomizationOptions {
    background?: string
    showMarks: boolean
    showMinutes: boolean
    showSeconds: boolean
}

export function TimeApp() {
    const [customizing, setCustomizing] = useState(false)

    const [customization, setCustomization] = useStorage<ClockCustomizationOptions>(
        '/system/apps/time.app/customization', {
            showMarks: true,
            showMinutes: true,
            showSeconds: true,
        }
    )

    const bgOptions = useMemo(() => ([{
        key: 'none',
        label: 'None',
        value: undefined,
    }, {
        key: 'white',
        label: 'White',
        value: '#white',
    }, {
        key: 'cat',
        label: 'Cat',
        value: '#cat',
    }, {
        key: 'fruits',
        label: 'Fruits',
        value: '#fruits',
    }, {
        key: 'coffee',
        label: 'Coffee',
        value: '#coffee',
    }]), [])

    const defaultBgOption = useMemo(() => (
        bgOptions.find((option) => option.value === customization.background)
    ), [])

    const onCustomizationOptionChange: ChangeEventHandler<HTMLInputElement> = useCallback((ev) => {
        const optionName = ev.target.name
        setCustomization((customization) => ({
            ...customization,
            [optionName]: ev.target.checked,
        }))
    }, [])

    const onBackgroundChange = useCallback((selectedOption: SelectOption<string | undefined> | undefined) => {
        setCustomization((customization) => ({
            ...customization,
            background: selectedOption?.value,
        }))
    }, [])

    return (
        <Window
            appId={appParams.id}
            defaultRect={{ height: 260, width: 280, x: 100, y: 100 }}
            rect={customizing ? { width: 280, height: 340 } : undefined}
            resize='none'
        >
            <WindowPane opacity={0.1} size='100%'>
                <WindowPaneHeader>
                    <WindowPaneHeader.Spring />
                    <Button
                        className={customizing ? 'btn-primary' : ''}
                        onClick={() => setCustomizing((customizing) => !customizing)}
                    >
                        {customizing ? 'Done' : 'Customize'}
                    </Button>
                </WindowPaneHeader>
                {/* <div className='flex-container vertical'> */}
                    <Clock
                        background={customization.background}
                        showMarks={customization.showMarks}
                        showMinutes={customization.showMinutes}
                        showSeconds={customization.showSeconds}
                        showText={!customizing}
                        size={customizing ? '100px' : undefined}
                    />{customizing &&
                    <div className='scroll-view'>
                        <ul id='customization-options'>
                            <li>
                                <span>Background</span>
                                <Select
                                    defaultOption={defaultBgOption}
                                    onChange={onBackgroundChange}
                                    options={bgOptions}
                                />
                            </li>
                            <li>    
                                <label>
                                    <span>Show minutes</span>
                                    <Switch
                                        name='showMinutes'
                                        onStateChange={(_, event) => onCustomizationOptionChange(event)}
                                        state={customization.showMinutes}
                                    />
                                </label>
                            </li>
                            <li>
                                <label>
                                    <span>Show seconds</span>
                                    <Switch
                                        name='showSeconds'
                                        onStateChange={(_, event) => onCustomizationOptionChange(event)}
                                        state={customization.showSeconds}
                                    />
                                </label>
                            </li>
                            <li>    
                                <label>
                                    <span>Show marks</span>
                                    {/* <input
                                        checked={customization.showMarks}
                                        name='showMarks'
                                        onChange={onCustomizationOptionChange}
                                        type='checkbox'
                                    /> */}
                                    <Switch
                                        name='showMarks'
                                        onStateChange={(_, event) => onCustomizationOptionChange(event)}
                                        state={customization.showMarks}
                                    />
                                </label>
                            </li>
                        </ul>
                    </div>
                }
                {/* </div> */}
            </WindowPane>
        </Window>
    )
}

export default TimeApp
