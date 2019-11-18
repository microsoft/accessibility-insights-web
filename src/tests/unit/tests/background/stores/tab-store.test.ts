// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabActions } from 'background/actions/tab-actions';
import { VisualizationActions } from 'background/actions/visualization-actions';
import { TabStore } from 'background/stores/tab-store';
import { Tab } from '../../../../../common/itab';
import { StoreNames } from '../../../../../common/stores/store-names';
import { TabStoreData } from '../../../../../common/types/store-data/tab-store-data';
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

    test('onNewTabCreated', () => {
        const initialState = new TabStoreDataBuilder().build();

        const payload: Tab = {
            id: -1,
            title: 'test-title',
            url: 'test-url',
        };

        const expectedState: TabStoreData = new TabStoreDataBuilder()
            .with('id', payload.id)
            .with('title', payload.title)
            .with('url', payload.url)
            .build();

        createStoreTesterForTabActions('newTabCreated')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onGetCurrentState', () => {
        const initialState = new TabStoreDataBuilder().build();
        const expectedState = new TabStoreDataBuilder().build();

        createStoreTesterForTabActions('getCurrentState').testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onTabRemove', () => {
        const initialState: TabStoreData = new TabStoreDataBuilder().build();

        const expectedState: TabStoreData = new TabStoreDataBuilder().with('isClosed', true).build();

        createStoreTesterForTabActions('tabRemove').testListenerToBeCalledOnce(initialState, expectedState);
    });

    test.each`
        payloadUrl                               | originalIsClosed | expectedIsClosed
        ${'https://original-host/original-path'} | ${false}         | ${false}
        ${'https://original-host/new-path'}      | ${false}         | ${false}
        ${'https://new-host/new-path'}           | ${false}         | ${true}
        ${'https://original-host/original-path'} | ${true}          | ${true}
        ${'https://original-host/new-path'}      | ${true}          | ${true}
        ${'https://new-host/new-path'}           | ${true}          | ${true}
    `(
        'onExistingTabUpdated from isClosed=$originalIsClosed with payload url $payloadUrl should result in isClosed=$expectedIsClosed',
        ({ payloadUrl, originalIsClosed, expectedIsClosed }) => {
            const initialState: TabStoreData = new TabStoreDataBuilder()
                .with('url', 'https://original-host/original-path')
                .with('title', 'title 1')
                .with('isClosed', originalIsClosed)
                .build();

            const payload: Tab = {
                title: 'title 2',
                url: payloadUrl,
            };

            const expectedState: TabStoreData = new TabStoreDataBuilder()
                .with('url', payload.url)
                .with('title', payload.title)
                .with('isChanged', true)
                .with('isClosed', expectedIsClosed)
                .build();

            createStoreTesterForTabActions('existingTabUpdated')
                .withActionParam(payload)
                .testListenerToBeCalledOnce(initialState, expectedState);
        },
    );

    test('onVisibilityChange, hidden is true', () => {
        const initialState: TabStoreData = new TabStoreDataBuilder().build();

        const payload = true;
        const finalState: TabStoreData = new TabStoreDataBuilder().with('isPageHidden', payload).build();

        createStoreTesterForTabActions('tabVisibilityChange')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, finalState);
    });

    test('onVisibilityChange, hidden is false', () => {
        const initialState: TabStoreData = new TabStoreDataBuilder().build();

        const finalState: TabStoreData = new TabStoreDataBuilder().build();

        const payload = false;

        createStoreTesterForTabActions('tabVisibilityChange')
            .withActionParam(payload)
            .testListenerToNeverBeCalled(initialState, finalState);
    });

    test('onEnableVisualization, state.isChanged is true', () => {
        const initialState: TabStoreData = new TabStoreDataBuilder().with('isChanged', true).build();

        const finalState: TabStoreData = new TabStoreDataBuilder().build();

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
        const initialState: TabStoreData = new TabStoreDataBuilder().with('isChanged', true).build();

        const finalState: TabStoreData = new TabStoreDataBuilder().build();

        createStoreTesterForVisualizationActions('updateSelectedPivot').testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on updateSelectedPivot, state.isChange is false', () => {
        const initialState: TabStoreData = new TabStoreDataBuilder().build();

        const finalState: TabStoreData = new TabStoreDataBuilder().build();

        createStoreTesterForVisualizationActions('updateSelectedPivot').testListenerToNeverBeCalled(initialState, finalState);
    });

    function createStoreTesterForTabActions(actionName: keyof TabActions): StoreTester<TabStoreData, TabActions> {
        const factory = (actions: TabActions) => new TabStore(actions, new VisualizationActions());
        return new StoreTester(TabActions, actionName, factory);
    }

    function createStoreTesterForVisualizationActions(
        actionName: keyof VisualizationActions,
    ): StoreTester<TabStoreData, VisualizationActions> {
        const factory = (actions: VisualizationActions) => new TabStore(new TabActions(), actions);
        return new StoreTester(VisualizationActions, actionName, factory);
    }
});
