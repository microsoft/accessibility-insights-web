// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { HTMLElementUtils } from 'common/html-element-utils';
import { WindowUtils } from 'common/window-utils';
import { FrameMessenger } from 'injected/frameCommunicators/frame-messenger';
import {
    CommandMessage,
    CommandMessageResponse,
} from 'injected/frameCommunicators/respondable-command-message-communicator';

export interface AllFrameListener<T> {
    initialize(): void;
    start: () => void;
    teardown: () => void;
    transformChildResultForParent: (fromChild: T, messageSourceFrame: HTMLIFrameElement) => T;
    handleResultInTopFrame: (result: T) => void;
}

export class FrameHelper<T> {
    public static readonly startCommand = 'insights.startFrameHelper';
    public static readonly stopCommand = 'insights.teardownFrameHelper';
    public static readonly onResultFromChildFrame = 'insights.onResultFromChildFrame';
    private listener: AllFrameListener<T>;

    constructor(
        private readonly frameMessenger: FrameMessenger,
        private readonly htmlElementUtils: HTMLElementUtils,
        private readonly windowUtils: WindowUtils,
    ) {}
    public initialize(_listener: AllFrameListener<T>): void {
        this.listener = _listener;
        this.frameMessenger.addMessageListener(FrameHelper.startCommand, this.onStartListen);
        this.frameMessenger.addMessageListener(FrameHelper.stopCommand, this.onTeardownListen);
        this.frameMessenger.addMessageListener(
            FrameHelper.onResultFromChildFrame,
            this.onResultFromChildFrame,
        );
    }

    private onResultFromChildFrame = async (
        commandMessage: CommandMessage,
        messageSourceWin: Window,
    ): Promise<CommandMessageResponse | null> => {
        const payload = commandMessage.payload;
        const messageSourceFrame = this.getFrameElementForWindow(messageSourceWin);
        if (messageSourceFrame != null) {
            const newResult = this.listener.transformChildResultForParent(
                payload,
                messageSourceFrame,
            );

            return await this.reportResults(newResult);
        } else {
            throw new Error('unable to get frame element for the given window');
        }
    };

    public reportResults = async (payload: T): Promise<CommandMessageResponse | null> => {
        if (this.windowUtils.isTopWindow()) {
            this.listener.handleResultInTopFrame(payload);
            return {
                payload,
            };
        } else {
            return await this.sendResultsToParent(payload);
        }
    };

    private sendResultsToParent = async (payload: T): Promise<CommandMessageResponse> => {
        const message: CommandMessage = {
            command: FrameHelper.onResultFromChildFrame,
            payload,
        };
        return this.frameMessenger.sendMessageToWindow(this.windowUtils.getParentWindow(), message);
    };

    private getFrameElementForWindow(win: Window): HTMLIFrameElement | null {
        const frames = this.getAllFrames();

        for (let index = 0; index < frames.length; index++) {
            if (this.htmlElementUtils.getContentWindow(frames[index]) === win) {
                return frames[index];
            }
        }

        return null;
    }

    public start(): void {
        this.onStartListen();
    }

    public stop(): void {
        this.onTeardownListen();
    }

    private onStartListen = async (): Promise<CommandMessageResponse | null> => {
        this.listener.start();
        const iframes = this.getAllFrames();
        for (let pos = 0; pos < iframes.length; pos++) {
            await this.startListeningInFrame(iframes[pos]);
        }
        return { payload: null };
    };

    private onTeardownListen = async (): Promise<CommandMessageResponse | null> => {
        this.listener.teardown();
        const iframes = this.getAllFrames();
        for (let pos = 0; pos < iframes.length; pos++) {
            await this.stopListeningInFrame(iframes[pos]);
        }
        return { payload: null };
    };

    private startListeningInFrame = async (
        frame: HTMLIFrameElement,
    ): Promise<CommandMessageResponse> => {
        const message: CommandMessage = {
            command: FrameHelper.startCommand,
        };
        return await this.frameMessenger.sendMessageToFrame(frame, message);
    };

    private stopListeningInFrame = async (
        frame: HTMLIFrameElement,
    ): Promise<CommandMessageResponse> => {
        const message: CommandMessage = {
            command: FrameHelper.stopCommand,
        };
        return await this.frameMessenger.sendMessageToFrame(frame, message);
    };

    private getAllFrames(): HTMLCollectionOf<HTMLIFrameElement> {
        return this.htmlElementUtils.getAllElementsByTagName(
            'iframe',
        ) as HTMLCollectionOf<HTMLIFrameElement>;
    }
}
