// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HTMLElementUtils } from '../common/html-element-utils';
import { WindowUtils } from '../common/window-utils';
import { FrameCommunicator, MessageRequest } from './frameCommunicators/frame-communicator';

export interface TargetMessage {
    target: string[];
}

export interface FrameUrlMessage {
    frameUrl: string;
}

export class FrameUrlFinder {
    public static readonly SetFrameUrlCommand: string = 'SetTargetFrameUrl';
    public static readonly GetTargetFrameUrlCommand: string = 'GetTargetFrameUrl';

    private frameCommunicator: FrameCommunicator;
    private windowUtils: WindowUtils;
    private htmlElementUtils: HTMLElementUtils;

    constructor(frameCommunicator: FrameCommunicator, windowUtils: WindowUtils, htmlElementUtils: HTMLElementUtils) {
        this.frameCommunicator = frameCommunicator;
        this.windowUtils = windowUtils;
        this.htmlElementUtils = htmlElementUtils;
    }

    public initialize(): void {
        this.frameCommunicator.subscribe(FrameUrlFinder.GetTargetFrameUrlCommand, this.processRequest);
    }

    public processRequest = (message: TargetMessage): void => {
        const target = message.target;

        if (target.length === 1) {
            this.frameCommunicator.sendMessage({
                command: FrameUrlFinder.SetFrameUrlCommand,
                win: this.windowUtils.getTopWindow(),
                message: {
                    frameUrl: this.windowUtils.getWindow().location.href,
                },
            } as MessageRequest<FrameUrlMessage>);
        } else if (target.length > 1) {
            this.frameCommunicator.sendMessage({
                command: FrameUrlFinder.GetTargetFrameUrlCommand,
                frame: this.htmlElementUtils.querySelector(target[0]) as HTMLIFrameElement,
                message: {
                    target: target.slice(1),
                },
            } as MessageRequest<TargetMessage>);
        }
    };
}
