// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SetAllUrlsPermissionStatePayload } from 'background/actions/action-payloads';
import { PermissionsStateActions } from 'background/actions/permissions-state-actions';
import { PermissionsStateStore } from 'background/stores/global/permissions-state-store';
import { StoreNames } from 'common/stores/store-names';
import { PermissionsStateStoreData } from 'common/types/store-data/permissions-state-store-data';
import { createStoreWithNullParams, StoreTester } from 'tests/unit/common/store-tester';

describe('PermissionsStateStoreTest', () => {
    test('constructor, no side effects', () => {
        const testSubject = createStoreWithNullParams(PermissionsStateStore);

        expect(testSubject).toBeDefined();
    });

    test('getId', () => {
        const testSubject = createStoreWithNullParams(PermissionsStateStore);

        expect(testSubject.getId()).toEqual(StoreNames[StoreNames.PermissionsStateStore]);
    });

    test('getDefaultState returns expected default store state', () => {
        const testSubject = new PermissionsStateStore(
            new PermissionsStateActions(),
            null,
            null,
            null,
            true,
        );
        testSubject.initialize();

        expect(testSubject.getDefaultState()).toMatchSnapshot();
    });

    test('on getCurrentState', async () => {
        const initialState = createPermissionsState();
        const finalState = createPermissionsState();

        const storeTester = createStoreTesterForPermissionsStateActions('getCurrentState');
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    describe('on setPermissionsState', () => {
        test('updates state when it has changed', async () => {
            const initialPermissionsValue = false;
            const finalPermissionsValue = true;
            const initialState = { hasAllUrlAndFilePermissions: initialPermissionsValue };
            const finalState = { hasAllUrlAndFilePermissions: finalPermissionsValue };
            const payload: SetAllUrlsPermissionStatePayload = {
                hasAllUrlAndFilePermissions: finalPermissionsValue,
            };

            const storeTester =
                createStoreTesterForPermissionsStateActions('setPermissionsState').withActionParam(
                    payload,
                );
            await storeTester.testListenerToBeCalledOnce(initialState, finalState);
        });

        test.each([true, false])(
            'does not update state when there is no change',
            async hasPermissionsValue => {
                const initialState = { hasAllUrlAndFilePermissions: hasPermissionsValue };
                const finalState = { hasAllUrlAndFilePermissions: hasPermissionsValue };
                const payload: SetAllUrlsPermissionStatePayload = {
                    hasAllUrlAndFilePermissions: hasPermissionsValue,
                };

                const storeTester =
                    createStoreTesterForPermissionsStateActions(
                        'setPermissionsState',
                    ).withActionParam(payload);
                await storeTester.testListenerToNeverBeCalled(initialState, finalState);
            },
        );
    });

    function createStoreTesterForPermissionsStateActions(
        actionName: keyof PermissionsStateActions,
    ): StoreTester<PermissionsStateStoreData, PermissionsStateActions> {
        const factory = (actions: PermissionsStateActions) =>
            new PermissionsStateStore(actions, null, null, null, true);

        return new StoreTester(PermissionsStateActions, actionName, factory);
    }

    function createPermissionsState(): PermissionsStateStoreData {
        return new PermissionsStateStore(null, null, null, null, null).getDefaultState();
    }
});
