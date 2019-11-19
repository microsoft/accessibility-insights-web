// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Tab } from '../../common/itab.d';
import { StoreNames } from '../../common/stores/store-names';
import { TabStoreData } from '../../common/types/store-data/tab-store-data';
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
        this.emitChanged();
    };

    private onTabRemove = (): void => {
        this.state.isClosed = true;
        this.emitChanged();
    };

    private onExistingTabUpdated = (payload: Tab): void => {
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
}
