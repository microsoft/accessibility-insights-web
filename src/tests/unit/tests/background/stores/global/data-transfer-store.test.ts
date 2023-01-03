// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DataTransferActions } from 'background/actions/data-transfer-actions';
import { DataTransferStore } from 'background/stores/global/data-transfer-store';
import { StoreNames } from 'common/stores/store-names';
import { DataTransferStoreData } from 'common/types/store-data/data-transfer-store-data';
import { createStoreWithNullParams, StoreTester } from 'tests/unit/common/store-tester';

describe('DataTransferStore', () => {
    test('constructor, no side effects', () => {
        const testObject = createStoreWithNullParams(DataTransferStore);
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(DataTransferStore);
        expect(testObject.getId()).toEqual(StoreNames[StoreNames.DataTransferStore]);
    });

    test('on getCurrentState', async () => {
        const initialState = getDefaultState();

        const expectedState = getDefaultState();

        const storeTester = createStoreForDataTransferActions('getCurrentState');
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('on initiateTransferQuickAssessDataToAssessment', async () => {
        const initialState = getDefaultState();

        const expectedState = getDefaultState();
        expectedState.quickAssessToAssessmentInitiated = true;

        const storeTester = createStoreForDataTransferActions(
            'initiateTransferQuickAssessDataToAssessment',
        );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('on finalizeTransferQuickAssessDataToAssessment', async () => {
        const initialState = getDefaultState();
        initialState.quickAssessToAssessmentInitiated = true;

        const expectedState = getDefaultState();

        const storeTester = createStoreForDataTransferActions(
            'finalizeTransferQuickAssessDataToAssessment',
        );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    function createStoreForDataTransferActions(
        actionName: keyof DataTransferActions,
    ): StoreTester<DataTransferStoreData, DataTransferActions> {
        const factory = (actions: DataTransferActions) => new DataTransferStore(actions);

        return new StoreTester(DataTransferActions, actionName, factory);
    }

    function getDefaultState(): DataTransferStoreData {
        return createStoreWithNullParams(DataTransferStore).getDefaultState();
    }
});
