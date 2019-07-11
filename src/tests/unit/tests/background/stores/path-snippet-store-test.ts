// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { PathSnippetActions } from '../../../../../background/actions/path-snippet-actions';
import { PathSnippetStore } from '../../../../../background/stores/path-snippet-store';
import { StoreNames } from '../../../../../common/stores/store-names';
import { PathSnippetData } from '../../../../../common/types/store-data/path-snippet-data';
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

        expect(defaultState.path).toEqual('');
        expect(defaultState.snippet).toEqual('');
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

    function getDefaultState(): PathSnippetData {
        return createStoreWithNullParams(PathSnippetStore).getDefaultState();
    }

    function createStoreForPathSnippetActions(actionName: keyof PathSnippetActions): StoreTester<PathSnippetData, PathSnippetActions> {
        const factory = (actions: PathSnippetActions) => new PathSnippetStore(actions);
        return new StoreTester(PathSnippetActions, actionName, factory);
    }
});
