// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    DeviceConnectBody,
    DeviceConnectBodyProps,
    DeviceConnectBodyState,
} from '../../../../../electron/device-connect-view/components/device-connect-body';
import { DeviceConnectPortEntryProps } from '../../../../../electron/device-connect-view/components/device-connect-port-entry';

describe('DeviceConnectBodyTest', () => {
    const props: DeviceConnectBodyProps = {
        currentWindow: {
            close: () => {
                return;
            },
        } as BrowserWindow,
    };

    const expectedBeforeState: DeviceConnectBodyState = {
        canStartTesting: false,
        needsValidation: true,
        isConnecting: false,
    };

    const expectedStateWhileConnecting: DeviceConnectBodyState = {
        isConnecting: true,
        canStartTesting: false,
        needsValidation: true,
        connectedDevice: '',
    };

    const expectedStateConnectedSuccess: DeviceConnectBodyState = {
        isConnecting: false,
        canStartTesting: true,
        needsValidation: false,
        connectedDevice: 'Test Device Name!',
    };

    const expectedStateConnectedFail: DeviceConnectBodyState = {
        isConnecting: false,
        canStartTesting: false,
        needsValidation: true,
        connectedDevice: '',
    };

    test('render', () => {
        const rendered = shallow(<DeviceConnectBody {...props} />);
        rendered.childAt(1).props();
        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('OnConnectingCallback updates state', () => {
        const rendered = shallow(<DeviceConnectBody {...props} />);
        const propsWithCallback = rendered.find('DeviceConnectPortEntry').props() as DeviceConnectPortEntryProps;

        expect(rendered.state()).toEqual(expectedBeforeState);
        propsWithCallback.onConnectingCallback();
        expect(rendered.state()).toEqual(expectedStateWhileConnecting);
    });

    test('OnConnectedCallback success updates state', () => {
        const rendered = shallow(<DeviceConnectBody {...props} />);
        const propsWithCallback = rendered.find('DeviceConnectPortEntry').props() as DeviceConnectPortEntryProps;

        expect(rendered.state()).toEqual(expectedBeforeState);
        propsWithCallback.onConnectedCallback(true, expectedStateConnectedSuccess.connectedDevice);
        expect(rendered.state()).toEqual(expectedStateConnectedSuccess);
    });

    test('OnConnectedCallback fail updates state', () => {
        const rendered = shallow(<DeviceConnectBody {...props} />);
        const propsWithCallback = rendered.find('DeviceConnectPortEntry').props() as DeviceConnectPortEntryProps;

        expect(rendered.state()).toEqual(expectedBeforeState);
        propsWithCallback.onConnectedCallback(false, expectedStateConnectedFail.connectedDevice);
        expect(rendered.state()).toEqual(expectedStateConnectedFail);
    });
});
