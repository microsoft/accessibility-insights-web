// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabActions } from 'background/actions/tab-actions';
import { ScanIncompleteWarningId } from 'common/types/store-data/scan-incomplete-warnings';
import { UnifiedScanCompletedPayload } from '../../../../../background/actions/action-payloads';
import { UnifiedScanResultActions } from '../../../../../background/actions/unified-scan-result-actions';
import { UnifiedScanResultStore } from '../../../../../background/stores/unified-scan-result-store';
import { StoreNames } from '../../../../../common/stores/store-names';
import { UnifiedScanResultStoreData } from '../../../../../common/types/store-data/unified-data-interface';
import { createStoreWithNullParams, StoreTester } from '../../../common/store-tester';
import { TargetAppData } from './../../../../../common/types/store-data/unified-data-interface';

describe('UnifiedScanResultStore Test', () => {
    test('constructor has no side effects', () => {
        const testObject = createStoreWithNullParams(UnifiedScanResultStore);
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(UnifiedScanResultStore);

        expect(testObject.getId()).toEqual(StoreNames[StoreNames.UnifiedScanResultStore]);
    });

    test('check defaultState is empty', () => {
        const defaultState = getDefaultState();

        expect(defaultState.results).toBeNull();
        expect(defaultState.rules).toBeNull();
        expect(defaultState.toolInfo).toBeNull();
        expect(defaultState.scanIncompleteWarnings).toBeNull();
        expect(defaultState.screenshotData).toBeNull();
        expect(defaultState.platformInfo).toBeNull();
    });

    test('onGetCurrentState', async () => {
        const initialState = getDefaultState();
        const finalState = getDefaultState();

        const storeTester = createStoreTesterForUnifiedScanResultActions('getCurrentState');
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onScanCompleted', async () => {
        const initialState = getDefaultState();
        const targetAppInfo: TargetAppData = { name: 'app name' };
        const payload: UnifiedScanCompletedPayload = {
            scanResult: [
                {
                    uid: 'test-uid',
                },
            ],
            rules: [
                {
                    id: 'test-rule-id',
                },
            ],
            toolInfo: {
                scanEngineProperties: {
                    name: 'test-scan-engine-name',
                },
            },
            timestamp: 'timestamp',
            scanIncompleteWarnings: ['some-incomplete-warning-id' as ScanIncompleteWarningId],
            screenshotData: {
                base64PngData: 'testScreenshotText',
            },
            targetAppInfo,
            platformInfo: {
                deviceName: 'test-device-name',
            },
        } as UnifiedScanCompletedPayload;

        const expectedState: UnifiedScanResultStoreData = {
            rules: payload.rules,
            results: payload.scanResult,
            toolInfo: payload.toolInfo,
            targetAppInfo,
            timestamp: payload.timestamp,
            scanIncompleteWarnings: payload.scanIncompleteWarnings,
            screenshotData: payload.screenshotData,
            platformInfo: payload.platformInfo,
        };

        const storeTester =
            createStoreTesterForUnifiedScanResultActions('scanCompleted').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onExistingTabUpdated', async () => {
        const initialState = {
            results: [
                {
                    uid: 'test-uid',
                },
            ],
            rules: [
                {
                    id: 'test-rule-id',
                },
            ],
            toolInfo: {
                scanEngineProperties: {
                    name: 'test-scan-engine-name',
                },
            },
            timestamp: 'timestamp',
            scanIncompleteWarnings: ['some-incomplete-warning-id' as ScanIncompleteWarningId],
            screenshotData: {
                base64PngData: 'testScreenshotText',
            },
            targetAppInfo: { name: 'app name' },
            platformInfo: {
                deviceName: 'test-device-name',
            },
        } as UnifiedScanResultStoreData;

        const expectedState = getDefaultState();

        const storeTester = createStoreTesterForTabActions('existingTabUpdated');
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    function getDefaultState(): UnifiedScanResultStoreData {
        return createStoreWithNullParams(UnifiedScanResultStore).getDefaultState();
    }

    function createStoreTesterForUnifiedScanResultActions(
        actionName: keyof UnifiedScanResultActions,
    ): StoreTester<UnifiedScanResultStoreData, UnifiedScanResultActions> {
        const factory = (unifiedScanResultActions: UnifiedScanResultActions) =>
            new UnifiedScanResultStore(
                unifiedScanResultActions,
                new TabActions(),
                null,
                null,
                null,
                null,
            );

        return new StoreTester(UnifiedScanResultActions, actionName, factory);
    }

    function createStoreTesterForTabActions(
        actionName: keyof TabActions,
    ): StoreTester<UnifiedScanResultStoreData, TabActions> {
        const factory = (tabActions: TabActions) =>
            new UnifiedScanResultStore(
                new UnifiedScanResultActions(),
                tabActions,
                null,
                null,
                null,
                null,
            );

        return new StoreTester(TabActions, actionName, factory);
    }
});
