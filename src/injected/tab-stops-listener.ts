// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DateProvider } from '../common/date-provider';
import { HTMLElementUtils } from '../common/html-element-utils';
import { WindowUtils } from '../common/window-utils';
import { VisualizationWindowMessage } from './drawing-controller';
import { ErrorMessageContent } from './frameCommunicators/error-message-content';
import { FrameCommunicator, MessageRequest } from './frameCommunicators/frame-communicator';
import { FrameMessageResponseCallback } from './frameCommunicators/window-message-handler';
import { ScannerUtils } from './scanner-utils';

export interface TabStopEvent {
    timestamp: number;
    target: string[];
    html: string;
}

export class TabStopsListener {
    private frameCommunicator: FrameCommunicator;
    private htmlElementUtils: HTMLElementUtils;
    private scannerUtils: ScannerUtils;
    private windowUtils: WindowUtils;
    private dom: Document;
    public static readonly startListeningCommand = 'insights.startListenToTabstops';
    public static readonly stopListeningCommand = 'insights.stopListenToTabstops';
    public static readonly getTabbedElementsCommand = 'insights.getTabbedElements';

    private tabEventListener: (tabbedItems: TabStopEvent) => void;

    constructor(
        frameCommunicator: FrameCommunicator,
        windowUtils: WindowUtils,
        htmlElementUtils: HTMLElementUtils,
        scannerUtils: ScannerUtils,
        dom?: Document,
    ) {
        this.frameCommunicator = frameCommunicator;
        this.htmlElementUtils = htmlElementUtils;
        this.windowUtils = windowUtils;
        this.scannerUtils = scannerUtils;
        this.dom = dom || document;
    }

    public initialize(): void {
        this.frameCommunicator.subscribe(
            TabStopsListener.startListeningCommand,
            this.onStartListenToTabStops,
        );
        this.frameCommunicator.subscribe(
            TabStopsListener.getTabbedElementsCommand,
            this.onGetTabbedElements,
        );
        this.frameCommunicator.subscribe(
            TabStopsListener.stopListeningCommand,
            this.onStopListenToTabStops,
        );
    }

    public setTabEventListenerOnMainWindow(callback: (tabbedItems: TabStopEvent) => void): void {
        if (this.windowUtils.isTopWindow()) {
            this.tabEventListener = callback;
        } else {
            throw new Error('Tabstop Listener callback only supported on main window');
        }
    }

    public startListenToTabStops(): void {
        this.onStartListenToTabStops();
    }

    public stopListenToTabStops(): void {
        this.onStopListenToTabStops();
    }

    private onGetTabbedElements = (
        tabStopEvent: TabStopEvent,
        error: ErrorMessageContent,
        messageSourceWin: Window,
        responder?: FrameMessageResponseCallback,
    ): void => {
        const messageSourceFrame = this.getFrameElementForWindow(messageSourceWin);

        if (messageSourceFrame != null) {
            const frameSelector = this.scannerUtils.getUniqueSelector(messageSourceFrame);
            tabStopEvent.target.splice(0, 0, frameSelector);

            this.sendTabbedElements(tabStopEvent);
        } else {
            throw new Error('unable to get frame element for the tabbed element');
        }
    };

    private sendTabbedElements = (tabStopEvent: TabStopEvent): void => {
        if (this.windowUtils.isTopWindow()) {
            if (this.tabEventListener) {
                this.tabEventListener(tabStopEvent);
            } else {
                throw new Error('Tab Listener not setup in main window');
            }
        } else {
            this.sendTabbedElementsToParent(tabStopEvent);
        }
    };

    private sendTabbedElementsToParent = (tabStopEvent: TabStopEvent): void => {
        const messageRequest: MessageRequest<TabStopEvent> = {
            win: this.windowUtils.getParentWindow(),
            command: TabStopsListener.getTabbedElementsCommand,
            message: tabStopEvent,
        };
        this.frameCommunicator.sendMessage(messageRequest);
    };

    private getFrameElementForWindow(win: Window): HTMLIFrameElement {
        const frames = this.getAllFrames();

        for (let index = 0; index < frames.length; index++) {
            if (this.htmlElementUtils.getContentWindow(frames[index]) === win) {
                return frames[index];
            }
        }

        return null;
    }

    private onStartListenToTabStops = (): void => {
        this.addListeners();
        const iframes = this.getAllFrames();
        for (let pos = 0; pos < iframes.length; pos++) {
            this.startListenToTabStopsInFrame(iframes[pos]);
        }
    };

    private onStopListenToTabStops = (): void => {
        this.removeListeners();
        const iframes = this.getAllFrames();
        for (let pos = 0; pos < iframes.length; pos++) {
            this.stopListenToTabStopsInFrame(iframes[pos]);
        }
    };

    private startListenToTabStopsInFrame(frame: HTMLIFrameElement): void {
        const message: MessageRequest<VisualizationWindowMessage> = {
            command: TabStopsListener.startListeningCommand,
            frame: frame,
        };
        this.frameCommunicator.sendMessage(message);
    }

    private stopListenToTabStopsInFrame = (frame: HTMLIFrameElement): void => {
        const message: MessageRequest<VisualizationWindowMessage> = {
            command: TabStopsListener.stopListeningCommand,
            frame: frame,
        };
        this.frameCommunicator.sendMessage(message);
    };

    private addListeners(): void {
        this.dom.addEventListener('focusin', this.onFocusIn);
    }

    private removeListeners(): void {
        this.dom.removeEventListener('focusin', this.onFocusIn);
    }

    private onFocusIn = (event: Event): void => {
        const target: HTMLElement = event.target as HTMLElement;

        const timestamp: Date = DateProvider.getCurrentDate();

        const tabStopEvent: TabStopEvent = {
            timestamp: timestamp.getTime(),
            target: [this.scannerUtils.getUniqueSelector(target)],
            html: target.outerHTML,
        };

        this.sendTabbedElements(tabStopEvent);
    };

    private getAllFrames(): HTMLCollectionOf<HTMLIFrameElement> {
        return this.htmlElementUtils.getAllElementsByTagName('iframe') as HTMLCollectionOf<
            HTMLIFrameElement
        >;
    }
}
