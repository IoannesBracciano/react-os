import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Window } from './Window';
import { Desktop } from '../desktop/Desktop';
import { Provider } from 'react-redux';
import { store } from '../../store';
import '../../App.css'
import '../../index.css'

export default {
    title: 'Components/Window',
    component: Window,
    parameters: {
        layout: 'fullscreen',
    },
  } as ComponentMeta<typeof Window>

const Template: ComponentStory<typeof Window> = (args) => (
    <Provider store={store}>
        <Desktop>
        </Desktop>
    </Provider>
)

export const Test = Template.bind({})

Test.args = {}
