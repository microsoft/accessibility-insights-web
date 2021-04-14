// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ContentActions } from 'background/actions/content-actions';
import { DetailsViewActions } from 'background/actions/details-view-actions';
import { SidePanelActions } from 'background/actions/side-panel-actions';
import { DetailsViewStore } from 'background/stores/details-view-store';
import { StoreNames } from 'common/stores/store-names';
import { DetailsViewStoreData } from 'common/types/store-data/details-view-store-data';
import { DetailsViewStoreDataBuilder } from '../../../common/details-view-store-data-builder';
import { StoreTester } from '../../../common/store-tester';

describe('DetailsViewStoreTest', () => {
    test('getId', () => {
        const testObject = new DetailsViewStore(null, null, null);
        expect(testObject.getId()).toBe(StoreNames[StoreNames.DetailsViewStore]);
    });

    test('onSetSelectedDetailsViewRightContentPanel', () => {
        const initialState = new DetailsViewStoreDataBuilder()
            .withDetailsViewRightContentPanel('Overview')
            .build();

        const expectedState = new DetailsViewStoreDataBuilder()
            .withDetailsViewRightContentPanel('TestView')
            .build();

        createStoreTesterForDetailsViewActions('setSelectedDetailsViewRightContentPanel')
            .withActionParam('TestView')
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onOpenPreviewFeatures', () => {
        const initialState = new DetailsViewStoreDataBuilder()
            .withPreviewFeaturesOpen(false)
            .build();

        const expectedState = new DetailsViewStoreDataBuilder()
            .withPreviewFeaturesOpen(true)
            .build();

        createStoreTesterForSidePanelActions('openSidePanel')
            .withActionParam('PreviewFeatures')
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onClosePreviewFeatures', () => {
        const initialState = new DetailsViewStoreDataBuilder()
            .withPreviewFeaturesOpen(true)
            .build();

        const expectedState = new DetailsViewStoreDataBuilder()
            .withPreviewFeaturesOpen(false)
            .build();

        createStoreTesterForSidePanelActions('closeSidePanel')
            .withActionParam('PreviewFeatures')
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onOpenScoping', () => {
        const initialState = new DetailsViewStoreDataBuilder().withScopingOpen(false).build();

        const expectedState = new DetailsViewStoreDataBuilder().withScopingOpen(true).build();

        createStoreTesterForSidePanelActions('openSidePanel')
            .withActionParam('Scoping')
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onCloseScoping', () => {
        const initialState = new DetailsViewStoreDataBuilder().withScopingOpen(true).build();

        const expectedState = new DetailsViewStoreDataBuilder().withScopingOpen(false).build();

        createStoreTesterForSidePanelActions('closeSidePanel')
            .withActionParam('Scoping')
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onCloseSettings', () => {
        const initialState = new DetailsViewStoreDataBuilder().withSettingPanelState(true).build();

        const expectedState = new DetailsViewStoreDataBuilder()
            .withSettingPanelState(false)
            .build();

        createStoreTesterForSidePanelActions('closeSidePanel')
            .withActionParam('Settings')
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onOpenContent', () => {
        const initialState = new DetailsViewStoreDataBuilder().withContentOpen(false).build();

        const expectedState = new DetailsViewStoreDataBuilder()
            .withContentOpen(true, 'content/path', 'content title')
            .build();

        createStoreTesterForContentActions('openContentPanel')
            .withActionParam({ contentPath: 'content/path', contentTitle: 'content title' })
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onCloseContent', () => {
        const initialState = new DetailsViewStoreDataBuilder()
            .withContentOpen(true, 'content/path', 'content title')
            .build();

        const expectedState = new DetailsViewStoreDataBuilder().withContentOpen(false).build();

        createStoreTesterForContentActions('closeContentPanel').testListenerToBeCalledOnce(
            initialState,
            expectedState,
        );
    });

    test('onOpenSidePanel', () => {
        const initialState = new DetailsViewStoreDataBuilder().withSettingPanelState(false).build();

        const expectedState = new DetailsViewStoreDataBuilder().withSettingPanelState(true).build();

        createStoreTesterForSidePanelActions('openSidePanel')
            .withActionParam('Settings')
            .testListenerToBeCalledOnce(initialState, expectedState);
    });

    function createStoreTesterForContentActions(
        actionName: keyof ContentActions,
    ): StoreTester<DetailsViewStoreData, ContentActions> {
        const factory = (actions: ContentActions) =>
            new DetailsViewStore(actions, new DetailsViewActions(), new SidePanelActions());

        return new StoreTester(ContentActions, actionName, factory);
    }

    function createStoreTesterForDetailsViewActions(
        actionName: keyof DetailsViewActions,
    ): StoreTester<DetailsViewStoreData, DetailsViewActions> {
        const factory = (actions: DetailsViewActions) =>
            new DetailsViewStore(new ContentActions(), actions, new SidePanelActions());

        return new StoreTester(DetailsViewActions, actionName, factory);
    }

    function createStoreTesterForSidePanelActions(
        actionName: keyof SidePanelActions,
    ): StoreTester<DetailsViewStoreData, SidePanelActions> {
        const factory = (actions: SidePanelActions) =>
            new DetailsViewStore(new ContentActions(), new DetailsViewActions(), actions);

        return new StoreTester(SidePanelActions, actionName, factory);
    }
});
