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
        const testObject = new DetailsViewStore(null, null, null, null, null, null, null);
        expect(testObject.getId()).toBe(StoreNames[StoreNames.DetailsViewStore]);
    });

    test('onSetSelectedDetailsViewRightContentPanel', async () => {
        const initialState = new DetailsViewStoreDataBuilder()
            .withDetailsViewRightContentPanel('Overview')
            .build();

        const expectedState = new DetailsViewStoreDataBuilder()
            .withDetailsViewRightContentPanel('TestView')
            .build();

        const storeTester = createStoreTesterForDetailsViewActions(
            'setSelectedDetailsViewRightContentPanel',
        ).withActionParam('TestView');
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onOpenPreviewFeatures', async () => {
        const initialState = new DetailsViewStoreDataBuilder()
            .withPreviewFeaturesOpen(false)
            .build();

        const expectedState = new DetailsViewStoreDataBuilder()
            .withPreviewFeaturesOpen(true)
            .build();

        const storeTester =
            createStoreTesterForSidePanelActions('openSidePanel').withActionParam(
                'PreviewFeatures',
            );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onClosePreviewFeatures', async () => {
        const initialState = new DetailsViewStoreDataBuilder()
            .withPreviewFeaturesOpen(true)
            .build();

        const expectedState = new DetailsViewStoreDataBuilder()
            .withPreviewFeaturesOpen(false)
            .build();

        const storeTester =
            createStoreTesterForSidePanelActions('closeSidePanel').withActionParam(
                'PreviewFeatures',
            );
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onOpenScoping', async () => {
        const initialState = new DetailsViewStoreDataBuilder().withScopingOpen(false).build();

        const expectedState = new DetailsViewStoreDataBuilder().withScopingOpen(true).build();

        const storeTester =
            createStoreTesterForSidePanelActions('openSidePanel').withActionParam('Scoping');
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onCloseScoping', async () => {
        const initialState = new DetailsViewStoreDataBuilder().withScopingOpen(true).build();

        const expectedState = new DetailsViewStoreDataBuilder().withScopingOpen(false).build();

        const storeTester =
            createStoreTesterForSidePanelActions('closeSidePanel').withActionParam('Scoping');
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onCloseSettings', async () => {
        const initialState = new DetailsViewStoreDataBuilder().withSettingPanelState(true).build();

        const expectedState = new DetailsViewStoreDataBuilder()
            .withSettingPanelState(false)
            .build();

        const storeTester =
            createStoreTesterForSidePanelActions('closeSidePanel').withActionParam('Settings');
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onOpenContent', async () => {
        const initialState = new DetailsViewStoreDataBuilder().withContentOpen(false).build();

        const expectedState = new DetailsViewStoreDataBuilder()
            .withContentOpen(true, 'content/path', 'content title')
            .build();

        const storeTester = createStoreTesterForContentActions('openContentPanel').withActionParam({
            contentPath: 'content/path',
            contentTitle: 'content title',
        });
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onCloseContent', async () => {
        const initialState = new DetailsViewStoreDataBuilder()
            .withContentOpen(true, 'content/path', 'content title')
            .build();

        const expectedState = new DetailsViewStoreDataBuilder().withContentOpen(false).build();

        const storeTester = createStoreTesterForContentActions('closeContentPanel');
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onOpenSidePanel', async () => {
        const initialState = new DetailsViewStoreDataBuilder().withSettingPanelState(false).build();

        const expectedState = new DetailsViewStoreDataBuilder().withSettingPanelState(true).build();

        const storeTester =
            createStoreTesterForSidePanelActions('openSidePanel').withActionParam('Settings');
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    function createStoreTesterForContentActions(
        actionName: keyof ContentActions,
    ): StoreTester<DetailsViewStoreData, ContentActions> {
        const factory = (actions: ContentActions) =>
            new DetailsViewStore(
                actions,
                new DetailsViewActions(),
                new SidePanelActions(),
                null,
                null,
                null,
                null,
            );

        return new StoreTester(ContentActions, actionName, factory);
    }

    function createStoreTesterForDetailsViewActions(
        actionName: keyof DetailsViewActions,
    ): StoreTester<DetailsViewStoreData, DetailsViewActions> {
        const factory = (actions: DetailsViewActions) =>
            new DetailsViewStore(
                new ContentActions(),
                actions,
                new SidePanelActions(),
                null,
                null,
                null,
                null,
            );

        return new StoreTester(DetailsViewActions, actionName, factory);
    }

    function createStoreTesterForSidePanelActions(
        actionName: keyof SidePanelActions,
    ): StoreTester<DetailsViewStoreData, SidePanelActions> {
        const factory = (actions: SidePanelActions) =>
            new DetailsViewStore(
                new ContentActions(),
                new DetailsViewActions(),
                actions,
                null,
                null,
                null,
                null,
            );

        return new StoreTester(SidePanelActions, actionName, factory);
    }
});
