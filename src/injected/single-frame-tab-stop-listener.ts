// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DateProvider } from 'common/date-provider';
import { TabStopEvent } from 'common/types/store-data/tab-stop-event';
import { AllFrameRunnerTarget } from 'injected/all-frame-runner';
import { ShadowDomFocusTracker } from 'injected/shadow-dom-focus-tracker';

export class SingleFrameTabStopListener
    extends ShadowDomFocusTracker
    implements AllFrameRunnerTarget<TabStopEvent>
{
    private reportResults: (payload: TabStopEvent) => Promise<void>;

    constructor(
        public readonly commandSuffix: string,
        private readonly getUniqueSelector: (element: HTMLElement) => string,
        dom: Document,
        private readonly getCurrentDate: typeof DateProvider.getCurrentDate = DateProvider.getCurrentDate,
    ) {
        super(dom);
    }

    public setResultCallback = (reportResultCallback: (payload: TabStopEvent) => Promise<void>) => {
        this.reportResults = reportResultCallback;
    };

    public transformChildResultForParent = (
        tabStopEvent: TabStopEvent,
        messageSourceFrame: HTMLIFrameElement,
    ): TabStopEvent => {
        const frameSelector = this.getUniqueSelector(messageSourceFrame);
        return {
            timestamp: tabStopEvent.timestamp,
            html: tabStopEvent.html,
            target: [frameSelector, ...tabStopEvent.target],
        };
    };

    protected override focusInCallback = async (target: HTMLElement): Promise<void> => {
        const timestamp: Date = this.getCurrentDate();

        const tabStopEvent: TabStopEvent = {
            timestamp: timestamp.getTime(),
            target: [this.getUniqueSelector(target)],
            html: target.outerHTML,
        };

        await this.reportResults(tabStopEvent);
    };
}
