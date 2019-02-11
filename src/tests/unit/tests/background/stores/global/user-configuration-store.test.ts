// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { cloneDeep } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';

import { SetTelemetryStatePayload, SetHighContrastModePayload } from '../../../../../../background/actions/action-payloads';
import { UserConfigurationActions } from '../../../../../../background/actions/user-configuration-actions';
import { IndexedDBDataKeys } from '../../../../../../background/IndexedDBDataKeys';
import { UserConfigurationStore } from '../../../../../../background/stores/global/user-configuration-store';
import { IndexedDBAPI } from '../../../../../../common/indexedDB/indexedDB';
import { StoreNames } from '../../../../../../common/stores/store-names';
import { UserConfigurationStoreData } from '../../../../../../common/types/store-data/user-configuration-store';
import { StoreTester } from '../../../../common/store-tester';
import { FeatureFlagPayload } from '../../../../../../background/actions/feature-flag-actions';
import { FeatureFlags } from '../../../../../../common/feature-flags';

describe('UserConfigurationStoreTest', () => {
    let initialStoreData: UserConfigurationStoreData;
    let defaultStoreData: UserConfigurationStoreData;
    let indexDbStrictMock: IMock<IndexedDBAPI>;

    beforeEach(() => {
        initialStoreData = { enableTelemetry: true, isFirstTime: false, enableHighContrast: false };
        defaultStoreData = { enableTelemetry: false, isFirstTime: true, enableHighContrast: false };
        indexDbStrictMock = Mock.ofType<IndexedDBAPI>();
    });

    test('verify state before initialize', () => {
        const testSubject = new UserConfigurationStore(initialStoreData, new UserConfigurationActions(), indexDbStrictMock.object);

        expect(testSubject.getState()).toBeUndefined();
    });

    test('verify initial state when null', () => {
        const testSubject = new UserConfigurationStore(null, new UserConfigurationActions(), indexDbStrictMock.object);

        testSubject.initialize();

        expect(testSubject.getState()).toEqual(defaultStoreData);
    });

    test('verify initial state when not null', () => {
        const testSubject = new UserConfigurationStore(
            cloneDeep(initialStoreData),
            new UserConfigurationActions(),
            indexDbStrictMock.object,
        );

        testSubject.initialize();

        expect(testSubject.getState()).toEqual(initialStoreData);
    });

    test('getDefaultState returns cloned data when initial state is not null', () => {
        const testSubject = new UserConfigurationStore(
            cloneDeep(initialStoreData),
            new UserConfigurationActions(),
            indexDbStrictMock.object,
        );

        const firstCallDefaultState = testSubject.getDefaultState();
        expect(firstCallDefaultState).toEqual(initialStoreData);

        firstCallDefaultState.enableTelemetry = !firstCallDefaultState.enableTelemetry;

        expect(testSubject.getDefaultState()).toEqual(initialStoreData);
    });

    test('getDefaultState returns cloned data when initial state is null', () => {
        const testSubject = new UserConfigurationStore(null, new UserConfigurationActions(), indexDbStrictMock.object);

        const firstCallDefaultState = testSubject.getDefaultState();
        expect(firstCallDefaultState).toEqual(defaultStoreData);

        firstCallDefaultState.enableTelemetry = !firstCallDefaultState.enableTelemetry;

        expect(testSubject.getDefaultState()).toEqual(defaultStoreData);
    });

    test('verify store id', () => {
        const testSubject = new UserConfigurationStore(initialStoreData, new UserConfigurationActions(), indexDbStrictMock.object);

        expect(testSubject.getId()).toBe(StoreNames[StoreNames.UserConfigurationStore]);
    });

    test('getCurrentState action', () => {
        const storeTester = createStoreToTestAction('getCurrentState');

        storeTester.testListenerToBeCalledOnce(initialStoreData, cloneDeep(initialStoreData));
    });

    test('onNotifyFeatureFlagChange calls setHighContrast when checks pass', () => {
        const payload: FeatureFlagPayload = {
            feature: FeatureFlags.highContrastMode,
            enabled: false,
        };
        const expectedState: UserConfigurationStoreData = {
            enableTelemetry: true,
            isFirstTime: false,
            enableHighContrast: false,
        };
        const storeTester = createStoreToTestAction('notifyFeatureFlagChange');
        storeTester
            .withActionParam(payload)
            .withPostListenerMock(indexDbStrictMock)
            .testListenerToBeCalledOnce(cloneDeep(initialStoreData), expectedState);
    });

    test('if onNotifyFeatureFlagChange wont setHighContrast because one of the check failed', () => {
        initialStoreData = {
            enableTelemetry: true,
            isFirstTime: false,
            enableHighContrast: true,
        };
        const expectedState: UserConfigurationStoreData = {
            enableTelemetry: true,
            isFirstTime: false,
            enableHighContrast: true,
        };

        const payload: FeatureFlagPayload = {
            feature: FeatureFlags.highContrastMode,
            enabled: true,
        };
        const storeTester = createStoreToTestAction('notifyFeatureFlagChange');
        storeTester
            .withActionParam(payload)
            .withPostListenerMock(indexDbStrictMock)
            .testListenerToNeverBeCalled(cloneDeep(initialStoreData), expectedState);
    });

    type SetUserConfigTestCase = {
        isFirstTime: boolean;
        enableTelemetry: boolean;
        enableHighContrastMode: boolean;
    };
    test.each([
        { enableTelemetry: true, isFirstTime: true, enableHighContrastMode: false } as SetUserConfigTestCase,
        { enableTelemetry: true, isFirstTime: false, enableHighContrastMode: false } as SetUserConfigTestCase,
        { enableTelemetry: false, isFirstTime: false, enableHighContrastMode: false } as SetUserConfigTestCase,
        { enableTelemetry: false, isFirstTime: true, enableHighContrastMode: false } as SetUserConfigTestCase,
    ])('setTelemetryConfig action: %o', (testCase: SetUserConfigTestCase) => {
        const storeTester = createStoreToTestAction('setTelemetryState');
        initialStoreData = {
            enableTelemetry: testCase.enableTelemetry,
            isFirstTime: testCase.isFirstTime,
            enableHighContrast: false,
        };

        const setTelemetryStateData: SetTelemetryStatePayload = {
            enableTelemetry: testCase.enableTelemetry,
        };

        const expectedState: UserConfigurationStoreData = {
            enableTelemetry: testCase.enableTelemetry,
            isFirstTime: false,
            enableHighContrast: false,
        };

        indexDbStrictMock.setup(i => i.setItem(IndexedDBDataKeys.userConfiguration, It.isValue(expectedState))).verifiable(Times.once());

        storeTester
            .withActionParam(setTelemetryStateData)
            .withPostListenerMock(indexDbStrictMock)
            .testListenerToBeCalledOnce(cloneDeep(initialStoreData), expectedState);
    });

    test.each([
        { enableTelemetry: false, isFirstTime: false, enableHighContrastMode: true } as SetUserConfigTestCase,
        { enableTelemetry: false, isFirstTime: false, enableHighContrastMode: false } as SetUserConfigTestCase,
    ])('setHighContrast action: %o', (testCase: SetUserConfigTestCase) => {
        const storeTester = createStoreToTestAction('setHighContrastMode');
        initialStoreData = {
            enableTelemetry: false,
            isFirstTime: false,
            enableHighContrast: testCase.enableHighContrastMode,
        };

        const setHighContrastData: SetHighContrastModePayload = {
            enableHighContrast: testCase.enableHighContrastMode,
        };

        const expectedState: UserConfigurationStoreData = {
            enableTelemetry: false,
            isFirstTime: false,
            enableHighContrast: testCase.enableHighContrastMode,
        };

        indexDbStrictMock.setup(i => i.setItem(IndexedDBDataKeys.userConfiguration, It.isValue(expectedState))).verifiable(Times.once());

        storeTester
            .withActionParam(setHighContrastData)
            .withPostListenerMock(indexDbStrictMock)
            .testListenerToBeCalledOnce(cloneDeep(initialStoreData), expectedState);
    });

    function createStoreToTestAction(actionName: keyof UserConfigurationActions) {
        const factory = (actions: UserConfigurationActions) =>
            new UserConfigurationStore(initialStoreData, actions, indexDbStrictMock.object);

        return new StoreTester(UserConfigurationActions, actionName, factory);
    }
});
