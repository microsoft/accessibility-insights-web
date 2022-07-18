// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { LaunchPanelStateActions } from 'background/actions/launch-panel-state-action';
import { LocalStorageDataKeys } from 'background/local-storage-data-keys';
import { LocalStorageData } from 'background/storage-data';
import { LaunchPanelStore } from 'background/stores/global/launch-panel-store';
import { StorageAdapter } from 'common/browser-adapters/storage-adapter';
import { StoreNames } from 'common/stores/store-names';
import {
    LaunchPanelStoreData,
    LaunchPanelType,
} from 'common/types/store-data/launch-panel-store-data';
import { IMock, It, Mock } from 'typemoq';
import { createStoreWithNullParams, StoreTester } from '../../../../common/store-tester';

describe('LaunchPanelStateStoreTest', () => {
    let userDataStub: LocalStorageData;
    let storageAdapterMock: IMock<StorageAdapter>;

    beforeAll(() => {
        userDataStub = { launchPanelSetting: LaunchPanelType.AdhocToolsPanel };
        storageAdapterMock = Mock.ofType<StorageAdapter>();
    });

    test('constructor, no side effects', () => {
        const testObject = createStoreWithNullParams(LaunchPanelStore);
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(LaunchPanelStore);
        expect(testObject.getId()).toEqual(StoreNames[StoreNames.LaunchPanelStateStore]);
    });

    test('on getCurrentState', async () => {
        const initialState = getDefaultState();

        const expectedState = getDefaultState();

        const storeTester = createStoreForLaunchPanelStateActions('getCurrentState');
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('initialize, user data is not null', () => {
        const expectedState = {
            launchPanelType: userDataStub.launchPanelSetting,
        };

        const testObject = new LaunchPanelStore(new LaunchPanelStateActions(), null, userDataStub);
        testObject.initialize();
        expect(testObject.getState()).toEqual(expectedState);
    });

    test('onSetLaunchPanelState: preserving state', async () => {
        const initialState = getDefaultState();

        const payload = LaunchPanelType.AdhocToolsPanel;

        const expectedState = getDefaultState();
        expectedState.launchPanelType = payload;

        const expectedSetUserData = {
            [LocalStorageDataKeys.launchPanelSetting]: payload,
        };

        storageAdapterMock
            .setup(adapter => adapter.setUserData(It.isValue(expectedSetUserData)))
            .returns(() => Promise.resolve());

        const storeTester =
            createStoreForLaunchPanelStateActions('setLaunchPanelType').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);

        storageAdapterMock.verifyAll();
    });

    function createStoreForLaunchPanelStateActions(
        actionName: keyof LaunchPanelStateActions,
    ): StoreTester<LaunchPanelStoreData, LaunchPanelStateActions> {
        const factory = (actions: LaunchPanelStateActions) =>
            new LaunchPanelStore(actions, storageAdapterMock.object, userDataStub);

        return new StoreTester(LaunchPanelStateActions, actionName, factory);
    }

    function getDefaultState(): LaunchPanelStoreData {
        return createStoreWithNullParams(LaunchPanelStore).getDefaultState();
    }
});
