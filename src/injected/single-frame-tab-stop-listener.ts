// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DateProvider } from 'common/date-provider';
import { TabStopEvent } from 'common/types/tab-stop-event';
import { AllFrameRunnerTarget } from 'injected/all-frame-runner';

export class SingleFrameTabStopListener implements AllFrameRunnerTarget<TabStopEvent> {
    private reportResults: (payload: TabStopEvent) => Promise<null>;

    constructor(
        private readonly getUniqueSelector: (element: HTMLElement) => string,
        private readonly dom: Document,
    ) {}

    public start = () => {
        this.dom.addEventListener('focusin', this.onFocusIn);
    };

    public teardown = () => {
        this.dom.removeEventListener('focusin', this.onFocusIn);
    };

    public setResultCallback = (reportResultCallback: (payload: TabStopEvent) => Promise<null>) => {
        this.reportResults = reportResultCallback;
    };

    public transformChildResultForParent = (
        tabStopEvent: TabStopEvent,
        messageSourceFrame: HTMLIFrameElement,
    ): TabStopEvent => {
        const frameSelector = this.getUniqueSelector(messageSourceFrame);
        tabStopEvent.target.splice(0, 0, frameSelector);
        return tabStopEvent;
    };

    private onFocusIn = async (event: Event): Promise<null> => {
        const target: HTMLElement = event.target as HTMLElement;

        const timestamp: Date = DateProvider.getCurrentDate();

        const tabStopEvent: TabStopEvent = {
            timestamp: timestamp.getTime(),
            target: [this.getUniqueSelector(target)],
            html: target.outerHTML,
        };

        await this.reportResults(tabStopEvent);
        return null;
    };
}
