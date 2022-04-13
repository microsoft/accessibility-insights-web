// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScopingActions, ScopingPayload } from 'background/actions/scoping-actions';
import { ScopingInputTypes } from 'background/scoping-input-types';
import { ScopingStore } from 'background/stores/global/scoping-store';
import { StoreNames } from '../../../../../../common/stores/store-names';
import {
    ScopingStoreData,
    SingleElementSelector,
} from '../../../../../../common/types/store-data/scoping-store-data';
import { createStoreWithNullParams, StoreTester } from '../../../../common/store-tester';

describe('ScopingStoreTest', () => {
    test('constructor  no side effects', () => {
        const testObject = createStoreWithNullParams(ScopingStore);
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(ScopingStore);
        expect(testObject.getId()).toEqual(StoreNames[StoreNames.ScopingPanelStateStore]);
    });

    test('test defaultState has empty selectors arrays', () => {
        const defaultState = getDefaultState();
        const emptyArray: SingleElementSelector = [];

        Object.keys(ScopingInputTypes).forEach(inputType => {
            expect(defaultState.selectors[inputType]).toEqual(emptyArray);
        });
    });

    test('on getCurrentState', () => {
        const initialState = getDefaultState();
        const finalState = getDefaultState();

        createStoreForScopingActions('getCurrentState').testListenerToBeCalledOnce(
            initialState,
            finalState,
        );
    });

    test('on addSelector', () => {
        const initialState = getDefaultState();
        const payload: ScopingPayload = {
            inputType: 'include',
            selector: ['iframe', 'selector'],
        };
        const finalState = getDefaultState();
        finalState.selectors[ScopingInputTypes.include] = [payload.selector];

        createStoreForScopingActions('addSelector')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on addSelector prevent duplicate selector', () => {
        const payload: ScopingPayload = {
            inputType: 'include',
            selector: ['iframe', 'selector'],
        };
        const initialState = getDefaultState();
        initialState.selectors[ScopingInputTypes.include] = [payload.selector];
        const finalState = getDefaultState();
        finalState.selectors[ScopingInputTypes.include] = [payload.selector];

        createStoreForScopingActions('addSelector')
            .withActionParam(payload)
            .testListenerToNeverBeCalled(initialState, finalState);
    });

    test('on deleteSelector with an actual selector', () => {
        const initialState = getDefaultState();
        const payload: ScopingPayload = {
            inputType: ScopingInputTypes.include,
            selector: ['iframe', 'selector'],
        };
        initialState.selectors[ScopingInputTypes.include] = [payload.selector];
        const finalState = getDefaultState();

        createStoreForScopingActions('deleteSelector')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on deleteSelector prevent deletion of non-existent selector', () => {
        const initialState = getDefaultState();
        const actualSelector = ['iframe', 'selector'];
        const payload: ScopingPayload = {
            inputType: ScopingInputTypes.include,
            selector: ['selector'],
        };
        initialState.selectors[ScopingInputTypes.include] = [actualSelector];
        const finalState = getDefaultState();
        finalState.selectors[ScopingInputTypes.include] = [actualSelector];

        createStoreForScopingActions('deleteSelector')
            .withActionParam(payload)
            .testListenerToNeverBeCalled(initialState, finalState);
    });

    function getDefaultState(): ScopingStoreData {
        return createStoreWithNullParams(ScopingStore).getDefaultState();
    }

    function createStoreForScopingActions(
        actionName: keyof ScopingActions,
    ): StoreTester<ScopingStoreData, ScopingActions> {
        const factory = (actions: ScopingActions) => new ScopingStore(actions, null, null, null);

        return new StoreTester(ScopingActions, actionName, factory);
    }
});
