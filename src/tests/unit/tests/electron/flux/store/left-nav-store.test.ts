// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { LeftNavActions } from 'electron/flux/action/left-nav-actions';
import { LeftNavStore } from 'electron/flux/store/left-nav-store';
import { LeftNavStoreData } from 'electron/flux/types/left-nav-store-data';
import { createStoreWithNullParams, StoreTester } from 'tests/unit/common/store-tester';

describe('LeftNavStore', () => {
    describe('constructor', () => {
        it('has no side effects', () => {
            const store = createStoreWithNullParams(LeftNavStore);
            expect(store).toBeDefined();
        });
    });

    it('returns default state', () => {
        const actions = new LeftNavActions();
        const store = new LeftNavStore(actions);
        store.initialize();

        expect(store.getState()).toMatchSnapshot();
    });

    it('item selection causes state change', () => {
        const initialState: LeftNavStoreData = {
            selectedKey: 'needs-review',
            leftNavVisible: true,
        };
        const expectedState: LeftNavStoreData = {
            selectedKey: 'automated-checks',
            leftNavVisible: false,
        };

        CreateStoreTesterForLeftNavActions('itemSelected')
            .withActionParam(expectedState.selectedKey)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    it.each([
        [true, false],
        [false, true],
        [false, false],
        [true, true],
    ])('setLeftNavVisible causes state change', (initialValue, expectedValue) => {
        const initialState: LeftNavStoreData = {
            selectedKey: 'needs-review',
            leftNavVisible: initialValue,
        };
        const expectedState: LeftNavStoreData = {
            selectedKey: 'needs-review',
            leftNavVisible: expectedValue,
        };

        CreateStoreTesterForLeftNavActions('setLeftNavVisible')
            .withActionParam(expectedValue)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    function CreateStoreTesterForLeftNavActions(
        actionName: keyof LeftNavActions,
    ): StoreTester<LeftNavStoreData, LeftNavActions> {
        const factory = (actions: LeftNavActions) => new LeftNavStore(actions);

        return new StoreTester(LeftNavActions, actionName, factory);
    }
});
