// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PermissionsStateActions } from 'background/actions/permissions-state-actions';
import { PermissionsStateStore } from 'background/stores/global/permissions-state-store';
import { StoreNames } from 'common/stores/store-names';
import { PermissionsStateStoreData } from 'common/types/store-data/permissions-state-store-data';
import { StoreTester } from 'tests/unit/common/store-tester';

describe('PermissionsStateStoreTest', () => {
    const expectedDefaultStoreData: PermissionsStateStoreData = {
        hasAllPermissions: false,
    };

    test('constructor', () => {
        const testSubject = new PermissionsStateStore(new PermissionsStateActions());

        expect(testSubject).toBeDefined();
    });

    test('getId', () => {
        const testSubject = new PermissionsStateStore(new PermissionsStateActions());

        expect(testSubject.getId()).toEqual(StoreNames[StoreNames.PermissionsStateStore]);
    });

    test('initialize sets store state to default state', () => {
        const testSubject = new PermissionsStateStore(new PermissionsStateActions());
        testSubject.initialize();

        expect(testSubject.getState()).toEqual(expectedDefaultStoreData);
    });

    test('getDefaultState returns expected default store state', () => {
        const testSubject = new PermissionsStateStore(new PermissionsStateActions());
        testSubject.initialize();

        expect(testSubject.getDefaultState()).toEqual(expectedDefaultStoreData);
    });

    test('on getCurrentState', () => {
        const initialState = createPermissionsState();
        const finalState = createPermissionsState();

        createStoreTesterForPermissionsStateActions('getCurrentState').testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on setPermissionsState updates state when it has changed', () => {
        const initialState = expectedDefaultStoreData;
        const finalState = { hasAllPermissions: true };

        createStoreTesterForPermissionsStateActions('setPermissionsState')
            .withActionParam(true)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on setPermissionsState does not update state when there is no change', () => {
        const initialState = { hasAllPermissions: true };
        const finalState = { hasAllPermissions: true };

        createStoreTesterForPermissionsStateActions('setPermissionsState')
            .withActionParam(true)
            .testListenerToNeverBeCalled(initialState, finalState);
    });

    function createStoreTesterForPermissionsStateActions(
        actionName: keyof PermissionsStateActions,
    ): StoreTester<PermissionsStateStoreData, PermissionsStateActions> {
        const factory = (actions: PermissionsStateActions) => new PermissionsStateStore(actions);

        return new StoreTester(PermissionsStateActions, actionName, factory);
    }

    function createPermissionsState(): PermissionsStateStoreData {
        return new PermissionsStateStore(null).getDefaultState();
    }
});
