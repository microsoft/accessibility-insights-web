// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NeedsReviewScanResultActions } from 'background/actions/needs-review-scan-result-actions';
import { TabActions } from 'background/actions/tab-actions';
import { NeedsReviewScanResultStore } from 'background/stores/needs-review-scan-result-store';
import { ScanIncompleteWarningId } from 'common/types/scan-incomplete-warnings';
import { NeedsReviewScanResultStoreData } from 'common/types/store-data/needs-review-scan-result-data';
import { UnifiedScanCompletedPayload } from '../../../../../background/actions/action-payloads';
import { StoreNames } from '../../../../../common/stores/store-names';
import { createStoreWithNullParams, StoreTester } from '../../../common/store-tester';
import { TargetAppData } from './../../../../../common/types/store-data/unified-data-interface';

describe('NeedsReviewScanResultStore Test', () => {
    test('constructor has no side effects', () => {
        const testObject = createStoreWithNullParams(NeedsReviewScanResultStore);
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(NeedsReviewScanResultStore);

        expect(testObject.getId()).toEqual(StoreNames[StoreNames.NeedsReviewScanResultStore]);
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

    test('onGetCurrentState', () => {
        const initialState = getDefaultState();
        const finalState = getDefaultState();

        createStoreForNeedsReviewScanResultActions('getCurrentState').testListenerToBeCalledOnce(
            initialState,
            finalState,
        );
    });

    test('onScanCompleted', () => {
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

        const expectedState: NeedsReviewScanResultStoreData = {
            rules: payload.rules,
            results: payload.scanResult,
            toolInfo: payload.toolInfo,
            targetAppInfo,
            timestamp: payload.timestamp,
            scanIncompleteWarnings: payload.scanIncompleteWarnings,
            screenshotData: payload.screenshotData,
            platformInfo: payload.platformInfo,
        };

        createStoreForNeedsReviewScanResultActions('scanCompleted')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onExistingTabUpdated', () => {
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
        } as NeedsReviewScanResultStoreData;

        const expectedState = getDefaultState();

        createStoreTesterForTabActions('existingTabUpdated').testListenerToBeCalledOnce(
            initialState,
            expectedState,
        );
    });

    function getDefaultState(): NeedsReviewScanResultStoreData {
        return createStoreWithNullParams(NeedsReviewScanResultStore).getDefaultState();
    }

    function createStoreForNeedsReviewScanResultActions(
        actionName: keyof NeedsReviewScanResultActions,
    ): StoreTester<NeedsReviewScanResultStoreData, NeedsReviewScanResultActions> {
        const factory = (actions: NeedsReviewScanResultActions) =>
            new NeedsReviewScanResultStore(actions, new TabActions(), null, null, null, null, true);

        return new StoreTester(NeedsReviewScanResultActions, actionName, factory);
    }

    function createStoreTesterForTabActions(
        actionName: keyof TabActions,
    ): StoreTester<NeedsReviewScanResultStoreData, TabActions> {
        const factory = (tabActions: TabActions) =>
            new NeedsReviewScanResultStore(
                new NeedsReviewScanResultActions(),
                tabActions,
                null,
                null,
                null,
                null,
                true,
            );

        return new StoreTester(TabActions, actionName, factory);
    }
});
