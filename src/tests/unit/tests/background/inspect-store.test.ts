// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InspectActions, InspectPayload } from 'background/actions/inspect-actions';
import { TabActions } from 'background/actions/tab-actions';
import { InspectStore } from 'background/stores/inspect-store';
import { InspectMode } from 'common/types/store-data/inspect-modes';
import { StoreNames } from '../../../../common/stores/store-names';
import { InspectStoreData } from '../../../../common/types/store-data/inspect-store-data';
import { createStoreWithNullParams, StoreTester } from '../../common/store-tester';

describe('InspectStoreTest', () => {
    test('constructor  no side effects', () => {
        const testObject = createStoreWithNullParams(InspectStore);
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(InspectStore);
        expect(testObject.getId()).toEqual(StoreNames[StoreNames.InspectStore]);
    });

    test('check defaultState is off', () => {
        const defaultState = getDefaultState();
        expect(defaultState.inspectMode).toEqual(InspectMode.off);
    });

    test('on getCurrentState', async () => {
        const initialState = getDefaultState();
        const finalState = getDefaultState();

        const storeTester = createStoreForInspectActions('getCurrentState');
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on changeMode', async () => {
        const initialState = getDefaultState();
        const payload: InspectPayload = {
            inspectMode: InspectMode.scopingAddInclude,
        };

        const finalState = getDefaultState();
        finalState.inspectMode = payload.inspectMode;
        const storeTester =
            createStoreForInspectActions('changeInspectMode').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on setHoveredOverSelector', async () => {
        const initialState = getDefaultState();
        const payload: string[] = ['some selector'];
        const finalState = getDefaultState();
        finalState.hoveredOverSelector = payload;
        const storeTester =
            createStoreForInspectActions('setHoveredOverSelector').withActionParam(payload);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on existingTabUpdated', async () => {
        const initialState = getDefaultState();
        initialState.hoveredOverSelector = ['some selector'];
        initialState.inspectMode = InspectMode.scopingAddInclude;
        const finalState = getDefaultState();
        const storeTester = createStoreForTabActions('existingTabUpdated').withActionParam(null);
        await storeTester.testListenerToBeCalledOnce(initialState, finalState);
    });

    function getDefaultState(): InspectStoreData {
        return createStoreWithNullParams(InspectStore).getDefaultState();
    }

    function createStoreForInspectActions(
        actionName: keyof InspectActions,
    ): StoreTester<InspectStoreData, InspectActions> {
        const tabActions = new TabActions();
        const factory = (actions: InspectActions) =>
            new InspectStore(actions, tabActions, null, null, null, null);

        return new StoreTester(InspectActions, actionName, factory);
    }

    function createStoreForTabActions(
        actionName: keyof TabActions,
    ): StoreTester<InspectStoreData, TabActions> {
        const factory = (actions: TabActions) =>
            new InspectStore(new InspectActions(), actions, null, null, null, null);
        return new StoreTester(TabActions, actionName, factory);
    }
});
