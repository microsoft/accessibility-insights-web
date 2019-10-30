// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
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

        expect(defaultState.results).toEqual(null);
        expect(defaultState.rules).toEqual(null);
        expect(defaultState.toolInfo).toEqual(null);
        expect(defaultState.screenshotData).toEqual(null);
    });

    test('onGetCurrentState', () => {
        const initialState = getDefaultState();
        const finalState = getDefaultState();

        createStoreForUnifiedScanResultActions('getCurrentState').testListenerToBeCalledOnce(initialState, finalState);
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
            screenshotData: {
                base64PngData: 'testScreenshotText',
            },
            targetAppInfo,
        } as UnifiedScanCompletedPayload;

        const expectedState: UnifiedScanResultStoreData = {
            rules: payload.rules,
            results: payload.scanResult,
            toolInfo: payload.toolInfo,
            targetAppInfo,
            screenshotData: payload.screenshotData,
        };

        createStoreForUnifiedScanResultActions('scanCompleted')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    function getDefaultState(): UnifiedScanResultStoreData {
        return createStoreWithNullParams(UnifiedScanResultStore).getDefaultState();
    }

    function createStoreForUnifiedScanResultActions(
        actionName: keyof UnifiedScanResultActions,
    ): StoreTester<UnifiedScanResultStoreData, UnifiedScanResultActions> {
        const factory = (actions: UnifiedScanResultActions) => new UnifiedScanResultStore(actions);

        return new StoreTester(UnifiedScanResultActions, actionName, factory);
    }
});
