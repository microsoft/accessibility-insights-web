// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabActions } from 'background/actions/tab-actions';
import { VisualizationActions } from 'background/actions/visualization-actions';
import { TabStore } from 'background/stores/tab-store';
import { Tab } from 'common/types/store-data/itab';
import { UrlParser } from 'common/url-parser';
import { IMock, Mock } from 'typemoq';
import { StoreNames } from '../../../../../common/stores/store-names';
import { TabStoreData } from '../../../../../common/types/store-data/tab-store-data';
import { createStoreWithNullParams, StoreTester } from '../../../common/store-tester';
import { TabStoreDataBuilder } from '../../../common/tab-store-data-builder';

describe('TabStoreTest', () => {
    let mockUrlParser: IMock<UrlParser>;
    beforeEach(() => {
        mockUrlParser = Mock.ofType<UrlParser>();
    });

    test('constructor, no side effects', () => {
        const testObject = createStoreWithNullParams(TabStore);
        expect(testObject).toBeDefined();
    });

    test('getId', () => {
        const testObject = createStoreWithNullParams(TabStore);
        expect(testObject.getId()).toBe(StoreNames[StoreNames.TabStore]);
    });

    test('onNewTabCreated with empty initial state', () => {
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
            .with('isClosed', false)
            .with('isChanged', false)
            .build();

        createStoreTesterForTabActions('newTabCreated')
            .withActionParam(payload)
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test.each`
        differentOrigin | differentId | originalIsClosed | originalIsChanged
        ${false}        | ${true}     | ${false}         | ${false}
        ${false}        | ${false}    | ${false}         | ${false}
        ${true}         | ${false}    | ${false}         | ${false}
        ${false}        | ${false}    | ${false}         | ${true}
        ${false}        | ${false}    | ${true}          | ${true}
    `(
        'onNewTabCreated for differentOrigin=$differentOrigin, differentId=$differentId, re-initializes from scratch ' +
            'regardless of existing initial state isClosed=$originalIsClosed, isChanged=$originalIsChanged',
        ({ differentOrigin, differentId, originalIsClosed, originalIsChanged }) => {
            const originalId = 1;
            const originalUrl = 'https://original-host/original-path';
            const newUrl = differentOrigin
                ? 'https://new-host/new-path'
                : 'https://original-host/new-path';
            const initialState = new TabStoreDataBuilder()
                .with('id', originalId)
                .with('url', originalUrl)
                .with('title', 'title 1')
                .with('isClosed', originalIsClosed)
                .with('isChanged', originalIsChanged)
                .build();

            const payload: Tab = {
                id: differentId ? originalId + 1 : originalId,
                title: 'test-title',
                url: newUrl,
            };

            mockUrlParser
                .setup(m => m.areURLsSameOrigin(originalUrl, newUrl))
                .returns(() => !differentOrigin);

            const expectedState: TabStoreData = new TabStoreDataBuilder()
                .with('id', payload.id)
                .with('title', payload.title)
                .with('url', payload.url)
                .with('isClosed', false)
                .with('isChanged', false)
                .build();

            createStoreTesterForTabActions('newTabCreated')
                .withActionParam(payload)
                .testListenerToBeCalledOnce(initialState, expectedState);
        },
    );

    test('onGetCurrentState', () => {
        const initialState = new TabStoreDataBuilder().build();
        const expectedState = new TabStoreDataBuilder().build();

        createStoreTesterForTabActions('getCurrentState').testListenerToBeCalledOnce(
            initialState,
            expectedState,
        );
    });

    test('onTabRemove', () => {
        const initialState: TabStoreData = new TabStoreDataBuilder().build();

        const expectedState: TabStoreData = new TabStoreDataBuilder()
            .with('isClosed', true)
            .build();

        createStoreTesterForTabActions('tabRemove').testListenerToBeCalledOnce(
            initialState,
            expectedState,
        );
    });

    test.each`
        differentOrigin | initialIsOriginChanged | expectedIsOriginChanged
        ${false}        | ${false}               | ${false}
        ${true}         | ${false}               | ${true}
        ${false}        | ${true}                | ${true}
        ${true}         | ${true}                | ${true}
    `(
        'onExistingTabUpdated from isOriginChanged=$initialIsOriginChanged with differentOrigin=$differentOrigin should result in isOriginChanged=$expectedIsOriginChanged',
        ({ differentOrigin, initialIsOriginChanged, expectedIsOriginChanged }) => {
            const originalUrl = 'https://original-host/original-path';
            const newUrl = differentOrigin
                ? 'https://new-host/new-path'
                : 'https://original-host/new-path';
            const initialState: TabStoreData = new TabStoreDataBuilder()
                .with('url', originalUrl)
                .with('title', 'title 1')
                .with('isOriginChanged', initialIsOriginChanged)
                .build();

            const payload: Tab = {
                title: 'title 2',
                url: newUrl,
            };

            mockUrlParser
                .setup(m => m.areURLsSameOrigin(originalUrl, newUrl))
                .returns(() => !differentOrigin);

            const expectedState: TabStoreData = new TabStoreDataBuilder()
                .with('url', payload.url)
                .with('title', payload.title)
                .with('isChanged', true)
                .with('isOriginChanged', expectedIsOriginChanged)
                .build();

            createStoreTesterForTabActions('existingTabUpdated')
                .withActionParam(payload)
                .testListenerToBeCalledOnce(initialState, expectedState);
        },
    );

    test('onVisibilityChange, hidden is true', () => {
        const initialState: TabStoreData = new TabStoreDataBuilder().build();

        const payload = true;
        const finalState: TabStoreData = new TabStoreDataBuilder()
            .with('isPageHidden', payload)
            .build();

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
        const initialState: TabStoreData = new TabStoreDataBuilder()
            .with('isChanged', true)
            .build();

        const finalState: TabStoreData = new TabStoreDataBuilder().build();

        createStoreTesterForVisualizationActions('enableVisualization').testListenerToBeCalledOnce(
            initialState,
            finalState,
        );
    });

    test('on enableVisualization, state.isChanged is false', () => {
        const initialState = new TabStoreDataBuilder().build();

        const finalState = new TabStoreDataBuilder().build();

        createStoreTesterForVisualizationActions('enableVisualization').testListenerToNeverBeCalled(
            initialState,
            finalState,
        );
    });

    test('on updateSelectedPivotChild, state.isChanged is true', () => {
        const initialState = new TabStoreDataBuilder().with('isChanged', true).build();

        const finalState = new TabStoreDataBuilder().build();

        createStoreTesterForVisualizationActions(
            'updateSelectedPivotChild',
        ).testListenerToBeCalledOnce(initialState, finalState);
    });

    test('on updateSelectedPivotChild, state.isChanged is false', () => {
        const initialState = new TabStoreDataBuilder().build();

        const finalState = new TabStoreDataBuilder().build();

        createStoreTesterForVisualizationActions(
            'updateSelectedPivotChild',
        ).testListenerToNeverBeCalled(initialState, finalState);
    });

    test('on updateSelectedPivot, state.isChanged is true', () => {
        const initialState: TabStoreData = new TabStoreDataBuilder()
            .with('isChanged', true)
            .build();

        const finalState: TabStoreData = new TabStoreDataBuilder().build();

        createStoreTesterForVisualizationActions('updateSelectedPivot').testListenerToBeCalledOnce(
            initialState,
            finalState,
        );
    });

    test('on updateSelectedPivot, state.isChange is false', () => {
        const initialState: TabStoreData = new TabStoreDataBuilder().build();

        const finalState: TabStoreData = new TabStoreDataBuilder().build();

        createStoreTesterForVisualizationActions('updateSelectedPivot').testListenerToNeverBeCalled(
            initialState,
            finalState,
        );
    });

    function createStoreTesterForTabActions(
        actionName: keyof TabActions,
    ): StoreTester<TabStoreData, TabActions> {
        const factory = (actions: TabActions) =>
            new TabStore(
                actions,
                new VisualizationActions(),
                null,
                null,
                null,
                null,
                true,
                mockUrlParser.object,
            );
        return new StoreTester(TabActions, actionName, factory);
    }

    function createStoreTesterForVisualizationActions(
        actionName: keyof VisualizationActions,
    ): StoreTester<TabStoreData, VisualizationActions> {
        const factory = (actions: VisualizationActions) =>
            new TabStore(
                new TabActions(),
                actions,
                null,
                null,
                null,
                null,
                true,
                mockUrlParser.object,
            );
        return new StoreTester(VisualizationActions, actionName, factory);
    }
});
