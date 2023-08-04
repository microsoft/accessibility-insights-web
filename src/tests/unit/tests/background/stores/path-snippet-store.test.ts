// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PathSnippetActions } from 'background/actions/path-snippet-actions';
import { PathSnippetStore } from 'background/stores/path-snippet-store';
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
        expect(defaultState.snippet).toEqual(null);
    });

    test('on getCurrentState', async () => {
        const initialState = getDefaultState();
        const finalState = getDefaultState();

        const storeTester = createStoreForPathSnippetActions('getCurrentState');
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on addPath', async () => {
        const initialState = getDefaultState();
        const payload = 'new path';
        const finalState = getDefaultState();
        finalState.path = payload;

        const storeTester = createStoreForPathSnippetActions('onAddPath').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on addSnippet', async () => {
        const initialState = getDefaultState();
        const payload = 'new snippet';
        const finalState = getDefaultState();
        finalState.snippet = payload;

        const storeTester =
            createStoreForPathSnippetActions('onAddSnippet').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on clearState', async () => {
        const initialState = {
            path: 'test path',
            snippet: 'test snippet',
        };
        const finalState = getDefaultState();

        const storeTester = createStoreForPathSnippetActions('onClearData').withActionParam(null);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    function getDefaultState(): PathSnippetStoreData {
        return createStoreWithNullParams(PathSnippetStore).getDefaultState();
    }

    function createStoreForPathSnippetActions(
        actionName: keyof PathSnippetActions,
    ): StoreTester<PathSnippetStoreData, PathSnippetActions> {
        const factory = (actions: PathSnippetActions) =>
            new PathSnippetStore(actions, null, null, null, null);
        return new StoreTester(PathSnippetActions, actionName, factory);
    }
});
