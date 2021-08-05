// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Tab } from 'common/itab';
import { StoreNames } from 'common/stores/store-names';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { TabActions } from '../actions/tab-actions';
import { VisualizationActions } from '../actions/visualization-actions';
import { BaseStoreImpl } from './base-store-impl';

export class TabStore extends BaseStoreImpl<TabStoreData> {
    private tabActions: TabActions;
    private visualizationActions: VisualizationActions;

    constructor(tabActions: TabActions, visualizationActions: VisualizationActions) {
        super(StoreNames.TabStore);

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
        if (payload.id !== null && payload.id !== undefined) { 
            this.state.id = payload.id;
        }
        if (payload.title) {
            this.state.title = payload.title;
        }
        if (payload.url) {
            this.state.url = payload.url;
        }
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

    private originsMatch = (url1: string | null, url2: string | null): boolean => {
        if (url1 === null && url2 === null) {
            return true;
        }
        if (url1 !== null && url2 !== null) {
            return new URL(url1).origin === new URL(url2).origin;
        }
        return false;
    };
}
