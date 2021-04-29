// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HTMLElementUtils } from 'common/html-element-utils';
import { WindowUtils } from 'common/window-utils';
import { FrameMessenger } from 'injected/frameCommunicators/frame-messenger';
import {
    CommandMessage,
    CommandMessageResponse,
} from 'injected/frameCommunicators/respondable-command-message-communicator';

export class FrameUrlFinder {
    public static readonly GetTargetFrameUrlCommand: string = 'GetTargetFrameUrl';

    constructor(
        private readonly frameMessenger: FrameMessenger,
        private readonly windowUtils: WindowUtils,
        private readonly htmlElementUtils: HTMLElementUtils,
    ) {}

    public initialize(): void {
        this.frameMessenger.addMessageListener(
            FrameUrlFinder.GetTargetFrameUrlCommand,
            this.onGetTargetFrameUrlCommand,
        );
    }

    public getTargetFrameUrl = async (target: string[]): Promise<string> => {
        if (target.length === 1) {
            return this.windowUtils.getWindow().location.href;
        } else {
            const childFrame = this.htmlElementUtils.querySelector(target[0]) as HTMLIFrameElement;
            const message = {
                command: FrameUrlFinder.GetTargetFrameUrlCommand,
                payload: target.slice(1),
            };
            const childResponse = await this.frameMessenger.sendMessageToFrame(childFrame, message);
            return childResponse.payload;
        }
    };

    private onGetTargetFrameUrlCommand = async (
        message: CommandMessage,
    ): Promise<CommandMessageResponse> => {
        const target = message.payload;
        const url = await this.getTargetFrameUrl(target);
        return {
            payload: url,
        };
    };
}
