// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { StoreNames } from 'common/stores/store-names';
import { TabStopsActions } from 'electron/flux/action/tab-stops-actions';
import { TabStopsStoreData } from 'electron/flux/types/tab-stops-store-data';

export class TabStopsStore extends BaseStoreImpl<TabStopsStoreData> {
    constructor(private readonly tabStopsActions: TabStopsActions) {
        super(StoreNames.TabStopsStore);
    }

    public getDefaultState(): TabStopsStoreData {
        return {
            focusTracking: false,
        };
    }

    public addActionListeners(): void {
        this.tabStopsActions.enableFocusTracking.addListener(this.onEnableFocusTracking);
        this.tabStopsActions.disableFocusTracking.addListener(this.onDisableFocusTracking);
        this.tabStopsActions.startOver.addListener(this.onStartOver);
    }

    private onEnableFocusTracking = () => {
        this.state.focusTracking = true;
        this.emitChanged();
    };

    private onDisableFocusTracking = () => {
        this.state.focusTracking = false;
        this.emitChanged();
    };

    private onStartOver = () => {
        this.state.focusTracking = false;
        this.emitChanged();
    };
}
