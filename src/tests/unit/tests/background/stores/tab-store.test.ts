// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabActions } from '../../../../../background/actions/tab-actions';
import { VisualizationActions } from '../../../../../background/actions/visualization-actions';
import { TabStore } from '../../../../../background/stores/tab-store';
import { ITab } from '../../../../../common/itab';
import { StoreNames } from '../../../../../common/stores/store-names';
import { ITabStoreData } from '../../../../../common/types/store-data/itab-store-data';
import { createStoreWithNullParams, StoreTester } from '../../../common/store-tester';
import { TabStoreDataBuilder } from '../../../common/tab-store-data-builder';

describe('TabStoreTest', () => {
    test('constructor, no side effects', () => {
        const testObject = createStoreWithNullParams(TabStore);
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(TabStore);
        expect(testObject.getId()).toBe(StoreNames[StoreNames.TabStore]);
    });

    test('onTabUpdate', () => {
        const initialState = new TabStoreDataBuilder().build();

        const payload: ITab = {
            id: -1,
            title: 'test-title',
            url: 'test-url',
        };

        const expectedState: ITabStoreData = new TabStoreDataBuilder()
            .with('id', payload.id)
            .with('title', payload.title)
            .with('url', payload.url)
            .build();

        createStoreTesterForTabActions('tabUpdate')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onGetCurrentState', () => {
        const initialState = new TabStoreDataBuilder().build();
        const expectedState = new TabStoreDataBuilder().build();

        createStoreTesterForTabActions('getCurrentState').testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onTabRemove', () => {
        const initialState: ITabStoreData = new TabStoreDataBuilder().build();

        const expectedState: ITabStoreData = new TabStoreDataBuilder().with('isClosed', true).build();

        createStoreTesterForTabActions('tabRemove').testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onTabChange', () => {
        const initialState: ITabStoreData = new TabStoreDataBuilder()
            .with('url', 'url 1')
            .with('title', 'title 1')
            .build();

        const payload: ITab = {
            title: 'title 2',
            url: 'url 2',
        };

        const finalState: ITabStoreData = new TabStoreDataBuilder()
            .with('url', payload.url)
            .with('title', payload.title)
            .with('isChanged', true)
            .build();

        createStoreTesterForTabActions('tabChange')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onVisibilityChange, hidden is true', () => {
        const initialState: ITabStoreData = new TabStoreDataBuilder().build();

        const payload = true;
        const finalState: ITabStoreData = new TabStoreDataBuilder().with('isPageHidden', payload).build();

        createStoreTesterForTabActions('tabVisibilityChange')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onVisibilityChange, hidden is false', () => {
        const initialState: ITabStoreData = new TabStoreDataBuilder().build();

        const finalState: ITabStoreData = new TabStoreDataBuilder().build();

        const payload = false;

        createStoreTesterForTabActions('tabVisibilityChange')
            .withActionParam(payload)
            .testListenerToNeverBeCalled(initialState, finalState);
    });

    test('onEnableVisualization, state.isChanged is true', () => {
        const initialState: ITabStoreData = new TabStoreDataBuilder().with('isChanged', true).build();

        const finalState: ITabStoreData = new TabStoreDataBuilder().build();

        createStoreTesterForVisualizationActions('enableVisualization').testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on enableVisualization, state.isChanged is false', () => {
        const initialState = new TabStoreDataBuilder().build();

        const finalState = new TabStoreDataBuilder().build();

        createStoreTesterForVisualizationActions('enableVisualization').testListenerToNeverBeCalled(initialState, finalState);
    });

    test('on updateSelectedPivotChild, state.isChanged is true', () => {
        const initialState = new TabStoreDataBuilder().with('isChanged', true).build();

        const finalState = new TabStoreDataBuilder().build();

        createStoreTesterForVisualizationActions('updateSelectedPivotChild').testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on updateSelectedPivotChild, state.isChanged is false', () => {
        const initialState = new TabStoreDataBuilder().build();

        const finalState = new TabStoreDataBuilder().build();

        createStoreTesterForVisualizationActions('updateSelectedPivotChild').testListenerToNeverBeCalled(initialState, finalState);
    });

    test('on updateSelectedPivot, state.isChanged is true', () => {
        const initialState: ITabStoreData = new TabStoreDataBuilder().with('isChanged', true).build();

        const finalState: ITabStoreData = new TabStoreDataBuilder().build();

        createStoreTesterForVisualizationActions('updateSelectedPivot').testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on updateSelectedPivot, state.isChange is false', () => {
        const initialState: ITabStoreData = new TabStoreDataBuilder().build();

        const finalState: ITabStoreData = new TabStoreDataBuilder().build();

        createStoreTesterForVisualizationActions('updateSelectedPivot').testListenerToNeverBeCalled(initialState, finalState);
    });

    function createStoreTesterForTabActions(actionName: keyof TabActions) {
        const factory = (actions: TabActions) => new TabStore(actions, new VisualizationActions());
        return new StoreTester(TabActions, actionName, factory);
    }

    function createStoreTesterForVisualizationActions(actionName: keyof VisualizationActions) {
        const factory = (actions: VisualizationActions) => new TabStore(new TabActions(), actions);
        return new StoreTester(VisualizationActions, actionName, factory);
    }
});
