// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabStopEvent } from 'common/types/tab-stop-event';
import { AllFrameRunner } from 'injected/all-frame-runner';

export class TabStopsListener {
    constructor(private readonly allFrameRunner: AllFrameRunner<TabStopEvent>) {}

    public setTabEventListenerOnMainWindow(callback: (tabbedItems: TabStopEvent) => void): void {
        this.allFrameRunner.topWindowCallback = callback;
    }

    public startListenToTabStops() {
        this.allFrameRunner.start();
    }

    public stopListenToTabStops() {
        this.allFrameRunner.stop();
    }
}
