// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DeviceConnectionActions } from 'electron/flux/action/device-connection-actions';
import { DeviceConnectionStore } from 'electron/flux/store/device-connection-store';
import { DeviceConnectionStatus } from 'electron/flux/types/device-connection-status';
import { DeviceConnectionStoreData } from 'electron/flux/types/device-connection-store-data';
import { createStoreWithNullParams, StoreTester } from 'tests/unit/common/store-tester';

describe('DeviceConnectionStore', () => {
    let initialState: DeviceConnectionStoreData;

    beforeEach(() => {
        initialState = createStoreWithNullParams(DeviceConnectionStore).getDefaultState();
    });

    describe('constructor', () => {
        it('has no side effects', () => {
            const testObject = createStoreWithNullParams(DeviceConnectionStore);
            expect(testObject).toBeDefined();
        });
    });

    it('returns default state', () => {
        const testObject = createStoreWithNullParams(DeviceConnectionStore);

        expect(testObject.getState()).toMatchSnapshot();
    });

    const initialStatuses = [
        DeviceConnectionStatus[DeviceConnectionStatus.Unknown],
        DeviceConnectionStatus[DeviceConnectionStatus.Connected],
        DeviceConnectionStatus[DeviceConnectionStatus.Disconnected],
    ];

    it('ensure Status List is complete', () => {
        // Object.keys enumerates key and value for each entry, so it's twice as long
        expect(Object.keys(DeviceConnectionStatus).length).toBe(2 * initialStatuses.length);
    });

    describe('onStatusUnknown', () => {
        describe('updates only if status has changed', () => {
            const targetAction = 'statusUnknown';
            const expectedStatus = DeviceConnectionStatus.Unknown;

            it.each(initialStatuses)('with initial status <%s>', initialStatus => {
                initialState.status = DeviceConnectionStatus[initialStatus];

                const expectedState: DeviceConnectionStoreData = {
                    ...initialState,
                    status: expectedStatus,
                };

                if (initialState.status === expectedStatus) {
                    createStoreTesterForScanActions(targetAction).testListenerToNeverBeCalled(
                        initialState,
                        expectedState,
                    );
                } else {
                    createStoreTesterForScanActions(targetAction).testListenerToBeCalledOnce(
                        initialState,
                        expectedState,
                    );
                }
            });
        });
    });

    describe('onStatusConnected', () => {
        describe('updates only if status has changed', () => {
            const targetAction = 'statusConnected';
            const expectedStatus = DeviceConnectionStatus.Connected;

            it.each(initialStatuses)('with initial status <%s>', initialStatus => {
                initialState.status = DeviceConnectionStatus[initialStatus];

                const expectedState: DeviceConnectionStoreData = {
                    ...initialState,
                    status: expectedStatus,
                };

                if (initialState.status === expectedStatus) {
                    createStoreTesterForScanActions(targetAction).testListenerToNeverBeCalled(
                        initialState,
                        expectedState,
                    );
                } else {
                    createStoreTesterForScanActions(targetAction).testListenerToBeCalledOnce(
                        initialState,
                        expectedState,
                    );
                }
            });
        });
    });

    describe('onStatusDisonnected', () => {
        describe('updates only if status has changed', () => {
            const targetAction = 'statusDisconnected';
            const expectedStatus = DeviceConnectionStatus.Disconnected;

            it.each(initialStatuses)('with initial status <%s>', initialStatus => {
                initialState.status = DeviceConnectionStatus[initialStatus];

                const expectedState: DeviceConnectionStoreData = {
                    ...initialState,
                    status: expectedStatus,
                };

                if (initialState.status === expectedStatus) {
                    createStoreTesterForScanActions(targetAction).testListenerToNeverBeCalled(
                        initialState,
                        expectedState,
                    );
                } else {
                    createStoreTesterForScanActions(targetAction).testListenerToBeCalledOnce(
                        initialState,
                        expectedState,
                    );
                }
            });
        });
    });

    function createStoreTesterForScanActions(
        actionName: keyof DeviceConnectionActions,
    ): StoreTester<DeviceConnectionStoreData, DeviceConnectionActions> {
        const factory = (actions: DeviceConnectionActions) => new DeviceConnectionStore(actions);

        return new StoreTester(DeviceConnectionActions, actionName, factory);
    }
});
