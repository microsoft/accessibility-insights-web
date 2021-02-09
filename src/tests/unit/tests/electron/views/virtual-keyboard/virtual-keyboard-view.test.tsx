// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    VirtualKeyboardView,
    VirtualKeyboardViewProps,
} from 'electron/views/virtual-keyboard/virtual-keyboard-view';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('VirtualKeyboardView', () => {
    let props: VirtualKeyboardViewProps;

    beforeEach(() => {
        props = {} as VirtualKeyboardViewProps;
    });

    test('renders', () => {
        const render = shallow(<VirtualKeyboardView {...props} />);

        expect(render.getElement()).toMatchSnapshot();
    });
});
