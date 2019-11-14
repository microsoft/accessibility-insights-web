// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    FeatureFlagActions,
    FeatureFlagPayload,
} from 'background/actions/feature-flag-actions';
import { LocalStorageDataKeys } from 'background/local-storage-data-keys';
import { LocalStorageData } from 'background/storage-data';
import { FeatureFlagStore } from 'background/stores/global/feature-flag-store';
import { StorageAdapter } from 'common/browser-adapters/storage-adapter';
import { getDefaultFeatureFlagValues } from 'common/feature-flags';
import { StoreNames } from 'common/stores/store-names';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { IMock, It, Mock } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';
import {
    createStoreWithNullParams,
    StoreTester,
} from '../../../../common/store-tester';

describe('FeatureFlagStoreTest', () => {
    let storageAdapterMock: IMock<StorageAdapter>;
    let fakeFeatureFlagDefaultValue: FeatureFlagStoreData;
    let fakeFeatureFlagTestValue: FeatureFlagStoreData;
    const fakeFeature = 'fakeFeature';

    beforeAll(() => {
        fakeFeatureFlagDefaultValue = getDefaultFeatureFlagValues();
        fakeFeatureFlagDefaultValue[fakeFeature] = true;

        fakeFeatureFlagTestValue = getDefaultFeatureFlagValues();
        fakeFeatureFlagTestValue[fakeFeature] = false;

        storageAdapterMock = Mock.ofType<StorageAdapter>();
    });

    test('constructor, no side effects', () => {
        const testObject = createStoreWithNullParams(FeatureFlagStore);
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(FeatureFlagStore);
        expect(testObject.getId()).toEqual(
            StoreNames[StoreNames.FeatureFlagStore],
        );
    });

    test('initialize, no user data', () => {
        const expectedState = getDefaultFeatureFlagValues();
        const testObject = new FeatureFlagStore(
            new FeatureFlagActions(),
            null,
            null,
        );
        testObject.initialize();
        expect(testObject.getState()).toEqual(expectedState);
    });

    test('initialize, no feature flags on user data', () => {
        const expectedState = getDefaultFeatureFlagValues();
        const testObject = new FeatureFlagStore(
            new FeatureFlagActions(),
            null,
            {},
        );
        testObject.initialize();
        expect(testObject.getState()).toEqual(expectedState);
    });

    test('constructor custom state', () => {
        const testState: FeatureFlagStoreData = fakeFeatureFlagTestValue;
        const userDataStub: LocalStorageData = {
            featureFlags: testState,
        };
        const testObject = createDefaultTestObject(userDataStub);
        testObject.getDefaultState = () => fakeFeatureFlagDefaultValue;

        testObject.initialize();
        expect(testObject.getState()).toEqual(testState);
    });

    test('constructor: initialize with force default states', () => {
        const testState: FeatureFlagStoreData = fakeFeatureFlagTestValue;
        const expectedState: FeatureFlagStoreData = fakeFeatureFlagDefaultValue;
        const userDataStub: LocalStorageData = {
            featureFlags: testState,
        };
        const testObject = createDefaultTestObject(userDataStub);
        testObject.getDefaultState = () => fakeFeatureFlagDefaultValue;
        testObject.getForceDefaultFlags = () => [fakeFeature];

        testObject.initialize();
        expect(testObject.getState()).toEqual(expectedState);
    });

    test('on getCurrentState', () => {
        const initialState = getDefaultFeatureFlagValues();
        const finalState = getDefaultFeatureFlagValues();

        createStoreTesterForFeatureFlagActions(
            'getCurrentState',
        ).testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on setFeatureFlag', () => {
        const initialState = getDefaultFeatureFlagValues();
        const userDataStub: LocalStorageData = {
            featureFlags: getDefaultFeatureFlagValues(),
        };

        const featureFlagName = 'feature-flag-name';
        const finalState = getDefaultFeatureFlagValues();
        finalState[featureFlagName] = true;

        const payload: FeatureFlagPayload = {
            feature: featureFlagName,
            enabled: true,
        };

        storageAdapterMock
            .setup(ba =>
                ba.setUserData(
                    It.isValue({
                        [LocalStorageDataKeys.featureFlags]: finalState,
                    }),
                ),
            )
            .returns(() => Promise.resolve());

        createStoreTesterForFeatureFlagActions('setFeatureFlag', userDataStub)
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onResetFeatureFlags', () => {
        const initialState = getDefaultFeatureFlagValues();
        const featureFlagName = 'feature-flag-name';
        initialState[featureFlagName] = true;

        const finalState = getDefaultFeatureFlagValues();

        createStoreTesterForFeatureFlagActions(
            'resetFeatureFlags',
        ).testListenerToBeCalledOnce(initialState, finalState);
    });

    function createDefaultTestObject(
        userDataStub: LocalStorageData,
    ): FeatureFlagStore {
        return new FeatureFlagStore(
            new FeatureFlagActions(),
            storageAdapterMock.object,
            userDataStub,
        );
    }

    function createStoreTesterForFeatureFlagActions(
        actionName: keyof FeatureFlagActions,
        userData: LocalStorageData = null,
    ): StoreTester<DictionaryStringTo<boolean>, FeatureFlagActions> {
        const factory = (actions: FeatureFlagActions) =>
            new FeatureFlagStore(actions, storageAdapterMock.object, userData);
        return new StoreTester(FeatureFlagActions, actionName, factory);
    }
});
