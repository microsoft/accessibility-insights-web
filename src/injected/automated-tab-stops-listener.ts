// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabStopEvent } from 'common/types/tab-stop-event';
import { AllFrameRunner } from 'injected/all-frame-runner';

export class AutomatedTabStopsListener {
    constructor(private readonly allFrameRunner: AllFrameRunner<TabStopEvent>) {}

    public initialize(callback: (tabbedItems: TabStopEvent) => void): void {
        this.allFrameRunner.topWindowCallback = callback;
    }

    public startInAllFrames() {
        this.allFrameRunner.start();
    }

    public stopInAllFrames() {
        this.allFrameRunner.stop();
    }
}
