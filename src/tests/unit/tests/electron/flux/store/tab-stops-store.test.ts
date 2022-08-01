// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabStopsActions } from 'electron/flux/action/tab-stops-actions';
import { TabStopsStore } from 'electron/flux/store/tab-stops-store';
import { TabStopsStoreData } from 'electron/flux/types/tab-stops-store-data';
import { createStoreWithNullParams, StoreTester } from 'tests/unit/common/store-tester';

describe('TabStopsStore', () => {
    describe('constructor', () => {
        it('has no side effects', () => {
            const store = createStoreWithNullParams(TabStopsStore);
            expect(store).toBeDefined();
        });
    });

    it('returns default state', () => {
        const actions = new TabStopsActions();
        const store = new TabStopsStore(actions);
        store.initialize();

        expect(store.getState()).toMatchSnapshot();
    });

    it('onEnableFocusTracking', async () => {
        const initialState: TabStopsStoreData = {
            focusTracking: false,
        };
        const expectedState: TabStopsStoreData = {
            focusTracking: true,
        };

        const storeTester = createStoreTesterForTabStopsActions('enableFocusTracking');
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    it('onDisableFocusTracking', async () => {
        const initialState: TabStopsStoreData = {
            focusTracking: true,
        };
        const expectedState: TabStopsStoreData = {
            focusTracking: false,
        };

        const storeTester = createStoreTesterForTabStopsActions('disableFocusTracking');
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    it('onStartOver', async () => {
        const initialState: TabStopsStoreData = {
            focusTracking: true,
        };
        const expectedState: TabStopsStoreData = {
            focusTracking: false,
        };

        const storeTester = createStoreTesterForTabStopsActions('startOver');
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    function createStoreTesterForTabStopsActions(
        actionName: keyof TabStopsActions,
    ): StoreTester<TabStopsStoreData, TabStopsActions> {
        const factory = (actions: TabStopsActions) => new TabStopsStore(actions);

        return new StoreTester(TabStopsActions, actionName, factory);
    }
});
