// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { StoreNames } from 'common/stores/store-names';
import { CapturedInstanceActionType } from 'common/types/captured-instance-action-type';
import {
    TabStopsViewActions,
    EditExistingFailureInstancePayload,
} from 'DetailsView/components/tab-stops/tab-stops-view-actions';
import { TabStopsViewStore } from 'DetailsView/components/tab-stops/tab-stops-view-store';
import { TabStopsViewStoreData } from 'DetailsView/components/tab-stops/tab-stops-view-store-data';
import { createStoreWithNullParams, StoreTester } from 'tests/unit/common/store-tester';

describe(TabStopsViewStore, () => {
    test('constructor  no side effects', () => {
        const testObject = createStoreWithNullParams(TabStopsViewStore);
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(TabStopsViewStore);
        expect(testObject.getId()).toEqual(StoreNames[StoreNames.TabStopsViewStore]);
    });

    test('getDefaultState', () => {
        const testObject = createStoreWithNullParams(TabStopsViewStore);
        const expected: TabStopsViewStoreData = {
            failureInstanceState: {
                isPanelOpen: false,
                description: null,
                selectedInstanceId: null,
                selectedRequirementId: null,
                actionType: CapturedInstanceActionType.CREATE,
            },
        };
        expect(testObject.getDefaultState()).toEqual(expected);
    });

    test('onDismissPanel', () => {
        const initialState = getDefaultState();
        initialState.failureInstanceState.isPanelOpen = true;
        const finalState = getDefaultState();
        createStoreForTabStopsViewActions('dismissPanel')
            .withActionParam(null)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onUpdateDescription', () => {
        const expectedDescription = 'some description';
        const initialState = getDefaultState();
        const finalState = getDefaultState();
        finalState.failureInstanceState.description = expectedDescription;
        createStoreForTabStopsViewActions('updateDescription')
            .withActionParam(expectedDescription)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onCreateNewFailureInstancePanel', () => {
        const requirementId = 'focus-indicator';
        const initialState = getDefaultState();
        const finalState = getDefaultState();
        finalState.failureInstanceState.selectedRequirementId = requirementId;
        finalState.failureInstanceState.isPanelOpen = true;
        createStoreForTabStopsViewActions('createNewFailureInstancePanel')
            .withActionParam(requirementId)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onEditExistingFailureInstance', () => {
        const requirementId = 'focus-indicator';
        const expectedDescription = 'some description';
        const someInstanceId = 'some instance id';
        const initialState = getDefaultState();
        const finalState = getDefaultState();
        finalState.failureInstanceState = {
            selectedInstanceId: someInstanceId,
            selectedRequirementId: requirementId,
            isPanelOpen: true,
            description: expectedDescription,
            actionType: CapturedInstanceActionType.EDIT,
        };
        const payload: EditExistingFailureInstancePayload = {
            instanceId: someInstanceId,
            requirementId,
            description: expectedDescription,
        };
        createStoreForTabStopsViewActions('editExistingFailureInstance')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    function getDefaultState(): TabStopsViewStoreData {
        return createStoreWithNullParams(TabStopsViewStore).getDefaultState();
    }

    function createStoreForTabStopsViewActions(
        actionName: keyof TabStopsViewActions,
    ): StoreTester<TabStopsViewStoreData, TabStopsViewActions> {
        const factory = (actions: TabStopsViewActions) => new TabStopsViewStore(actions);

        return new StoreTester(TabStopsViewActions, actionName, factory);
    }
});
