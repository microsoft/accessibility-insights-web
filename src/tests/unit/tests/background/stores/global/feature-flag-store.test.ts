// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';

import { FeatureFlagActions, FeatureFlagPayload } from '../../../../../../background/actions/feature-flag-actions';
import { ChromeAdapter } from '../../../../../../background/browser-adapter';
import { LocalStorageDataKeys } from '../../../../../../background/local-storage-data-keys';
import { ILocalStorageData } from '../../../../../../background/storage-data';
import { FeatureFlagStore } from '../../../../../../background/stores/global/feature-flag-store';
import { getDefaultFeatureFlagValues } from '../../../../../../common/feature-flags';
import { StoreNames } from '../../../../../../common/stores/store-names';
import { FeatureFlagStoreData } from '../../../../../../common/types/store-data/feature-flag-store-data';
import { createStoreWithNullParams, StoreTester } from '../../../../common/store-tester';

describe('FeatureFlagStoreTest', () => {
    let browserAdapterMock: IMock<ChromeAdapter>;
    let fakeFeatureFlagDefaultValue: FeatureFlagStoreData;
    let fakeFeatureFlagTestValue: FeatureFlagStoreData;
    const fakeFeature = 'fakeFeature';

    beforeAll(() => {
        fakeFeatureFlagDefaultValue = getDefaultFeatureFlagValues();
        fakeFeatureFlagDefaultValue[fakeFeature] = true;

        fakeFeatureFlagTestValue = getDefaultFeatureFlagValues();
        fakeFeatureFlagTestValue[fakeFeature] = false;

        browserAdapterMock = Mock.ofType(ChromeAdapter);
    });

    test('constructor, no side effects', () => {
        const testObject = createStoreWithNullParams(FeatureFlagStore);
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(FeatureFlagStore);
        expect(testObject.getId()).toEqual(StoreNames[StoreNames.FeatureFlagStore]);
    });

    test('initialize, no user data', () => {
        const expectedState = getDefaultFeatureFlagValues();
        const testObject = new FeatureFlagStore(new FeatureFlagActions(), null, null);
        testObject.initialize();
        expect(testObject.getState()).toEqual(expectedState);
    });

    test('initialize, no feature flags on user data', () => {
        const expectedState = getDefaultFeatureFlagValues();
        const testObject = new FeatureFlagStore(new FeatureFlagActions(), null, {});
        testObject.initialize();
        expect(testObject.getState()).toEqual(expectedState);
    });

    test('constructor custom state', () => {
        const testState: FeatureFlagStoreData = fakeFeatureFlagTestValue;
        const userDataStub: ILocalStorageData = {
            featureFlags: testState,
        };
        const testObject = new FeatureFlagStore(new FeatureFlagActions(), browserAdapterMock.object, userDataStub);
        testObject.getDefaultState = () => fakeFeatureFlagDefaultValue;

        testObject.initialize();
        expect(testObject.getState()).toEqual(testState);
    });

    test('constructor: initialize with force default states', () => {
        const testState: FeatureFlagStoreData = fakeFeatureFlagTestValue;
        const expectedState: FeatureFlagStoreData = fakeFeatureFlagDefaultValue;
        const userDataStub: ILocalStorageData = {
            featureFlags: testState,
        };
        const testObject = new FeatureFlagStore(new FeatureFlagActions(), browserAdapterMock.object, userDataStub);
        testObject.getDefaultState = () => fakeFeatureFlagDefaultValue;
        testObject.getForceDefaultFlags = () => [fakeFeature];

        testObject.initialize();
        expect(testObject.getState()).toEqual(expectedState);
    });

    test('on getCurrentState', () => {
        const initialState = getDefaultFeatureFlagValues();
        const finalState = getDefaultFeatureFlagValues();

        createStoreTesterForFeatureFlagActions('getCurrentState').testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on setFeatureFlag', () => {
        const initialState = getDefaultFeatureFlagValues();
        const userDataStub: ILocalStorageData = {
            featureFlags: getDefaultFeatureFlagValues(),
        };

        const featureFlagName = 'feature-flag-name';
        const finalState = getDefaultFeatureFlagValues();
        finalState[featureFlagName] = true;

        const payload: FeatureFlagPayload = {
            feature: featureFlagName,
            enabled: true,
        };

        browserAdapterMock
            .setup(ba => ba.setUserData(It.isValue({ [LocalStorageDataKeys.featureFlags]: finalState })))
            .verifiable(Times.once());

        createStoreTesterForFeatureFlagActions('setFeatureFlag', userDataStub)
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);

        browserAdapterMock.verifyAll();
    });

    test('onResetFeatureFlags', () => {
        const initialState = getDefaultFeatureFlagValues();
        const featureFlagName = 'feature-flag-name';
        initialState[featureFlagName] = true;

        const finalState = getDefaultFeatureFlagValues();

        createStoreTesterForFeatureFlagActions('resetFeatureFlags').testListenerToBeCalledOnce(initialState, finalState);
    });

    function createStoreTesterForFeatureFlagActions(
        actionName: keyof FeatureFlagActions,
        userData: ILocalStorageData = null,
    ): StoreTester<DictionaryStringTo<boolean>, FeatureFlagActions> {
        const factory = (actions: FeatureFlagActions) => new FeatureFlagStore(actions, browserAdapterMock.object, userData);
        return new StoreTester(FeatureFlagActions, actionName, factory);
    }
});
