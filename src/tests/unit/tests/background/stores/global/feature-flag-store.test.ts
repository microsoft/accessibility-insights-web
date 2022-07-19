// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagActions, FeatureFlagPayload } from 'background/actions/feature-flag-actions';
import { LocalStorageDataKeys } from 'background/local-storage-data-keys';
import { LocalStorageData } from 'background/storage-data';
import { FeatureFlagStore } from 'background/stores/global/feature-flag-store';
import { StorageAdapter } from 'common/browser-adapters/storage-adapter';
import { FeatureFlagDefaultsHelper } from 'common/feature-flag-defaults-helper';
import { StoreNames } from 'common/stores/store-names';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { IMock, It, Mock } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';
import { createStoreWithNullParams, StoreTester } from '../../../../common/store-tester';

describe('FeatureFlagStoreTest', () => {
    let storageAdapterMock: IMock<StorageAdapter>;
    let fakeFeatureFlagDefaultValue: FeatureFlagStoreData;
    let fakeFeatureFlagTestValue: FeatureFlagStoreData;
    const testFeature = 'fakeFeature';
    let getForceDefaultFeatures: string[];
    let featureFlagDefaultsHelperMock: IMock<FeatureFlagDefaultsHelper>;

    beforeEach(() => {
        getForceDefaultFeatures = ['defaultFeature'];

        fakeFeatureFlagDefaultValue = createFakeDefaultFeatureFlagValues();

        fakeFeatureFlagTestValue = createFakeDefaultFeatureFlagValues();
        fakeFeatureFlagTestValue[testFeature] = false;

        storageAdapterMock = Mock.ofType<StorageAdapter>();

        featureFlagDefaultsHelperMock = Mock.ofType<FeatureFlagDefaultsHelper>();
        featureFlagDefaultsHelperMock
            .setup(f => f.getDefaultFeatureFlagValues())
            .returns(() => createFakeDefaultFeatureFlagValues());
        featureFlagDefaultsHelperMock
            .setup(f => f.getForceDefaultFlags())
            .returns(() => getForceDefaultFeatures);
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
        const expectedState = createFakeDefaultFeatureFlagValues();
        const testObject = createDefaultTestObject(null);

        testObject.initialize();
        expect(testObject.getState()).toEqual(expectedState);
    });

    test('initialize, no feature flags on user data', () => {
        const expectedState = createFakeDefaultFeatureFlagValues();
        const testObject = createDefaultTestObject({});

        testObject.initialize();
        expect(testObject.getState()).toEqual(expectedState);
    });

    test('constructor custom state', () => {
        const testState: FeatureFlagStoreData = fakeFeatureFlagTestValue;
        const userDataStub: LocalStorageData = {
            featureFlags: testState,
        };
        const testObject = createDefaultTestObject(userDataStub);

        testObject.initialize();
        expect(testObject.getState()).toEqual(testState);
    });

    test('constructor: initialize with force default states', () => {
        const testState: FeatureFlagStoreData = fakeFeatureFlagTestValue;
        const expectedState: FeatureFlagStoreData = fakeFeatureFlagDefaultValue;
        const userDataStub: LocalStorageData = {
            featureFlags: testState,
        };
        getForceDefaultFeatures = [testFeature];
        const testObject = createDefaultTestObject(userDataStub);

        testObject.initialize();
        expect(testObject.getState()).toEqual(expectedState);
    });

    test('on getCurrentState', async () => {
        const initialState = createFakeDefaultFeatureFlagValues();
        const finalState = createFakeDefaultFeatureFlagValues();

        const storeTester = createStoreTesterForFeatureFlagActions('getCurrentState');
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on setFeatureFlag', async () => {
        const initialState = createFakeDefaultFeatureFlagValues();
        const userDataStub: LocalStorageData = {
            featureFlags: createFakeDefaultFeatureFlagValues(),
        };

        const featureFlagName = 'feature-flag-name';
        const finalState = createFakeDefaultFeatureFlagValues();
        finalState[featureFlagName] = true;

        const payload: FeatureFlagPayload = {
            feature: featureFlagName,
            enabled: true,
        };

        storageAdapterMock
            .setup(ba =>
                ba.setUserData(It.isValue({ [LocalStorageDataKeys.featureFlags]: finalState })),
            )
            .returns(() => Promise.resolve());

        const storeTester = createStoreTesterForFeatureFlagActions(
            'setFeatureFlag',
            userDataStub,
        ).withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onResetFeatureFlags', async () => {
        const initialState = createFakeDefaultFeatureFlagValues();
        const featureFlagName = 'feature-flag-name';
        initialState[featureFlagName] = true;

        const finalState = createFakeDefaultFeatureFlagValues();

        const storeTester = createStoreTesterForFeatureFlagActions('resetFeatureFlags');
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    function createDefaultTestObject(userDataStub: LocalStorageData): FeatureFlagStore {
        return new FeatureFlagStore(
            new FeatureFlagActions(),
            storageAdapterMock.object,
            userDataStub,
            featureFlagDefaultsHelperMock.object,
        );
    }

    function createStoreTesterForFeatureFlagActions(
        actionName: keyof FeatureFlagActions,
        userData: LocalStorageData = null,
    ): StoreTester<DictionaryStringTo<boolean>, FeatureFlagActions> {
        const factory = (actions: FeatureFlagActions) =>
            new FeatureFlagStore(
                actions,
                storageAdapterMock.object,
                userData,
                featureFlagDefaultsHelperMock.object,
            );
        return new StoreTester(FeatureFlagActions, actionName, factory);
    }

    function createFakeDefaultFeatureFlagValues(): FeatureFlagStoreData {
        return {
            defaultFeature: true,
            fakeFeature: true,
        };
    }
});
