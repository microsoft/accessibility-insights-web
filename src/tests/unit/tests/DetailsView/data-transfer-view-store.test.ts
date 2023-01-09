// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { StoreNames } from 'common/stores/store-names';
import { DataTransferViewActions } from 'DetailsView/components/tab-stops/data-transfer-view-actions';
import {
    DataTransferViewStore,
    DataTransferViewStoreData,
} from 'DetailsView/data-transfer-view-store';
import { createStoreWithNullParams, StoreTester } from 'tests/unit/common/store-tester';

describe('DataTransferViewStore', () => {
    let testObject: DataTransferViewStore;

    beforeEach(() => {
        testObject = createStoreWithNullParams(DataTransferViewStore);
    });
    test('constructor  no side effects', () => {
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        expect(testObject.getId()).toEqual(StoreNames[StoreNames.DataTransferViewStore]);
    });

    test('getDefaultState', () => {
        const testObject = createStoreWithNullParams(DataTransferViewStore);
        const expected: DataTransferViewStoreData = {
            showQuickAssessToAssessmentConfirmDialog: false,
        };
        expect(testObject.getDefaultState()).toEqual(expected);
    });

    test('onHideQuickAssessToAssessmentConfirmDialog', async () => {
        const initialState = testObject.getDefaultState();
        initialState.showQuickAssessToAssessmentConfirmDialog = true;
        const finalState = testObject.getDefaultState();
        const storeTester = createStoreForDataTransferViewActions(
            'hideQuickAssessToAssessmentConfirmDialog',
        ).withActionParam(null);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onShowQuickAssessToAssessmentConfirmDialog', async () => {
        const initialState = testObject.getDefaultState();
        const finalState = testObject.getDefaultState();
        finalState.showQuickAssessToAssessmentConfirmDialog = true;
        const storeTester = createStoreForDataTransferViewActions(
            'showQuickAssessToAssessmentConfirmDialog',
        ).withActionParam(null);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    function createStoreForDataTransferViewActions(
        actionName: keyof DataTransferViewActions,
    ): StoreTester<DataTransferViewStoreData, DataTransferViewActions> {
        const factory = (actions: DataTransferViewActions) => new DataTransferViewStore(actions);

        return new StoreTester(DataTransferViewActions, actionName, factory);
    }
});
