// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DeviceConnectState } from 'electron/device-connect-view/components/device-connect-state';
import { ConnectingPayload, ConnectionSucceedPayload } from 'electron/flux/action/device-action-payloads';
import { DeviceActions } from 'electron/flux/action/device-actions';
import { DeviceStore } from 'electron/flux/store/device-store';
import { DeviceStoreData } from 'electron/flux/types/device-store-data';

import { createStoreWithNullParams, StoreTester } from '../../../../common/store-tester';

describe('DeviceStore', () => {
    let initialState: DeviceStoreData;

    beforeEach(() => {
        initialState = createStoreWithNullParams(DeviceStore).getDefaultState();
    });

    describe('constructor', () => {
        it('has no side effects', () => {
            const testObject = createStoreWithNullParams(DeviceStore);
            expect(testObject).toBeDefined();
        });
    });

    describe('on connecting', () => {
        const testPort = 10101;
        it('updates the port and status to CONNECTING ', () => {
            const payload: ConnectingPayload = {
                port: testPort,
            };

            const expectedState: DeviceStoreData = {
                ...initialState,
                port: payload.port,
                deviceConnectState: DeviceConnectState.Connecting,
            };

            createStoreTesterForDeviceActions('connecting')
                .withActionParam(payload)
                .testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('updates the port and status to CONNECTING when port is different', () => {
            initialState.port = testPort;
            initialState.deviceConnectState = DeviceConnectState.Connecting;

            const payload: ConnectingPayload = {
                port: testPort + 1,
            };

            const expectedState: DeviceStoreData = {
                ...initialState,
                port: payload.port,
            };

            createStoreTesterForDeviceActions('connecting')
                .withActionParam(payload)
                .testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('does not update if already CONNECTING to the same port', () => {
            initialState.port = testPort;
            initialState.deviceConnectState = DeviceConnectState.Connecting;

            const payload: ConnectingPayload = {
                port: testPort,
            };

            const expectedState: DeviceStoreData = {
                ...initialState,
                port: payload.port,
            };

            createStoreTesterForDeviceActions('connecting')
                .withActionParam(payload)
                .testListenerToNeverBeCalled(initialState, expectedState);
        });
    });

    describe('on connection succeed', () => {
        it('updates connection status and device name', () => {
            const payload: ConnectionSucceedPayload = {
                connectedDevice: 'test connected device',
            };
            const expectedState: DeviceStoreData = {
                ...initialState,
                connectedDevice: payload.connectedDevice,
                deviceConnectState: DeviceConnectState.Connected,
            };

            createStoreTesterForDeviceActions('connectionSucceed')
                .withActionParam(payload)
                .testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('does not updates if status is already CONNECTED', () => {
            initialState.deviceConnectState = DeviceConnectState.Connected;

            const payload: ConnectionSucceedPayload = {
                connectedDevice: 'test connected device',
            };

            const expectedState: DeviceStoreData = {
                ...initialState,
            };

            createStoreTesterForDeviceActions('connectionSucceed')
                .withActionParam(payload)
                .testListenerToNeverBeCalled(initialState, expectedState);
        });
    });

    describe('on connection failed', () => {
        it('updates connection status to Error', () => {
            const expectedState: DeviceStoreData = {
                ...initialState,
                deviceConnectState: DeviceConnectState.Error,
            };

            createStoreTesterForDeviceActions('connectionFailed').testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('does not updates if state is already Error', () => {
            initialState.deviceConnectState = DeviceConnectState.Error;

            const expectedState: DeviceStoreData = {
                ...initialState,
            };

            createStoreTesterForDeviceActions('connectionFailed').testListenerToNeverBeCalled(initialState, expectedState);
        });
    });

    function createStoreTesterForDeviceActions(actionName: keyof DeviceActions): StoreTester<DeviceStoreData, DeviceActions> {
        const factory = (actions: DeviceActions) => new DeviceStore(actions);

        return new StoreTester(DeviceActions, actionName, factory);
    }
});
