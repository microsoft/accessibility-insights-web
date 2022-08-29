// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CardsViewActions } from 'common/components/cards/cards-view-actions';
import { CardsViewStore } from 'common/components/cards/cards-view-store';
import { CardsViewStoreData } from 'common/components/cards/cards-view-store-data';
import { StoreNames } from 'common/stores/store-names';
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
        const initialState = getDefaultState();
        const finalState = getDefaultState();
        finalState.isIssueFilingSettingsDialogOpen = true;

        const storeTester = createStoreForCardsViewActions(
            'openIssueFilingSettingsDialog',
        ).withActionParam(null);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on closeIssueFilingSettingsDialog', async () => {
        const initialState = getDefaultState();
        initialState.isIssueFilingSettingsDialogOpen = true;
        const finalState = getDefaultState();

        const storeTester = createStoreForCardsViewActions(
            'closeIssueFilingSettingsDialog',
        ).withActionParam(null);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
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
