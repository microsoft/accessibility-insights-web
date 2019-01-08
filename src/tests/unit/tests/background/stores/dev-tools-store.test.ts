// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DevToolActions } from '../../../../../background/actions/dev-tools-actions';
import { DevToolStore } from '../../../../../background/stores/dev-tools-store';
import { StoreNames } from '../../../../../common/stores/store-names';
import { createStoreWithNullParams, StoreTester } from '../../../Common/store-tester';

describe('DevToolsStoreTest', () => {
    test('constructor, no side effect', () => {
        const testObject = createStoreWithNullParams(DevToolStore);
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(DevToolStore);
        expect(testObject.getId()).toBe(StoreNames[StoreNames.DevToolsStore]);
    });

    test('on getCurrentState', () => {
        const initialState = getDefaultState();
        const expectedState = getDefaultState();

        createStoreTesterForDevToolsActions('getCurrentState')
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('on setDevToolState, isOpen value change', () => {
        const initialState = getDefaultState();

        const payload = true;
        const expectedState = getDefaultState();
        expectedState.isOpen = payload;
        expectedState.frameUrl = null;
        expectedState.inspectElement = null;

        createStoreTesterForDevToolsActions('setDevToolState')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('on setDevToolState, isOpen value is the same', () => {
        const initialState = getDefaultState();
        const expectedState = getDefaultState();

        const payload = false;

        createStoreTesterForDevToolsActions('setDevToolState')
            .withActionParam(payload)
            .testListenerToNeverBeCalled(initialState, expectedState);
    });

    test('on setInspectElement', () => {
        const initialState = getDefaultState();

        const payload = ['#frame1', '#elem1'];

        const exepctedState = getDefaultState();
        exepctedState.inspectElement = payload;
        exepctedState.frameUrl = null;

        createStoreTesterForDevToolsActions('setInspectElement')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, exepctedState);
    });

    test('on setFrameUrl', () => {
        const initialState = getDefaultState();

        const payload = 'https://test-url';

        const expectedState = getDefaultState();
        expectedState.frameUrl = payload;

        createStoreTesterForDevToolsActions('setFrameUrl')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    function getDefaultState() {
        return new DevToolStore(null).getDefaultState();
    }

    function createStoreTesterForDevToolsActions(actionName: keyof DevToolActions) {
        const factory = (actions: DevToolActions) => new DevToolStore(actions);

        return new StoreTester(DevToolActions, actionName, factory);
    }
});
