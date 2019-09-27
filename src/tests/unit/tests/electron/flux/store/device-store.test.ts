// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DeviceActions } from 'electron/flux/action/device-actions';
import { DeviceStore } from 'electron/flux/store/device-store';
import { DeviceStoreData } from 'electron/flux/types/device-store-data';

import { Times } from 'typemoq';
import { DeviceConnectState } from '../../../../../../electron/device-connect-view/components/device-connect-body';
import { ConnectionSucceedPayload, UpdateDevicePayload } from '../../../../../../electron/flux/action/device-action-payloads';
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

    describe('onUpdateDevice', () => {
        it('updates when connect state is different', () => {
            const payload: UpdateDevicePayload = {
                deviceConnectState: DeviceConnectState.Connected,
            };

            const expectedState: DeviceStoreData = {
                ...initialState,
                ...payload,
            };

            createStoreTesterForDeviceActions('updateDevice')
                .withActionParam(payload)
                .testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('updates when device name is different', () => {
            const payload: UpdateDevicePayload = {
                ...initialState,
                connectedDevice: 'test device',
            };

            const expectedState: DeviceStoreData = {
                ...initialState,
                ...payload,
            };

            createStoreTesterForDeviceActions('updateDevice')
                .withActionParam(payload)
                .testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('updates when connect state and device name are different', () => {
            const payload: UpdateDevicePayload = {
                connectedDevice: 'test device',
                deviceConnectState: DeviceConnectState.Error,
            };

            const expectedState: DeviceStoreData = {
                ...initialState,
                ...payload,
            };

            createStoreTesterForDeviceActions('updateDevice')
                .withActionParam(payload)
                .testListenerToBeCalledOnce(initialState, expectedState);
        });

        it('does not update if there are no changes', () => {
            const payload: UpdateDevicePayload = {
                ...initialState,
            };

            const expectedState: DeviceStoreData = {
                ...initialState,
                ...payload,
            };

            createStoreTesterForDeviceActions('updateDevice')
                .withActionParam(payload)
                .testListenerToNeverBeCalled(initialState, expectedState);
        });
    });

    function createStoreTesterForDeviceActions(actionName: keyof DeviceActions): StoreTester<DeviceStoreData, DeviceActions> {
        const factory = (actions: DeviceActions) => new DeviceStore(actions);

        return new StoreTester(DeviceActions, actionName, factory);
    }
});
