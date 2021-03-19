// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { TabStopsActionCreator } from 'electron/flux/action/tab-stops-action-creator';
import {
    VirtualKeyboardButtons,
    VirtualKeyboardButtonsDeps,
    VirtualKeyboardButtonsProps,
} from 'electron/views/tab-stops/virtual-keyboard-buttons';
import { VirtualKeyboardViewProps } from 'electron/views/tab-stops/virtual-keyboard-view';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock } from 'typemoq';

describe('VirtualKeyboardButtons', () => {
    let props: VirtualKeyboardButtonsProps;
    let tabStopsActionCreatorMock: IMock<TabStopsActionCreator>;

    beforeEach(() => {
        tabStopsActionCreatorMock = Mock.ofType<TabStopsActionCreator>();

        props = {
            deps: {
                tabStopsActionCreator: tabStopsActionCreatorMock.object,
            } as VirtualKeyboardButtonsDeps,
            narrowModeStatus: {
                isVirtualKeyboardCollapsed: true,
            } as NarrowModeStatus,
        } as VirtualKeyboardViewProps;
    });

    test('renders with virtual keyboard collapsed', () => {
        const render = shallow(<VirtualKeyboardButtons {...props} />);

        expect(render.getElement()).toMatchSnapshot();
    });

    test('renders with virtual keyboard not collapsed', () => {
        props.narrowModeStatus = {
            isVirtualKeyboardCollapsed: false,
        } as NarrowModeStatus;
        const render = shallow(<VirtualKeyboardButtons {...props} />);

        expect(render.getElement()).toMatchSnapshot();
    });
});
