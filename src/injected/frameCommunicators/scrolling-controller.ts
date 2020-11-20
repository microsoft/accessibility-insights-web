// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HTMLElementUtils } from './../../common/html-element-utils';
import { ErrorMessageContent } from './error-message-content';
import { FrameCommunicator, MessageRequest } from './frame-communicator';
import { FrameMessageResponseCallback } from './window-message-handler';

export interface ScrollingWindowMessage {
    focusedTarget: string[];
}

export class ScrollingController {
    public static readonly triggerScrollingCommand = 'insights.scroll';
    private htmlElementUtils: HTMLElementUtils;
    private frameCommunicator: FrameCommunicator;

    constructor(frameCommunicator: FrameCommunicator, htmlElementUtils: HTMLElementUtils) {
        this.frameCommunicator = frameCommunicator;
        this.htmlElementUtils = htmlElementUtils;
    }

    public initialize(): void {
        this.frameCommunicator.subscribe(
            ScrollingController.triggerScrollingCommand,
            this.onTriggerScrolling,
        );
    }

    private onTriggerScrolling = (
        result: any | undefined,
        error: ErrorMessageContent | undefined,
        messageSourceWindow: Window,
        responder?: FrameMessageResponseCallback,
    ): void => {
        this.processRequest(result);
    };

    public processRequest(message: ScrollingWindowMessage): void {
        const selector: string[] = message.focusedTarget;
        if (selector.length === 1) {
            this.scrollElementInCurrentFrame(selector[0]);
        } else {
            const frameSelector: string = selector.splice(0, 1)[0];
            const frame = this.htmlElementUtils.querySelector(frameSelector) as HTMLIFrameElement;

            this.scrollElementInIFrames(selector, frame);
        }
    }

    private scrollElementInCurrentFrame(selector: string): void {
        const targetElement: Element | null = this.htmlElementUtils.querySelector(selector);
        if (targetElement != null) {
            this.htmlElementUtils.scrollInToView(targetElement);
        }
    }

    private scrollElementInIFrames(focusedTarget: string[], frame: HTMLIFrameElement): void {
        const message: ScrollingWindowMessage = {
            focusedTarget: focusedTarget,
        };

        this.frameCommunicator.sendMessage(this.createFrameRequestMessage(frame, message));
    }

    private createFrameRequestMessage(
        frame: HTMLIFrameElement,
        message: ScrollingWindowMessage,
    ): MessageRequest<ScrollingWindowMessage> {
        return {
            command: ScrollingController.triggerScrollingCommand,
            frame: frame,
            message: message,
        } as MessageRequest<ScrollingWindowMessage>;
    }
}
