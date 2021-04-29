// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FrameMessenger } from 'injected/frameCommunicators/frame-messenger';
import {
    CommandMessage,
    CommandMessageResponse,
} from 'injected/frameCommunicators/respondable-command-message-communicator';
import { HTMLElementUtils } from '../common/html-element-utils';

export interface ElementFinderByPathMessage {
    path: string[];
}

export class ElementFinderByPath {
    public static readonly findElementByPathCommand = 'insights.findElementByPathCommand';

    constructor(
        private readonly htmlElementUtils: HTMLElementUtils,
        private readonly frameMessenger: FrameMessenger,
    ) {}

    public initialize = (): void => {
        this.frameMessenger.addMessageListener(
            ElementFinderByPath.findElementByPathCommand,
            this.onFindElementByPath,
        );
    };

    protected onFindElementByPath = async (
        commandMessage: CommandMessage,
    ): Promise<CommandMessageResponse | null> => {
        return await this.processRequest(commandMessage.payload);
    };

    public processRequest = async (
        message: ElementFinderByPathMessage,
    ): Promise<CommandMessageResponse> => {
        if (!this.checkSyntax(message.path[0])) {
            throw new Error('Syntax error in specified path');
        }

        const element = this.htmlElementUtils.querySelector(message.path[0]) as HTMLElement;

        if (element == null) {
            throw new Error('Element not found for specified path');
        }

        if (element.tagName.toLocaleLowerCase() !== 'iframe' && message.path.length > 1) {
            throw new Error('Multiple paths specified but expected one');
        }

        if (element.tagName.toLocaleLowerCase() !== 'iframe' && message.path.length === 1) {
            const response = element.outerHTML;
            return { payload: response };
        }

        return await this.iterateDeeperOnIframe(element, message);
    };

    private iterateDeeperOnIframe = async (
        element: HTMLElement,
        message: ElementFinderByPathMessage,
    ): Promise<CommandMessageResponse> => {
        message.path.shift();

        const targetFrame = element as HTMLIFrameElement;
        const commandMessage: CommandMessage = {
            command: ElementFinderByPath.findElementByPathCommand,
            payload: {
                path: message.path,
            },
        };

        return await this.frameMessenger.sendMessageToFrame(targetFrame, commandMessage);
    };

    private checkSyntax = (pathSegment: string): boolean => {
        if (pathSegment.startsWith(',') || pathSegment.startsWith(';')) {
            return false;
        }
        return true;
    };
}
