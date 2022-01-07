// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { HTMLElementUtils } from 'common/html-element-utils';
import { WindowUtils } from 'common/window-utils';
import { FrameMessenger } from 'injected/frameCommunicators/frame-messenger';
import {
    CommandMessage,
    CommandMessageResponse,
} from 'injected/frameCommunicators/respondable-command-message-communicator';

export interface AllFrameRunnerTarget<T> {
    start: () => void;
    teardown: () => void;
    transformChildResultForParent: (fromChild: T, messageSourceFrame: HTMLIFrameElement) => T;
    setResultCallback: (reportResults: (payload: T) => Promise<null>) => void;
}

/*
This class ('runner' below) runs methods in AllFrameRunnerTargets ('target' below) in all child
frames. Runner manages communication between child frames and the top-level window so that the
target can produce results without explicit frame-communication code. 

It follows these semantics:
- runner.initialize() should be called & runner.topWindowCallback should be set 
before calling runner.start() / runner.stop()
- runner.start() will run target.start() in the current frame, and then in any child frames
- runner.stop() will run target.stop() in the current frame, and then in any child frames
- runner provides target with a reportResults callback. When target.reportResults(payload) is 
called, runner propogates payload to parent frames. In each parent frame, runner replaces the 
payload with target.transformChildResultForParent(payload). When the result reaches the top window, 
runner calls topWindowCallback(payload)
*/
export class AllFrameRunner<T> {
    public static readonly startCommand = 'insights.startAllFrameRunner';
    public static readonly stopCommand = 'insights.stopAllFrameRunner';
    public static readonly onResultFromChildFrame = 'insights.onResultFromChildInFrameRunner';
    public topWindowCallback: (result: T) => void;

    constructor(
        private readonly frameMessenger: FrameMessenger,
        private readonly htmlElementUtils: HTMLElementUtils,
        private readonly windowUtils: WindowUtils,
        private readonly listener: AllFrameRunnerTarget<T>,
    ) {}

    public initialize() {
        this.frameMessenger.addMessageListener(AllFrameRunner.startCommand, this.start);
        this.frameMessenger.addMessageListener(AllFrameRunner.stopCommand, this.stop);
        this.frameMessenger.addMessageListener(
            AllFrameRunner.onResultFromChildFrame,
            this.onResultFromChildFrame,
        );

        this.listener.setResultCallback(async payload => {
            await this.reportResults(payload);
            return null;
        });
    }

    public start = async (): Promise<CommandMessageResponse | null> => {
        this.listener.start();
        const iframes = this.getAllFrames();
        for (let pos = 0; pos < iframes.length; pos++) {
            await this.startListeningInFrame(iframes[pos]);
        }
        return { payload: null };
    };

    public stop = async (): Promise<CommandMessageResponse | null> => {
        this.listener.teardown();
        const iframes = this.getAllFrames();
        for (let pos = 0; pos < iframes.length; pos++) {
            await this.stopListeningInFrame(iframes[pos]);
        }
        return { payload: null };
    };

    private reportResults = async (payload: T): Promise<CommandMessageResponse | null> => {
        if (this.windowUtils.isTopWindow()) {
            this.topWindowCallback(payload);
            return {
                payload,
            };
        } else {
            return await this.sendResultsToParent(payload);
        }
    };

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

    private sendResultsToParent = async (payload: T): Promise<CommandMessageResponse> => {
        const message: CommandMessage = {
            command: AllFrameRunner.onResultFromChildFrame,
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

    private startListeningInFrame = async (
        frame: HTMLIFrameElement,
    ): Promise<CommandMessageResponse> => {
        const message: CommandMessage = {
            command: AllFrameRunner.startCommand,
        };
        return await this.frameMessenger.sendMessageToFrame(frame, message);
    };

    private stopListeningInFrame = async (
        frame: HTMLIFrameElement,
    ): Promise<CommandMessageResponse> => {
        const message: CommandMessage = {
            command: AllFrameRunner.stopCommand,
        };
        return await this.frameMessenger.sendMessageToFrame(frame, message);
    };

    private getAllFrames(): HTMLCollectionOf<HTMLIFrameElement> {
        return this.htmlElementUtils.getAllElementsByTagName(
            'iframe',
        ) as HTMLCollectionOf<HTMLIFrameElement>;
    }
}
