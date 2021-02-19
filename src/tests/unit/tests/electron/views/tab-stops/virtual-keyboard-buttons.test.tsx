// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { AdbWrapper } from 'electron/platform/android/adb-wrapper';
import { DeviceFocusController } from 'electron/platform/android/device-focus-controller';
import { DeviceFocusControllerFactory } from 'electron/platform/android/device-focus-controller-factory';
import { AdbWrapperHolder } from 'electron/platform/android/setup/adb-wrapper-holder';
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
    let deviceFocusControllerFactoryMock: IMock<DeviceFocusControllerFactory>;
    let adbWrapperHolderMock: IMock<AdbWrapperHolder>;
    let props: VirtualKeyboardButtonsProps;
    let deviceIdStub: string;
    let adbWrapperStub: AdbWrapper;
    let deviceFocusControllerMock: IMock<DeviceFocusController>;

    beforeEach(() => {
        deviceFocusControllerFactoryMock = Mock.ofType<DeviceFocusControllerFactory>();
        adbWrapperHolderMock = Mock.ofType<AdbWrapperHolder>();
        deviceIdStub = 'some-device-id';
        adbWrapperStub = {} as AdbWrapper;
        deviceFocusControllerMock = Mock.ofType<DeviceFocusController>();

        adbWrapperHolderMock.setup(m => m.getAdb()).returns(() => adbWrapperStub);

        deviceFocusControllerFactoryMock
            .setup(m => m.getDeviceFocusController(adbWrapperStub))
            .returns(() => deviceFocusControllerMock.object);

        deviceFocusControllerMock.setup(m => m.setDeviceId(deviceIdStub)).verifiable();

        props = {
            deps: {
                deviceFocusControllerFactory: deviceFocusControllerFactoryMock.object,
                adbWrapperHolder: adbWrapperHolderMock.object,
            } as VirtualKeyboardButtonsDeps,
            narrowModeStatus: {
                isVirtualKeyboardCollapsed: true,
            } as NarrowModeStatus,
            deviceId: deviceIdStub,
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
