// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

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
        const testSubject = createStoreWithNullParams(ElectronWindowStateStore);
        testSubject.initialize();

        expect(testSubject.getState()).toEqual(testSubject.getDefaultState());
        expect(testSubject.getState()).toEqual(getDeviceConnectViewState());
    });

    function getDeviceConnectViewState(): ElectronWindowStateStoreData {
        return { routeId: 'deviceConnectView', windowHeight: 391, windowWidth: 600 };
    }
});
