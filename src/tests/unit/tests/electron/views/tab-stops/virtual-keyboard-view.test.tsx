// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { VirtualKeyboardButtonsDeps } from 'electron/views/tab-stops/virtual-keyboard-buttons';
import {
    VirtualKeyboardView,
    VirtualKeyboardViewDeps,
    VirtualKeyboardViewProps,
} from 'electron/views/tab-stops/virtual-keyboard-view';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('VirtualKeyboardView', () => {
    let props: VirtualKeyboardViewProps;
    let deps: VirtualKeyboardButtonsDeps;

    beforeEach(() => {
        deps = {
            tabStopsActionCreator: {},
        } as VirtualKeyboardViewDeps;
        props = {
            deps,
            narrowModeStatus: {
                isVirtualKeyboardCollapsed: true,
            } as NarrowModeStatus,
        } as VirtualKeyboardViewProps;
    });

    test('renders', () => {
        const render = shallow(<VirtualKeyboardView {...props} />);

        expect(render.getElement()).toMatchSnapshot();
    });
});
