// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardsViewActions } from 'common/components/cards/cards-view-actions';
import { CardsViewStore } from 'common/components/cards/cards-view-store';
import { CardsViewStoreData } from 'common/components/cards/cards-view-store-data';
import { StoreNames } from 'common/stores/store-names';
import { CreateIssueDetailsTextData } from 'common/types/create-issue-details-text-data';
import { createStoreWithNullParams, StoreTester } from 'tests/unit/common/store-tester';

describe(CardsViewStore, () => {
    test('constructor  no side effects', () => {
        const testObject = createStoreWithNullParams(CardsViewStore);
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(CardsViewStore);
        expect(testObject.getId()).toEqual(StoreNames[StoreNames.CardsViewStore]);
    });

    test('getDefaultState', () => {
        const testObject = createStoreWithNullParams(CardsViewStore);
        const expected: CardsViewStoreData = {
            isIssueFilingSettingsDialogOpen: false,
        };
        expect(testObject.getDefaultState()).toEqual(expected);
    });

    test('on openIssueFilingSettingsDialog', async () => {
        const onDialogDismissedCallback = () => null;
        const selectedIssueData = { snippet: 'test snippet' } as CreateIssueDetailsTextData;

        const initialState = getDefaultState();

        const finalState = getDefaultState();
        finalState.isIssueFilingSettingsDialogOpen = true;
        finalState.onIssueFilingSettingsClosedCallback = onDialogDismissedCallback;
        finalState.selectedIssueData = selectedIssueData;

        const storeTester = createStoreForCardsViewActions(
            'openIssueFilingSettingsDialog',
        ).withActionParam({
            onDialogDismissedCallback,
            selectedIssueData,
        });
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on closeIssueFilingSettingsDialog', async () => {
        const onDismissDialogCallback = jest.fn();
        const selectedIssueData = { snippet: 'test snippet' } as CreateIssueDetailsTextData;

        const initialState = getDefaultState();
        initialState.isIssueFilingSettingsDialogOpen = true;
        initialState.onIssueFilingSettingsClosedCallback = onDismissDialogCallback;
        initialState.selectedIssueData = selectedIssueData;

        const finalState = {
            ...initialState,
            isIssueFilingSettingsDialogOpen: false,
        };

        const storeTester = createStoreForCardsViewActions(
            'closeIssueFilingSettingsDialog',
        ).withActionParam(null);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);

        // The UI needs to update before the callback is called, so it cannot
        // be called from the store. Instead, it's passed as a prop to the
        // fluentui dialog component, which calls it at the appropriate time.
        expect(onDismissDialogCallback).toBeCalledTimes(0);
    });

    function getDefaultState(): CardsViewStoreData {
        return createStoreWithNullParams(CardsViewStore).getDefaultState();
    }

    function createStoreForCardsViewActions(
        actionName: keyof CardsViewActions,
    ): StoreTester<CardsViewStoreData, CardsViewActions> {
        const factory = (actions: CardsViewActions) => new CardsViewStore(actions);

        return new StoreTester(CardsViewActions, actionName, factory);
    }
});
