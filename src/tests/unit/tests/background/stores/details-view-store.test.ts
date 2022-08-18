// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ContentActions } from 'background/actions/content-actions';
import { DetailsViewActions } from 'background/actions/details-view-actions';
import { DialogActions } from 'background/actions/dialog-actions';
import { SidePanelActions } from 'background/actions/side-panel-actions';
import { DetailsViewStore } from 'background/stores/details-view-store';
import { StoreNames } from 'common/stores/store-names';
import { DetailsViewStoreData } from 'common/types/store-data/details-view-store-data';
import { DetailsViewStoreDataBuilder } from '../../../common/details-view-store-data-builder';
import { StoreTester } from '../../../common/store-tester';

describe('DetailsViewStoreTest', () => {
    test('getId', () => {
        const testObject = new DetailsViewStore(
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            true,
        );
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

    test('onOpenIssueFilingSettingsDialog', async () => {
        const initialState = new DetailsViewStoreDataBuilder()
            .withIssueFilingSettingsDialogOpen(false)
            .build();

        const expectedState = new DetailsViewStoreDataBuilder()
            .withIssueFilingSettingsDialogOpen(true)
            .build();

        const storeTester = createStoreTesterForDialogActions('openIssueFilingSettingsDialog');
        await storeTester.testListenerToBeCalledOnce(initialState, expectedState);
    });

    test('onCloseIssueFilingSettingsDialog', async () => {
        const initialState = new DetailsViewStoreDataBuilder()
            .withIssueFilingSettingsDialogOpen(true)
            .build();

        const expectedState = new DetailsViewStoreDataBuilder()
            .withIssueFilingSettingsDialogOpen(false)
            .build();

        const storeTester = createStoreTesterForDialogActions('closeIssueFilingSettingsDialog');
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
                new DialogActions(),
                null,
                null,
                null,
                null,
                true,
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
                new DialogActions(),
                null,
                null,
                null,
                null,
                true,
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
                new DialogActions(),
                null,
                null,
                null,
                null,
                true,
            );

        return new StoreTester(SidePanelActions, actionName, factory);
    }

    function createStoreTesterForDialogActions(actionName: keyof DialogActions) {
        const factory = (actions: DialogActions) =>
            new DetailsViewStore(
                new ContentActions(),
                new DetailsViewActions(),
                new SidePanelActions(),
                actions,
                null,
                null,
                null,
                null,
                true,
            );

        return new StoreTester(DialogActions, actionName, factory);
    }
});
