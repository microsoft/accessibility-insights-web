// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    VirtualKeyboardButtons,
    VirtualKeyboardButtonsProps,
} from 'electron/views/virtual-keyboard/virtual-keyboard-buttons';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('VirtualKeyboardButtons', () => {
    let props: VirtualKeyboardButtonsProps;

    beforeEach(() => {
        props = {} as VirtualKeyboardButtonsProps;
    });

    test('renders with virtual keyboard collapsed', () => {
        props = {
            narrowModeStatus: {
                isVirtualKeyboardCollapsed: true,
            },
        } as VirtualKeyboardButtonsProps;
        const render = shallow(<VirtualKeyboardButtons {...props} />);

        expect(render.getElement()).toMatchSnapshot();
    });

    test('renders with virtual keyboard not collapsed', () => {
        props = {
            narrowModeStatus: {
                isVirtualKeyboardCollapsed: false,
            },
        } as VirtualKeyboardButtonsProps;
        const render = shallow(<VirtualKeyboardButtons {...props} />);

        expect(render.getElement()).toMatchSnapshot();
    });
});
