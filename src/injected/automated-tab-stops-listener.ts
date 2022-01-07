// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DateProvider } from 'common/date-provider';
import { TabStopEvent } from 'common/types/tab-stop-event';
import { WindowUtils } from 'common/window-utils';
import { AllFrameListener, FrameHelper } from 'injected/frame-helper';

export class AutomatedTabStopsListener implements AllFrameListener<TabStopEvent> {
    private tabEventListener?: (tabbedItems: TabStopEvent) => void;

    constructor(
        private readonly windowUtils: WindowUtils,
        private readonly getUniqueSelector: (element: HTMLElement) => string,
        private readonly dom: Document,
        private readonly frameHelper: FrameHelper<TabStopEvent>,
    ) {}

    public initialize(): void {
        this.frameHelper.initialize(this);
    }

    public handleResultInTopFrame(result: TabStopEvent) {
        if (this.tabEventListener != null) {
            this.tabEventListener(result);
        }
    }

    public setTabEventListenerOnMainWindow(callback: (tabbedItems: TabStopEvent) => void): void {
        if (this.windowUtils.isTopWindow()) {
            this.tabEventListener = callback;
        } else {
            throw new Error('Tabstop Listener callback only supported on main window');
        }
    }

    public start() {
        this.dom.addEventListener('focusin', this.onFocusIn);
    }

    public startInAllFrames() {
        this.frameHelper.start();
    }

    public stopInAllFrames() {
        this.frameHelper.stop();
    }

    public teardown() {
        this.dom.removeEventListener('focusin', this.onFocusIn);
    }

    public transformChildResultForParent(
        tabStopEvent: TabStopEvent,
        messageSourceFrame: HTMLIFrameElement,
    ): TabStopEvent {
        const frameSelector = this.getUniqueSelector(messageSourceFrame);
        tabStopEvent.target.splice(0, 0, frameSelector);
        return tabStopEvent;
    }

    private onFocusIn = async (event: Event): Promise<null> => {
        const target: HTMLElement = event.target as HTMLElement;

        const timestamp: Date = DateProvider.getCurrentDate();

        const tabStopEvent: TabStopEvent = {
            timestamp: timestamp.getTime(),
            target: [this.getUniqueSelector(target)],
            html: target.outerHTML,
        };

        await this.frameHelper.reportResults(tabStopEvent);
        return null;
    };
}
