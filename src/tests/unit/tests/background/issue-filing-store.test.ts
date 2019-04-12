// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IssueFilingActions } from '../../../../background/actions/issue-filing-actions';
import { StoreNames } from '../../../../common/stores/store-names';
import { CreateIssueDetailsTextData } from '../../../../common/types/create-issue-details-text-data';
import { createStoreWithNullParams, StoreTester } from '../../common/store-tester';
import { OpenIssueFilingSettingsDialogPayload } from './../../../../background/actions/action-payloads';
import { IssueFilingStore } from './../../../../background/stores/issue-filing-store';
import { IssueFilingStoreData } from './../../../../background/stores/issue-filing-store-data';

describe('IssueFilingStoreTest', () => {
    test('constructor  no side effects', () => {
        const testObject = createStoreWithNullParams(IssueFilingStore);
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(IssueFilingStore);
        expect(testObject.getId()).toEqual(StoreNames[StoreNames.IssueFilingStore]);
    });

    test('check defaultState is off', () => {
        const defaultState = getDefaultState();
        expect(defaultState.isIssueFilingSettingsDialogOpen).toEqual(false);
        expect(defaultState.issueDetailsTextData).toBeNull();
    });

    test('on getCurrentState', () => {
        const initialState = getDefaultState();
        const finalState = getDefaultState();

        createStoreForIssueFilingActions('getCurrentState').testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onOpenIssueFilingSettingsDialog', () => {
        const initialState = getDefaultState();
        const payload: OpenIssueFilingSettingsDialogPayload = {
            issueDetailsTextData: {
                pageTitle: 'title',
            } as CreateIssueDetailsTextData,
        };

        const finalState = getDefaultState();
        finalState.isIssueFilingSettingsDialogOpen = true;
        finalState.issueDetailsTextData = payload.issueDetailsTextData;
        createStoreForIssueFilingActions('openIssueFilingSettingsDialog')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onCloseIssueFilingSettingsDialog', () => {
        const initialState = getDefaultState();

        const finalState = getDefaultState();
        finalState.isIssueFilingSettingsDialogOpen = false;
        createStoreForIssueFilingActions('closeIssueFilingSettingsDialog')
            .withActionParam(null)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    function getDefaultState(): IssueFilingStoreData {
        return createStoreWithNullParams(IssueFilingStore).getDefaultState();
    }

    function createStoreForIssueFilingActions(actionName: keyof IssueFilingActions): StoreTester<IssueFilingStoreData, IssueFilingActions> {
        const factory = (actions: IssueFilingActions) => new IssueFilingStore(actions);

        return new StoreTester(IssueFilingActions, actionName, factory);
    }
});
