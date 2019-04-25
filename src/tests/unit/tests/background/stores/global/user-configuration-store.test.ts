// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { cloneDeep } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';

import {
    SaveIssueFilingSettingsPayload,
    SetHighContrastModePayload,
    SetIssueFilingServicePayload,
    SetIssueFilingServicePropertyPayload,
    SetIssueTrackerPathPayload,
    SetTelemetryStatePayload,
} from '../../../../../../background/actions/action-payloads';
import { UserConfigurationActions } from '../../../../../../background/actions/user-configuration-actions';
import { IndexedDBDataKeys } from '../../../../../../background/IndexedDBDataKeys';
import { UserConfigurationStore } from '../../../../../../background/stores/global/user-configuration-store';
import { IndexedDBAPI } from '../../../../../../common/indexedDB/indexedDB';
import { StoreNames } from '../../../../../../common/stores/store-names';
import {
    IssueFilingServiceProperties,
    IssueServicePropertiesMap,
    UserConfigurationStoreData,
} from '../../../../../../common/types/store-data/user-configuration-store';
import { StoreTester } from '../../../../common/store-tester';

describe('UserConfigurationStoreTest', () => {
    let initialStoreData: UserConfigurationStoreData;
    let defaultStoreData: UserConfigurationStoreData;
    let indexDbStrictMock: IMock<IndexedDBAPI>;

    beforeEach(() => {
        initialStoreData = {
            enableTelemetry: true,
            isFirstTime: false,
            enableHighContrast: false,
            bugService: 'none',
            bugServicePropertiesMap: {},
        };
        defaultStoreData = {
            enableTelemetry: false,
            isFirstTime: true,
            enableHighContrast: false,
            bugService: 'none',
            bugServicePropertiesMap: {},
        };
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

    test('verify initial state when not null, but new properties introduced in new iteration', () => {
        const persisted: Partial<UserConfigurationStoreData> = {
            enableTelemetry: false,
            isFirstTime: true,
            enableHighContrast: true,
        };
        const expected: UserConfigurationStoreData = {
            bugService: 'none',
            bugServicePropertiesMap: {},
            ...persisted,
        } as UserConfigurationStoreData;
        const testSubject = new UserConfigurationStore(
            persisted as UserConfigurationStoreData,
            new UserConfigurationActions(),
            indexDbStrictMock.object,
        );

        testSubject.initialize();

        expect(testSubject.getState()).toEqual(expected);
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

    type SetUserConfigTestCase = {
        isFirstTime: boolean;
        enableTelemetry: boolean;
        enableHighContrastMode: boolean;
        issueTrackerPath?: string;
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
            bugService: 'none',
            bugServicePropertiesMap: {},
        };

        const setTelemetryStateData: SetTelemetryStatePayload = {
            enableTelemetry: testCase.enableTelemetry,
        };

        const expectedState: UserConfigurationStoreData = {
            enableTelemetry: testCase.enableTelemetry,
            isFirstTime: false,
            enableHighContrast: false,
            bugService: 'none',
            bugServicePropertiesMap: {},
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
            bugService: 'none',
            bugServicePropertiesMap: {},
        };

        const setHighContrastData: SetHighContrastModePayload = {
            enableHighContrast: testCase.enableHighContrastMode,
        };

        const expectedState: UserConfigurationStoreData = {
            enableTelemetry: false,
            isFirstTime: false,
            enableHighContrast: testCase.enableHighContrastMode,
            bugService: 'none',
            bugServicePropertiesMap: {},
        };

        indexDbStrictMock.setup(i => i.setItem(IndexedDBDataKeys.userConfiguration, It.isValue(expectedState))).verifiable(Times.once());

        storeTester
            .withActionParam(setHighContrastData)
            .withPostListenerMock(indexDbStrictMock)
            .testListenerToBeCalledOnce(cloneDeep(initialStoreData), expectedState);
    });

    test.each(['none', 'userConfigurationStoreTestIssueService'])('setIssueService action: %s', (testIssueService: string) => {
        const storeTester = createStoreToTestAction('setIssueService');
        initialStoreData = {
            isFirstTime: false,
            enableTelemetry: false,
            enableHighContrast: false,
            bugService: 'none',
            bugServicePropertiesMap: {},
        };

        const setIssueServiceData: SetIssueFilingServicePayload = {
            issueFilingServiceName: testIssueService,
        };

        const expectedState: UserConfigurationStoreData = {
            ...initialStoreData,
            bugService: testIssueService,
        };

        indexDbStrictMock.setup(i => i.setItem(IndexedDBDataKeys.userConfiguration, It.isValue(expectedState))).verifiable(Times.once());

        storeTester
            .withActionParam(setIssueServiceData)
            .withPostListenerMock(indexDbStrictMock)
            .testListenerToBeCalledOnce(cloneDeep(initialStoreData), expectedState);
    });

    test.each([
        { enableTelemetry: false, isFirstTime: false, enableHighContrastMode: false } as SetUserConfigTestCase,
        { enableTelemetry: false, isFirstTime: false, enableHighContrastMode: false, issueTrackerPath: 'example' } as SetUserConfigTestCase,
    ])('setIssueTrackerPath action: %o', (testCase: SetUserConfigTestCase) => {
        const storeTester = createStoreToTestAction('setIssueTrackerPath');
        initialStoreData = {
            enableTelemetry: false,
            isFirstTime: false,
            enableHighContrast: false,
            issueTrackerPath: testCase.issueTrackerPath,
            bugService: 'none',
            bugServicePropertiesMap: {},
        };

        const setIssueTrackerPathData: SetIssueTrackerPathPayload = {
            issueTrackerPath: testCase.issueTrackerPath,
        };

        const expectedState: UserConfigurationStoreData = {
            enableTelemetry: false,
            isFirstTime: false,
            enableHighContrast: false,
            issueTrackerPath: testCase.issueTrackerPath,
            bugService: 'none',
            bugServicePropertiesMap: {},
        };

        indexDbStrictMock.setup(i => i.setItem(IndexedDBDataKeys.userConfiguration, It.isValue(expectedState))).verifiable(Times.once());

        storeTester
            .withActionParam(setIssueTrackerPathData)
            .withPostListenerMock(indexDbStrictMock)
            .testListenerToBeCalledOnce(cloneDeep(initialStoreData), expectedState);
    });

    test.each([undefined, null, {}, { 'test-service': {} }, { 'test-service': { 'test-name': 'test-value' } }])(
        'setIssueServiceProperty with initial map state %o',
        (initialMapState: IssueServicePropertiesMap) => {
            const storeTester = createStoreToTestAction('setIssueServiceProperty');
            initialStoreData = {
                isFirstTime: false,
                enableTelemetry: false,
                enableHighContrast: false,
                bugService: 'none',
                bugServicePropertiesMap: initialMapState,
            };

            const setIssueServicePropertyData: SetIssueFilingServicePropertyPayload = {
                issueFilingServiceName: 'test-service',
                propertyName: 'test-name',
                propertyValue: 'test-value',
            };

            const expectedState: UserConfigurationStoreData = {
                ...initialStoreData,
                bugServicePropertiesMap: { 'test-service': { 'test-name': 'test-value' } },
            };

            indexDbStrictMock
                .setup(indexDb => indexDb.setItem(IndexedDBDataKeys.userConfiguration, It.isValue(expectedState)))
                .verifiable(Times.once());

            storeTester
                .withActionParam(setIssueServicePropertyData)
                .withPostListenerMock(indexDbStrictMock)
                .testListenerToBeCalledOnce(cloneDeep(initialStoreData), expectedState);
        },
    );

    test('saveIssueFilingSettings', () => {
        const storeTester = createStoreToTestAction('saveIssueFilingSettings');
        const serviceName = 'test service';
        const bugServiceProperties: IssueFilingServiceProperties = {
            name: 'bug settings',
        };
        const payload: SaveIssueFilingSettingsPayload = {
            issueFilingServiceName: serviceName,
            issueFilingSettings: bugServiceProperties,
        };
        const expectedState: UserConfigurationStoreData = {
            ...initialStoreData,
            bugService: serviceName,
            bugServicePropertiesMap: { [serviceName]: bugServiceProperties },
        };

        indexDbStrictMock
            .setup(indexDb => indexDb.setItem(IndexedDBDataKeys.userConfiguration, It.isValue(expectedState)))
            .verifiable(Times.once());

        storeTester
            .withActionParam(payload)
            .withPostListenerMock(indexDbStrictMock)
            .testListenerToBeCalledOnce(cloneDeep(initialStoreData), expectedState);
    });

    function createStoreToTestAction(
        actionName: keyof UserConfigurationActions,
    ): StoreTester<UserConfigurationStoreData, UserConfigurationActions> {
        const factory = (actions: UserConfigurationActions) =>
            new UserConfigurationStore(initialStoreData, actions, indexDbStrictMock.object);

        return new StoreTester(UserConfigurationActions, actionName, factory);
    }
});
