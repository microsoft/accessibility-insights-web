// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabStopsActions } from 'electron/flux/action/tab-stops-actions';

export class TabStopsActionCreator {
    constructor(private readonly tabStopsActions: TabStopsActions) {}

    public enableTabStops = () => {
        this.tabStopsActions.enableFocusTracking.invoke();
    };

    public disableTabStops = () => {
        this.tabStopsActions.disableFocusTracking.invoke();
    };

    public startOver = () => {
        this.tabStopsActions.startOver.invoke();
    };
}
