// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { PersistentStore } from 'common/flux/persistent-store';
import { IndexedDBAPI } from 'common/indexedDB/indexedDB';
import { Tab } from 'common/itab';
import { Logger } from 'common/logging/logger';
import { StoreNames } from 'common/stores/store-names';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { TabActions } from '../actions/tab-actions';
import { VisualizationActions } from '../actions/visualization-actions';

export class TabStore extends PersistentStore<TabStoreData> {
    private tabActions: TabActions;
    private visualizationActions: VisualizationActions;

    constructor(
        tabActions: TabActions,
        visualizationActions: VisualizationActions,
        persistedState: TabStoreData,
        idbInstance: IndexedDBAPI,
        logger: Logger,
    ) {
        super(StoreNames.TabStore, persistedState, idbInstance, IndexedDBDataKeys.tabStore, logger);

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

    private onVisibilityChange = (hidden: boolean): void => {
        if (this.state.isPageHidden === hidden) {
            return;
        }
        this.state.isPageHidden = hidden;
        this.emitChanged();
    };

    private onNewTabCreated = (payload: Tab): void => {
        this.state.id = payload.id;
        this.state.title = payload.title;
        this.state.url = payload.url;
        this.state.isClosed = false;
        this.state.isChanged = false;
        this.state.isOriginChanged = false;
        this.emitChanged();
    };

    private onTabRemove = (): void => {
        this.state.isClosed = true;
        this.emitChanged();
    };

    private onExistingTabUpdated = (payload: Tab): void => {
        if (!this.originsMatch(payload.url, this.state.url)) {
            this.state.isOriginChanged = true;
        }
        this.state.title = payload.title;
        this.state.url = payload.url;
        this.state.isChanged = true;
        this.emitChanged();
    };

    private resetTabChange = (): void => {
        if (this.state.isChanged) {
            this.state.isChanged = false;
            this.emitChanged();
        }
    };

    private originsMatch = (url1: string, url2: string): boolean => {
        if (url1 == null && url2 == null) {
            return true;
        }
        if (url1 != null && url2 != null) {
            return new URL(url1).origin === new URL(url2).origin;
        }
        return false;
    };
}
