// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FrameMessenger } from 'injected/frameCommunicators/frame-messenger';
import { CommandMessage } from 'injected/frameCommunicators/respondable-command-message-communicator';

import { HTMLElementUtils } from './../../common/html-element-utils';

export interface ScrollingWindowMessage {
    focusedTarget: string[];
}

export class ScrollingController {
    public static readonly triggerScrollingCommand = 'insights.scroll';
    private htmlElementUtils: HTMLElementUtils;
    private frameMessenger: FrameMessenger;

    constructor(frameMessenger: FrameMessenger, htmlElementUtils: HTMLElementUtils) {
        this.frameMessenger = frameMessenger;
        this.htmlElementUtils = htmlElementUtils;
    }

    public initialize(): void {
        this.frameMessenger.addMessageListener(
            ScrollingController.triggerScrollingCommand,
            this.onTriggerScrolling,
        );
    }

    private onTriggerScrolling = async (commandMessage: CommandMessage): Promise<null> => {
        await this.processRequest(commandMessage.payload);
        return null;
    };

    public processRequest = async (message: ScrollingWindowMessage): Promise<void> => {
        const selector: string[] = message.focusedTarget;
        if (selector.length === 1) {
            await this.scrollElementInCurrentFrame(selector[0]);
        } else {
            const frameSelector: string = selector.splice(0, 1)[0];
            const frame = this.htmlElementUtils.querySelector(frameSelector) as HTMLIFrameElement;

            await this.scrollElementInIFrames(selector, frame);
        }
    };

    private scrollElementInCurrentFrame = async (selector: string): Promise<void> => {
        const targetElement: Element | null = this.htmlElementUtils.querySelector(selector);
        if (targetElement != null) {
            await this.htmlElementUtils.scrollInToView(targetElement);
        }
    };

    private scrollElementInIFrames = async (
        focusedTarget: string[],
        frame: HTMLIFrameElement,
    ): Promise<void> => {
        const commandMessage: CommandMessage = {
            command: ScrollingController.triggerScrollingCommand,
            payload: {
                focusedTarget: focusedTarget,
            },
        };
        await this.frameMessenger.sendMessageToFrame(frame, commandMessage);
    };
}
