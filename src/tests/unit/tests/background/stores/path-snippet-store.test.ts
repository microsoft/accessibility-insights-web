// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PathSnippetActions } from '../../../../../background/actions/path-snippet-actions';
import { PathSnippetStore } from '../../../../../background/stores/path-snippet-store';
import { StoreNames } from '../../../../../common/stores/store-names';
import { PathSnippetStoreData } from '../../../../../common/types/store-data/path-snippet-store-data';
import { createStoreWithNullParams, StoreTester } from '../../../common/store-tester';

describe('PathSnippetStoreTest', () => {
    test('constructor has no side effects', () => {
        const testObject = createStoreWithNullParams(PathSnippetStore);
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(PathSnippetStore);
        expect(testObject.getId()).toEqual(StoreNames[StoreNames.PathSnippetStore]);
    });

    test('check defaultState is empty', () => {
        const defaultState = getDefaultState();

        expect(defaultState.path).toEqual(null);
        expect(defaultState.snippetCondition.snippet).toEqual(null);
        expect(defaultState.snippetCondition.showError).toEqual(false);
    });

    test('on getCurrentState', () => {
        const initialState = getDefaultState();
        const finalState = getDefaultState();

        createStoreForPathSnippetActions('getCurrentState').testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on addPath', () => {
        const initialState = getDefaultState();
        const payload = 'new path';
        const finalState = getDefaultState();
        finalState.path = payload;

        createStoreForPathSnippetActions('onAddPath')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on addSnippet', () => {
        const newSnippet = 'new snippet';
        const error = false;
        const initialState = getDefaultState();
        const payload = { snippet: newSnippet, showError: error };
        const finalState = getDefaultState();
        finalState.snippetCondition = payload;

        createStoreForPathSnippetActions('onAddSnippet')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on clearState', () => {
        const initialState = {
            path: 'test path',
            snippetCondition: { snippet: 'test snippet', showError: false },
        };
        const finalState = getDefaultState();

        createStoreForPathSnippetActions('onClearData')
            .withActionParam(null)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    function getDefaultState(): PathSnippetStoreData {
        return createStoreWithNullParams(PathSnippetStore).getDefaultState();
    }

    function createStoreForPathSnippetActions(actionName: keyof PathSnippetActions): StoreTester<PathSnippetStoreData, PathSnippetActions> {
        const factory = (actions: PathSnippetActions) => new PathSnippetStore(actions);
        return new StoreTester(PathSnippetActions, actionName, factory);
    }
});
