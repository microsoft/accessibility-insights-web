// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { WindowStateActions } from '../../../../../../electron/flux/action/window-state-actions';
import { ElectronWindowStateStore } from '../../../../../../electron/flux/store/electron-window-state-store';
import { ElectronWindowStateStoreData } from '../../../../../../electron/flux/types/electron-window-state-store-data';
import { createStoreWithNullParams, StoreTester } from '../../../../common/store-tester';

describe('ElectronWindowStateStore', () => {
    describe('constructor', () => {
        it('has no side effects', () => {
            const testSubject = createStoreWithNullParams(ElectronWindowStateStore);
            expect(testSubject).toBeDefined();
        });
    });

    it('returns device connect as the default state', () => {
        const testSubject = new ElectronWindowStateStore(new WindowStateActions());
        testSubject.initialize();

        expect(testSubject.getDefaultState()).toEqual(getDeviceConnectViewState());
        expect(testSubject.getState()).toEqual(getDeviceConnectViewState());
    });

    function getDeviceConnectViewState(): ElectronWindowStateStoreData {
        return { routeId: 'deviceConnectView' };
    }

    it('changes route id from default to resultsView', () => {
        const expectedState: ElectronWindowStateStoreData = {
            routeId: 'resultsView',
        };

        const initialState = createStoreWithNullParams(ElectronWindowStateStore).getDefaultState();

        createStoreTesterForWindowStateActions('setResultsViewRoute').testListenerToBeCalledOnce(initialState, expectedState);
    });

    function createStoreTesterForWindowStateActions(
        actionName: keyof WindowStateActions,
    ): StoreTester<ElectronWindowStateStoreData, WindowStateActions> {
        const factory = (actions: WindowStateActions) => new ElectronWindowStateStore(actions);

        return new StoreTester(WindowStateActions, actionName, factory);
    }
});
