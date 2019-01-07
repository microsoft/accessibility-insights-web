// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';

import { LaunchPanelStateActions } from '../../../../../../background/actions/launch-panel-state-action';
import { ChromeAdapter } from '../../../../../../background/browser-adapter';
import { LocalStorageDataKeys } from '../../../../../../background/local-storage-data-keys';
import { ILocalStorageData } from '../../../../../../background/storage-data';
import { LaunchPanelStore } from '../../../../../../background/stores/global/launch-panel-store';
import { StoreNames } from '../../../../../../common/stores/store-names';
import { LaunchPanelType } from '../../../../../../popup/scripts/components/popup-view';
import { createStoreWithNullParams, StoreTester } from '../../../../common/store-tester';

describe('LaunchPanelStateStoreTest', () => {
    let userDataStub: ILocalStorageData;
    let browserAdapterMock: IMock<ChromeAdapter>;

    beforeAll(() => {
        userDataStub = { launchPanelSetting: LaunchPanelType.AdhocToolsPanel };
        browserAdapterMock = Mock.ofType(ChromeAdapter);
    });

    test('constructor, no side effects', () => {
        const testObject = createStoreWithNullParams(LaunchPanelStore);
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(LaunchPanelStore);
        expect(testObject.getId()).toEqual(StoreNames[StoreNames.LaunchPanelStateStore]);
    });

    test('on getCurrentState', () => {
        const initialState = getDefaultState();

        const expectedState = getDefaultState();

        createStoreForLaunchPanelStateActions('getCurrentState')
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('initialize, user data is not null', () => {
        const expectedState = {
            launchPanelType: userDataStub.launchPanelSetting,
        };

        const testObject = new LaunchPanelStore(new LaunchPanelStateActions(), null, userDataStub);
        testObject.initialize();
        expect(testObject.getState()).toEqual(expectedState);
    });

    test('onSetLaunchPanelState: preserving state', () => {
        const initialState = getDefaultState();

        const payload = LaunchPanelType.AdhocToolsPanel;

        const expectedState = getDefaultState();
        expectedState.launchPanelType = payload;

        const expecetedSetUserData = {
            [LocalStorageDataKeys.launchPanelSetting]: payload,
        };

        browserAdapterMock
            .setup(bA => bA.setUserData(It.isValue(expecetedSetUserData)))
            .verifiable(Times.once());

        createStoreForLaunchPanelStateActions('setLaunchPanelType')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);

        browserAdapterMock.verifyAll();
    });

    function createStoreForLaunchPanelStateActions(actionName: keyof LaunchPanelStateActions) {
        const factory = (actions: LaunchPanelStateActions) => new LaunchPanelStore(actions, browserAdapterMock.object, userDataStub);

        return new StoreTester(LaunchPanelStateActions, actionName, factory);
    }

    function getDefaultState() {
        return createStoreWithNullParams(LaunchPanelStore).getDefaultState();
    }
});
