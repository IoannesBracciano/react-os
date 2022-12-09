import { useMemo } from 'react'
import { Select } from '../../../../components/select/Select'
import { WindowPaneHeader } from '../../../../components/window-pane-header/WindowPaneHeader'
import './LanguageAndRegionPane.css'

export function LanguageAndRegionPane() {

    const locales = useMemo(() => [{
        key: 'en_US',
        label: 'English (United States)',
        value: 'en_US',
    }], [])

    return (
        <div id='language-and-region-pane'>
            <WindowPaneHeader>
                <h1>Language & Region</h1>
            </WindowPaneHeader>
            <div className='settings-pane-body'>
                <ul className='settings-list'>
                    <li className='item setting-select'>
                        <div className='setting-label'>
                            <h4>Display Language</h4>
                            <span>Set the system display language</span>
                        </div>
                        <div className='setting-control'>
                            <Select defaultOption={locales[0]} options={locales} />
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}