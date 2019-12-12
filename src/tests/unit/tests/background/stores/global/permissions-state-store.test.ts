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
        const initialState = expectedDefaultStoreData;
        const finalState = expectedDefaultStoreData;
        const storeTester = createStoreTesterForPermissionsStateActions('getCurrentState');

        storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    function createStoreTesterForPermissionsStateActions(
        actionName: keyof PermissionsStateActions,
    ): StoreTester<PermissionsStateStoreData, PermissionsStateActions> {
        const factory = (actions: PermissionsStateActions) => new PermissionsStateStore(actions);

        return new StoreTester(PermissionsStateActions, actionName, factory);
    }
});
