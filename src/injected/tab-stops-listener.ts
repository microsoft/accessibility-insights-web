// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DateProvider } from 'common/date-provider';
import { HTMLElementUtils } from 'common/html-element-utils';
import { TabStopEvent } from 'common/types/tab-stop-event';
import { WindowUtils } from 'common/window-utils';
import { FrameMessenger } from 'injected/frameCommunicators/frame-messenger';
import {
    CommandMessage,
    CommandMessageResponse,
} from 'injected/frameCommunicators/respondable-command-message-communicator';

export class TabStopsListener {
    public static readonly startListeningCommand = 'insights.startListenToTabstops';
    public static readonly stopListeningCommand = 'insights.stopListenToTabstops';
    public static readonly getTabbedElementsCommand = 'insights.getTabbedElements';

    private tabEventListener?: (tabbedItems: TabStopEvent) => void;

    constructor(
        private readonly frameMessenger: FrameMessenger,
        private readonly windowUtils: WindowUtils,
        private readonly htmlElementUtils: HTMLElementUtils,
        private readonly getUniqueSelector: (element: HTMLElement) => string,
        private readonly dom: Document,
    ) {}

    public initialize(): void {
        this.frameMessenger.addMessageListener(
            TabStopsListener.startListeningCommand,
            this.onStartListenToTabStops,
        );
        this.frameMessenger.addMessageListener(
            TabStopsListener.getTabbedElementsCommand,
            this.onGetTabbedElements,
        );
        this.frameMessenger.addMessageListener(
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

    public startListenToTabStops = async (): Promise<CommandMessageResponse | null> => {
        return await this.onStartListenToTabStops();
    };

    public stopListenToTabStops = async (): Promise<CommandMessageResponse | null> => {
        return await this.onStopListenToTabStops();
    };

    private onGetTabbedElements = async (
        commandMessage: CommandMessage,
        messageSourceWin: Window,
    ): Promise<CommandMessageResponse | null> => {
        const tabStopEvent = commandMessage.payload;
        const messageSourceFrame = this.getFrameElementForWindow(messageSourceWin);

        if (messageSourceFrame != null) {
            const frameSelector = this.getUniqueSelector(messageSourceFrame);
            tabStopEvent.target.splice(0, 0, frameSelector);

            return await this.sendTabbedElements(tabStopEvent);
        } else {
            throw new Error('unable to get frame element for the tabbed element');
        }
    };

    private sendTabbedElements = async (
        tabStopEvent: TabStopEvent,
    ): Promise<CommandMessageResponse | null> => {
        if (this.windowUtils.isTopWindow()) {
            if (this.tabEventListener) {
                this.tabEventListener(tabStopEvent);
                return {
                    payload: tabStopEvent,
                };
            } else {
                throw new Error('Tab Listener not setup in main window');
            }
        } else {
            return await this.sendTabbedElementsToParent(tabStopEvent);
        }
    };

    private sendTabbedElementsToParent = async (
        tabStopEvent: TabStopEvent,
    ): Promise<CommandMessageResponse> => {
        const message: CommandMessage = {
            command: TabStopsListener.getTabbedElementsCommand,
            payload: tabStopEvent,
        };
        return this.frameMessenger.sendMessageToWindow(this.windowUtils.getParentWindow(), message);
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

    private onStartListenToTabStops = async (): Promise<CommandMessageResponse | null> => {
        this.addListeners();
        const iframes = this.getAllFrames();
        for (let pos = 0; pos < iframes.length; pos++) {
            await this.startListenToTabStopsInFrame(iframes[pos]);
        }
        return { payload: null };
    };

    private onStopListenToTabStops = async (): Promise<CommandMessageResponse | null> => {
        this.removeListeners();
        const iframes = this.getAllFrames();
        for (let pos = 0; pos < iframes.length; pos++) {
            await this.stopListenToTabStopsInFrame(iframes[pos]);
        }
        return { payload: null };
    };

    private startListenToTabStopsInFrame = async (
        frame: HTMLIFrameElement,
    ): Promise<CommandMessageResponse> => {
        const message: CommandMessage = {
            command: TabStopsListener.startListeningCommand,
        };
        return await this.frameMessenger.sendMessageToFrame(frame, message);
    };

    private stopListenToTabStopsInFrame = async (
        frame: HTMLIFrameElement,
    ): Promise<CommandMessageResponse> => {
        const message: CommandMessage = {
            command: TabStopsListener.stopListeningCommand,
        };
        return await this.frameMessenger.sendMessageToFrame(frame, message);
    };

    private addListeners(): void {
        this.dom.addEventListener('focusin', this.onFocusIn);
    }

    private removeListeners(): void {
        this.dom.removeEventListener('focusin', this.onFocusIn);
    }

    private onFocusIn = async (event: Event): Promise<null> => {
        const target: HTMLElement = event.target as HTMLElement;

        const timestamp: Date = DateProvider.getCurrentDate();

        const tabStopEvent: TabStopEvent = {
            timestamp: timestamp.getTime(),
            target: [this.getUniqueSelector(target)],
            html: target.outerHTML,
        };

        await this.sendTabbedElements(tabStopEvent);
        return null;
    };

    private getAllFrames(): HTMLCollectionOf<HTMLIFrameElement> {
        return this.htmlElementUtils.getAllElementsByTagName(
            'iframe',
        ) as HTMLCollectionOf<HTMLIFrameElement>;
    }
}
