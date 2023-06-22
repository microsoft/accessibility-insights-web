// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AutoDetectedFailuresDialogStatePayload,
    SaveIssueFilingSettingsPayload,
    SaveWindowBoundsPayload,
    SetHighContrastModePayload,
    SetIssueFilingServicePayload,
    SetIssueFilingServicePropertyPayload,
    SetNativeHighContrastModePayload,
} from 'background/actions/action-payloads';
import { UserConfigurationActions } from 'background/actions/user-configuration-actions';
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { ShowAssessmentDialogStateTelemetryData } from 'common/extension-telemetry-events';
import { WindowState } from 'electron/flux/types/window-state';
import { cloneDeep } from 'lodash';
import { failTestOnErrorLogger } from 'tests/unit/common/fail-test-on-error-logger';
import { IMock, It, Mock, Times } from 'typemoq';

import { IndexedDBAPI } from '../../../../../../common/indexedDB/indexedDB';
import { StoreNames } from '../../../../../../common/stores/store-names';
import {
    IssueFilingServiceProperties,
    IssueFilingServicePropertiesMap,
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
            lastSelectedHighContrast: false,
            bugService: 'none',
            bugServicePropertiesMap: {},
            lastWindowState: null,
            lastWindowBounds: null,
            showAutoDetectedFailuresDialog: true,
            showSaveAssessmentDialog: true,
        };
        defaultStoreData = {
            enableTelemetry: false,
            isFirstTime: true,
            enableHighContrast: false,
            lastSelectedHighContrast: false,
            bugService: 'none',
            bugServicePropertiesMap: {},
            lastWindowState: null,
            lastWindowBounds: null,
            showAutoDetectedFailuresDialog: true,
            showSaveAssessmentDialog: true,
        };
        indexDbStrictMock = Mock.ofType<IndexedDBAPI>();
    });

    test('verify state before initialize', () => {
        const testSubject = new UserConfigurationStore(
            initialStoreData,
            new UserConfigurationActions(),
            indexDbStrictMock.object,
            failTestOnErrorLogger,
        );

        expect(testSubject.getState()).toBeUndefined();
    });

    test('verify initial state when persisted state is null', () => {
        const testSubject = new UserConfigurationStore(
            null,
            new UserConfigurationActions(),
            indexDbStrictMock.object,
            failTestOnErrorLogger,
        );

        testSubject.initialize();

        expect(testSubject.getState()).toEqual(defaultStoreData);
    });

    test('verify initial state when not null', () => {
        const testSubject = new UserConfigurationStore(
            cloneDeep(initialStoreData),
            new UserConfigurationActions(),
            indexDbStrictMock.object,
            failTestOnErrorLogger,
        );

        testSubject.initialize();

        expect(testSubject.getState()).toEqual(initialStoreData);
    });

    test('verify initial state when not null, but new properties introduced in new iteration', () => {
        const persisted: Partial<UserConfigurationStoreData> = {
            enableTelemetry: false,
            isFirstTime: true,
            enableHighContrast: true,
            showAutoDetectedFailuresDialog: true,
            showSaveAssessmentDialog: true,
        };
        const expected: UserConfigurationStoreData = {
            bugService: 'none',
            bugServicePropertiesMap: {},
            lastSelectedHighContrast: false,
            lastWindowState: null,
            lastWindowBounds: null,
            ...persisted,
        } as UserConfigurationStoreData;
        const testSubject = new UserConfigurationStore(
            persisted as UserConfigurationStoreData,
            new UserConfigurationActions(),
            indexDbStrictMock.object,
            failTestOnErrorLogger,
        );

        testSubject.initialize();

        expect(testSubject.getState()).toEqual(expected);
    });

    test('get state returns clone data', () => {
        const testSubject = new UserConfigurationStore(
            null,
            new UserConfigurationActions(),
            indexDbStrictMock.object,
            failTestOnErrorLogger,
        );
        testSubject.initialize();

        const firstResult = testSubject.getState();
        const secondResult = testSubject.getState();

        expect(firstResult).toEqual(secondResult);
        expect(firstResult).not.toBe(secondResult);
    });

    test('getDefaultState returns cloned data when initial state is not null', () => {
        const testSubject = new UserConfigurationStore(
            cloneDeep(initialStoreData),
            new UserConfigurationActions(),
            indexDbStrictMock.object,
            failTestOnErrorLogger,
        );

        const firstCallDefaultState = testSubject.getDefaultState();
        expect(firstCallDefaultState).toEqual(initialStoreData);

        firstCallDefaultState.enableTelemetry = !firstCallDefaultState.enableTelemetry;

        expect(testSubject.getDefaultState()).toEqual(initialStoreData);
    });

    test('getDefaultState returns cloned data when initial state is null', () => {
        const testSubject = new UserConfigurationStore(
            null,
            new UserConfigurationActions(),
            indexDbStrictMock.object,
            failTestOnErrorLogger,
        );

        const firstCallDefaultState = testSubject.getDefaultState();
        expect(firstCallDefaultState).toEqual(defaultStoreData);

        firstCallDefaultState.enableTelemetry = !firstCallDefaultState.enableTelemetry;

        expect(testSubject.getDefaultState()).toEqual(defaultStoreData);
    });

    test('verify store id', () => {
        const testSubject = new UserConfigurationStore(
            initialStoreData,
            new UserConfigurationActions(),
            indexDbStrictMock.object,
            failTestOnErrorLogger,
        );

        expect(testSubject.getId()).toBe(StoreNames[StoreNames.UserConfigurationStore]);
    });

    test('getCurrentState action', async () => {
        const storeTester = createStoreToTestAction('getCurrentState');

        await storeTester.testListenerToBeCalledOnce(initialStoreData, cloneDeep(initialStoreData));
    });

    describe('setTelemetryConfig action', () => {
        it.each`
            isFirstTime | enableTelemetry
            ${true}     | ${true}
            ${true}     | ${false}
            ${false}    | ${true}
            ${false}    | ${false}
        `(
            'sets enableTelemetry per payload and isFirstTime to false for initial state isFirstTime=$isFirstTime enableTelemetry=$enableTelemetry',
            async ({ isFirstTime, enableTelemetry }) => {
                const storeTester = createStoreToTestAction('setTelemetryState');
                initialStoreData = {
                    enableTelemetry: enableTelemetry,
                    isFirstTime: isFirstTime,
                    enableHighContrast: false,
                    lastSelectedHighContrast: false,
                    bugService: 'none',
                    bugServicePropertiesMap: {},
                    lastWindowState: null,
                    lastWindowBounds: null,
                    showAutoDetectedFailuresDialog: true,
                    showSaveAssessmentDialog: true,
                };

                const expectedState: UserConfigurationStoreData = {
                    enableTelemetry: enableTelemetry,
                    isFirstTime: false,
                    enableHighContrast: false,
                    lastSelectedHighContrast: false,
                    bugService: 'none',
                    bugServicePropertiesMap: {},
                    lastWindowState: null,
                    lastWindowBounds: null,
                    showAutoDetectedFailuresDialog: true,
                    showSaveAssessmentDialog: true,
                };

                indexDbStrictMock
                    .setup(i =>
                        i.setItem(IndexedDBDataKeys.userConfiguration, It.isValue(expectedState)),
                    )
                    .returns(() => Promise.resolve(true))
                    .verifiable(Times.once());

                await storeTester
                    .withActionParam(enableTelemetry)
                    .withPostListenerMock(indexDbStrictMock)
                    .testListenerToBeCalledOnce(cloneDeep(initialStoreData), expectedState);
            },
        );
    });

    describe('setHighContrastMode action', () => {
        it.each`
            payload  | initialEnabled | initialLastSelected
            ${true}  | ${true}        | ${true}
            ${true}  | ${true}        | ${false}
            ${true}  | ${false}       | ${false}
            ${false} | ${true}        | ${true}
            ${false} | ${true}        | ${false}
            ${false} | ${false}       | ${false}
        `(
            'sets both enableHighContrast and lastSelectedHighContrast per payload $payload from initialState $initialState',
            async ({ payload, initialEnabled, initialLastSelected }) => {
                const storeTester = createStoreToTestAction('setHighContrastMode');
                initialStoreData = {
                    enableTelemetry: false,
                    isFirstTime: false,
                    enableHighContrast: initialEnabled,
                    lastSelectedHighContrast: initialLastSelected,
                    bugService: 'none',
                    bugServicePropertiesMap: {},
                    lastWindowState: null,
                    lastWindowBounds: null,
                    showAutoDetectedFailuresDialog: true,
                    showSaveAssessmentDialog: true,
                };

                const setHighContrastData: SetHighContrastModePayload = {
                    enableHighContrast: payload,
                };

                const expectedState: UserConfigurationStoreData = {
                    enableTelemetry: false,
                    isFirstTime: false,
                    enableHighContrast: payload,
                    lastSelectedHighContrast: payload,
                    bugService: 'none',
                    bugServicePropertiesMap: {},
                    lastWindowState: null,
                    lastWindowBounds: null,
                    showAutoDetectedFailuresDialog: true,
                    showSaveAssessmentDialog: true,
                };

                indexDbStrictMock
                    .setup(i =>
                        i.setItem(IndexedDBDataKeys.userConfiguration, It.isValue(expectedState)),
                    )
                    .returns(() => Promise.resolve(true))
                    .verifiable(Times.once());

                await storeTester
                    .withActionParam(setHighContrastData)
                    .withPostListenerMock(indexDbStrictMock)
                    .testListenerToBeCalledOnce(cloneDeep(initialStoreData), expectedState);
            },
        );
    });

    describe('setNativeHighContrastMode action', () => {
        it.each`
            payload  | initialEnabled | initialLastSelected | expectedEnabled
            ${true}  | ${true}        | ${true}             | ${true}
            ${true}  | ${true}        | ${false}            | ${true}
            ${true}  | ${false}       | ${false}            | ${true}
            ${false} | ${true}        | ${true}             | ${true}
            ${false} | ${true}        | ${false}            | ${false}
            ${false} | ${false}       | ${false}            | ${false}
        `(
            'sets enableHighContrast by merging initialLastSelected=$initialLastSelected, initialEanbled=$initialEnabled, payload=$payload into $expectedEnabled',
            async ({ payload, initialEnabled, initialLastSelected, expectedEnabled }) => {
                const storeTester = createStoreToTestAction('setNativeHighContrastMode');
                initialStoreData = {
                    enableTelemetry: false,
                    isFirstTime: false,
                    enableHighContrast: initialEnabled,
                    lastSelectedHighContrast: initialLastSelected,
                    bugService: 'none',
                    bugServicePropertiesMap: {},
                    lastWindowState: null,
                    lastWindowBounds: null,
                    showAutoDetectedFailuresDialog: true,
                    showSaveAssessmentDialog: true,
                };

                const setNativeHighContrastData: SetNativeHighContrastModePayload = {
                    enableHighContrast: payload,
                };

                const expectedState: UserConfigurationStoreData = {
                    enableTelemetry: false,
                    isFirstTime: false,
                    enableHighContrast: expectedEnabled,
                    lastSelectedHighContrast: initialLastSelected,
                    bugService: 'none',
                    bugServicePropertiesMap: {},
                    lastWindowState: null,
                    lastWindowBounds: null,
                    showAutoDetectedFailuresDialog: true,
                    showSaveAssessmentDialog: true,
                };

                indexDbStrictMock
                    .setup(i =>
                        i.setItem(IndexedDBDataKeys.userConfiguration, It.isValue(expectedState)),
                    )
                    .returns(() => Promise.resolve(true))
                    .verifiable(Times.once());

                await storeTester
                    .withActionParam(setNativeHighContrastData)
                    .withPostListenerMock(indexDbStrictMock)
                    .testListenerToBeCalledOnce(cloneDeep(initialStoreData), expectedState);
            },
        );
    });

    test.each(['none', 'userConfigurationStoreTestIssueFilingService'])(
        'setIssueFilingService action: %s',
        async (testIssueFilingService: string) => {
            const storeTester = createStoreToTestAction('setIssueFilingService');
            initialStoreData = {
                isFirstTime: false,
                enableTelemetry: false,
                enableHighContrast: false,
                lastSelectedHighContrast: false,
                bugService: 'none',
                bugServicePropertiesMap: {},
                lastWindowState: null,
                lastWindowBounds: null,
                showAutoDetectedFailuresDialog: true,
                showSaveAssessmentDialog: true,
            };

            const setIssueFilingServiceData: SetIssueFilingServicePayload = {
                issueFilingServiceName: testIssueFilingService,
            };

            const expectedState: UserConfigurationStoreData = {
                ...initialStoreData,
                bugService: testIssueFilingService,
            };

            indexDbStrictMock
                .setup(i =>
                    i.setItem(IndexedDBDataKeys.userConfiguration, It.isValue(expectedState)),
                )
                .returns(() => Promise.resolve(true))
                .verifiable(Times.once());

            await storeTester
                .withActionParam(setIssueFilingServiceData)
                .withPostListenerMock(indexDbStrictMock)
                .testListenerToBeCalledOnce(cloneDeep(initialStoreData), expectedState);
        },
    );

    test.each([
        undefined,
        null,
        {},
        { 'test-service': {} },
        { 'test-service': { 'test-name': 'test-value' } },
    ])(
        'setIssueFilingServiceProperty with initial map state %p',
        async (initialMapState: IssueFilingServicePropertiesMap) => {
            const storeTester = createStoreToTestAction('setIssueFilingServiceProperty');
            initialStoreData = {
                isFirstTime: false,
                enableTelemetry: false,
                enableHighContrast: false,
                lastSelectedHighContrast: false,
                bugService: 'none',
                bugServicePropertiesMap: initialMapState,
                lastWindowState: null,
                lastWindowBounds: null,
                showAutoDetectedFailuresDialog: true,
                showSaveAssessmentDialog: true,
            };

            const setIssueFilingServicePropertyData: SetIssueFilingServicePropertyPayload = {
                issueFilingServiceName: 'test-service',
                propertyName: 'test-name',
                propertyValue: 'test-value',
            };

            const expectedState: UserConfigurationStoreData = {
                ...initialStoreData,
                bugServicePropertiesMap: { 'test-service': { 'test-name': 'test-value' } },
            };

            indexDbStrictMock
                .setup(indexDb =>
                    indexDb.setItem(IndexedDBDataKeys.userConfiguration, It.isValue(expectedState)),
                )
                .returns(() => Promise.resolve(true))
                .verifiable(Times.once());

            await storeTester
                .withActionParam(setIssueFilingServicePropertyData)
                .withPostListenerMock(indexDbStrictMock)
                .testListenerToBeCalledOnce(cloneDeep(initialStoreData), expectedState);
        },
    );

    test('saveIssueFilingSettings', async () => {
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
            .setup(indexDb =>
                indexDb.setItem(IndexedDBDataKeys.userConfiguration, It.isValue(expectedState)),
            )
            .returns(() => Promise.resolve(true))
            .verifiable(Times.once());

        await storeTester
            .withActionParam(payload)
            .withPostListenerMock(indexDbStrictMock)
            .testListenerToBeCalledOnce(cloneDeep(initialStoreData), expectedState);
    });

    test('setAutoDetectedFailuresDialogState', async () => {
        const storeTester = createStoreToTestAction('setAutoDetectedFailuresDialogState');
        const showAutoDetectedFailuresDialog = false;
        const payload: AutoDetectedFailuresDialogStatePayload = {
            enabled: showAutoDetectedFailuresDialog,
        };
        const expectedState: UserConfigurationStoreData = {
            ...initialStoreData,
            showAutoDetectedFailuresDialog,
        };

        indexDbStrictMock
            .setup(indexDb =>
                indexDb.setItem(IndexedDBDataKeys.userConfiguration, It.isValue(expectedState)),
            )
            .returns(() => Promise.resolve(true))
            .verifiable(Times.once());

        await storeTester
            .withActionParam(payload)
            .withPostListenerMock(indexDbStrictMock)
            .testListenerToBeCalledOnce(cloneDeep(initialStoreData), expectedState);
    });

    test('setSaveAssessmentDialogState', async () => {
        const storeTester = createStoreToTestAction('setSaveAssessmentDialogState');
        const showSaveAssessmentDialog = false;
        const payload: ShowAssessmentDialogStateTelemetryData = {
            enabled: showSaveAssessmentDialog,
        };
        const expectedState: UserConfigurationStoreData = {
            ...initialStoreData,
            showSaveAssessmentDialog,
        };

        indexDbStrictMock
            .setup(indexDb =>
                indexDb.setItem(IndexedDBDataKeys.userConfiguration, It.isValue(expectedState)),
            )
            .returns(() => Promise.resolve(true))
            .verifiable(Times.once());

        await storeTester
            .withActionParam(payload)
            .withPostListenerMock(indexDbStrictMock)
            .testListenerToBeCalledOnce(cloneDeep(initialStoreData), expectedState);
    });

    test.each(['normal', 'maximized', 'full-screen'])(
        'saveLastWindowBounds windowState:$windowState',
        async windowState => {
            const expectBoundsSet: boolean = windowState === 'normal';
            const payload: SaveWindowBoundsPayload = {
                windowState: windowState as WindowState,
                windowBounds: { x: 5, y: 15, height: 30, width: 50 },
            };

            const storeTester = createStoreToTestAction('saveWindowBounds');
            initialStoreData = {
                isFirstTime: false,
                enableTelemetry: false,
                enableHighContrast: false,
                lastSelectedHighContrast: false,
                bugService: 'none',
                bugServicePropertiesMap: {},
                lastWindowState: null,
                lastWindowBounds: null,
                showAutoDetectedFailuresDialog: true,
                showSaveAssessmentDialog: true,
            };

            const expectedState: UserConfigurationStoreData = {
                ...initialStoreData,
                lastWindowState: payload.windowState,
                lastWindowBounds: expectBoundsSet ? payload.windowBounds : null,
            };

            indexDbStrictMock
                .setup(i =>
                    i.setItem(IndexedDBDataKeys.userConfiguration, It.isValue(expectedState)),
                )
                .returns(() => Promise.resolve(true))
                .verifiable(Times.once());

            await storeTester
                .withActionParam(payload)
                .withPostListenerMock(indexDbStrictMock)
                .testListenerToBeCalledOnce(cloneDeep(initialStoreData), expectedState);
        },
    );

    function createStoreToTestAction(
        actionName: keyof UserConfigurationActions,
    ): StoreTester<UserConfigurationStoreData, UserConfigurationActions> {
        const factory = (actions: UserConfigurationActions) =>
            new UserConfigurationStore(
                initialStoreData,
                actions,
                indexDbStrictMock.object,
                failTestOnErrorLogger,
            );

        return new StoreTester(UserConfigurationActions, actionName, factory);
    }
});
