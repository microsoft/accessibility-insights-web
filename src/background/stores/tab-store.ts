// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';

import { Tab } from '../../common/itab.d';
import { StoreNames } from '../../common/stores/store-names';
import { ITabStoreData } from '../../common/types/store-data/itab-store-data';
import { TabActions } from '../actions/tab-actions';
import { VisualizationActions } from '../actions/visualization-actions';
import { BaseStore } from './base-store';

export class TabStore extends BaseStore<ITabStoreData> {
    private tabActions: TabActions;
    private visualizationActions: VisualizationActions;

    constructor(tabActions: TabActions, visualizationActions: VisualizationActions) {
        super(StoreNames.TabStore);

        this.tabActions = tabActions;
        this.visualizationActions = visualizationActions;
    }

    public getDefaultState(): ITabStoreData {
        const defaultValues: ITabStoreData = {
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
        this.tabActions.tabUpdate.addListener(this.onTabUpdate);
        this.tabActions.getCurrentState.addListener(this.onGetCurrentState);
        this.tabActions.tabRemove.addListener(this.onTabRemove);
        this.tabActions.tabChange.addListener(this.onTabChange);
        this.tabActions.tabVisibilityChange.addListener(this.onVisibilityChange);
        this.visualizationActions.updateSelectedPivotChild.addListener(this.resetTabChange);

        this.visualizationActions.enableVisualization.addListener(this.resetTabChange);

        this.visualizationActions.updateSelectedPivot.addListener(this.resetTabChange);
    }

    @autobind
    private onVisibilityChange(hidden: boolean): void {
        if (this.state.isPageHidden === hidden) {
            return;
        }
        this.state.isPageHidden = hidden;
        this.emitChanged();
    }

    @autobind
    private onTabUpdate(payload: Tab): void {
        this.state.id = payload.id;
        this.state.title = payload.title;
        this.state.url = payload.url;
        this.emitChanged();
    }

    @autobind
    private onTabRemove(): void {
        this.state.isClosed = true;
        this.emitChanged();
    }

    @autobind
    private onTabChange(payload: Tab): void {
        this.state.title = payload.title;
        this.state.url = payload.url;
        this.state.isChanged = true;
        this.emitChanged();
    }

    @autobind
    private resetTabChange(): void {
        if (this.state.isChanged) {
            this.state.isChanged = false;
            this.emitChanged();
        }
    }
}
