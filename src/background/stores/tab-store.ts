// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { PersistentStore } from 'common/flux/persistent-store';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Logger } from 'common/logging/logger';
import { StoreNames } from 'common/stores/store-names';
import { Tab } from 'common/types/store-data/itab';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { UrlParser } from 'common/url-parser';
import { TabActions } from '../actions/tab-actions';
import { VisualizationActions } from '../actions/visualization-actions';

export class TabStore extends PersistentStore<TabStoreData, Promise<void>> {
    private tabActions: TabActions;
    private visualizationActions: VisualizationActions;

    constructor(
        tabActions: TabActions,
        visualizationActions: VisualizationActions,
        persistedState: TabStoreData,
        idbInstance: IndexedDBAPI,
        logger: Logger,
        tabId: number,
        persistStoreData: boolean,
        private readonly urlParser: UrlParser,
    ) {
        super(
            StoreNames.TabStore,
            persistedState,
            idbInstance,
            IndexedDBDataKeys.tabStore(tabId),
            logger,
            persistStoreData,
        );

        this.tabActions = tabActions;
        this.visualizationActions = visualizationActions;
    }

    public getDefaultState(): TabStoreData {
        const defaultValues: TabStoreData = {
            url: null,
            title: null,
            id: null,
            isClosed: false,
            isChanged: false,
            isPageHidden: false,
            isOriginChanged: false,
        };

        return defaultValues;
    }

    protected addActionListeners(): void {
        this.tabActions.newTabCreated.addListener(this.onNewTabCreated);
        this.tabActions.getCurrentState.addListener(this.onGetCurrentState);
        this.tabActions.tabRemove.addListener(this.onTabRemove);
        this.tabActions.existingTabUpdated.addListener(this.onExistingTabUpdated);
        this.tabActions.tabVisibilityChange.addListener(this.onVisibilityChange);
        this.visualizationActions.updateSelectedPivotChild.addListener(this.resetTabChange);

        this.visualizationActions.enableVisualization.addListener(this.resetTabChange);

        this.visualizationActions.updateSelectedPivot.addListener(this.resetTabChange);
    }

    private onVisibilityChange = async (hidden: boolean): Promise<void> => {
        if (this.state.isPageHidden === hidden) {
            return;
        }
        this.state.isPageHidden = hidden;
        await this.emitChanged();
    };

    private onNewTabCreated = async (payload: Tab): Promise<void> => {
        this.state.id = payload.id;
        this.state.title = payload.title;
        this.state.url = payload.url;
        this.state.isClosed = false;
        this.state.isChanged = false;
        this.state.isOriginChanged = false;
        await this.emitChanged();
    };

    private onTabRemove = async (): Promise<void> => {
        this.state.isClosed = true;
        await this.emitChanged();
    };

    private onExistingTabUpdated = async (payload: Tab): Promise<void> => {
        if (!this.urlParser.areURLsSameOrigin(this.state.url, payload.url)) {
            this.state.isOriginChanged = true;
        }
        this.state.title = payload.title;
        this.state.url = payload.url;
        this.state.isChanged = true;
        await this.emitChanged();
    };

    private resetTabChange = async (): Promise<void> => {
        if (this.state.isChanged) {
            this.state.isChanged = false;
            await this.emitChanged();
        }
    };
}
