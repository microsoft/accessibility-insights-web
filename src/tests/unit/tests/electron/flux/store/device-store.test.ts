// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DeviceActions } from 'electron/flux/action/device-actions';
import { DeviceStore } from 'electron/flux/store/device-store';
import { DeviceStoreData } from 'electron/flux/types/device-store-data';

import { DeviceConnectState } from '../../../../../../electron/device-connect-view/components/device-connect-body';
import { UpdateDevicePayload } from '../../../../../../electron/flux/action/update-device-payload';
import { createStoreWithNullParams, StoreTester } from '../../../../common/store-tester';

describe('DeviceStore', () => {
    describe('constructor', () => {
        it('has no side effects', () => {
            const testObject = createStoreWithNullParams(DeviceStore);
            expect(testObject).toBeDefined();
        });
    });

    describe('onUpdateDevice', () => {
        let initialState: DeviceStoreData;

        beforeEach(() => {
            initialState = createStoreWithNullParams(DeviceStore).getDefaultState();
        });

        it('updates when connect state is different', () => {
            const payload: UpdateDevicePayload = {
                deviceConnectState: DeviceConnectState.Connected,
            };

            const expectedState: DeviceStoreData = {
                ...initialState,
                ...payload,
            };

            creatorStoreTesterForDeviceActions('updateDevice')
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

            creatorStoreTesterForDeviceActions('updateDevice')
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

            creatorStoreTesterForDeviceActions('updateDevice')
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

            creatorStoreTesterForDeviceActions('updateDevice')
                .withActionParam(payload)
                .testListenerToNeverBeCalled(initialState, expectedState);
        });
    });

    function creatorStoreTesterForDeviceActions(actionName: keyof DeviceActions): StoreTester<DeviceStoreData, DeviceActions> {
        const factory = (actions: DeviceActions) => new DeviceStore(actions);

        return new StoreTester(DeviceActions, actionName, factory);
    }
});
