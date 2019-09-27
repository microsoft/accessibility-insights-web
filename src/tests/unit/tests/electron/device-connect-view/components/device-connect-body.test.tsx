// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import {
    DeviceConnectBody,
    DeviceConnectBodyDeps,
    DeviceConnectBodyProps,
    DeviceConnectBodyState,
} from 'electron/device-connect-view/components/device-connect-body';
import { DeviceConnectPortEntryProps } from 'electron/device-connect-view/components/device-connect-port-entry';
import { DeviceConnectState } from 'electron/device-connect-view/components/device-connect-state';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('DeviceConnectBodyTest', () => {
    const props: DeviceConnectBodyProps = {
        deps: {
            currentWindow: {
                close: () => {
                    return;
                },
            } as BrowserWindow,
        } as DeviceConnectBodyDeps,
    };

    const expectedBeforeState: DeviceConnectBodyState = {
        deviceConnectState: DeviceConnectState.Default,
    };

    const expectedStateWhileConnecting: DeviceConnectBodyState = {
        deviceConnectState: DeviceConnectState.Connecting,
        connectedDevice: undefined,
    };

    const expectedStateConnectedSuccess: DeviceConnectBodyState = {
        deviceConnectState: DeviceConnectState.Connected,
        connectedDevice: 'Test Device Name!',
    };

    const expectedStateConnectedFail: DeviceConnectBodyState = {
        deviceConnectState: DeviceConnectState.Error,
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
        propsWithCallback.updateStateCallback(DeviceConnectState.Connecting);
        expect(rendered.state()).toEqual(expectedStateWhileConnecting);
    });

    test('OnConnectedCallback success updates state', () => {
        const rendered = shallow(<DeviceConnectBody {...props} />);
        const propsWithCallback = rendered.find('DeviceConnectPortEntry').props() as DeviceConnectPortEntryProps;

        expect(rendered.state()).toEqual(expectedBeforeState);
        propsWithCallback.updateStateCallback(DeviceConnectState.Connected, expectedStateConnectedSuccess.connectedDevice);
        expect(rendered.state()).toEqual(expectedStateConnectedSuccess);
    });

    test('OnConnectedCallback fail updates state', () => {
        const rendered = shallow(<DeviceConnectBody {...props} />);
        const propsWithCallback = rendered.find('DeviceConnectPortEntry').props() as DeviceConnectPortEntryProps;

        expect(rendered.state()).toEqual(expectedBeforeState);
        propsWithCallback.updateStateCallback(DeviceConnectState.Error, expectedStateConnectedFail.connectedDevice);
        expect(rendered.state()).toEqual(expectedStateConnectedFail);
    });
});
