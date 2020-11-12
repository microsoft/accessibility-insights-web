// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HTMLElementUtils } from '../common/html-element-utils';
import { ErrorMessageContent } from './frameCommunicators/error-message-content';
import { FrameCommunicator } from './frameCommunicators/frame-communicator';
import { FrameMessageResponseCallback } from './frameCommunicators/window-message-handler';

export interface ElementFinderByPathMessage {
    path: string[];
}

export class ElementFinderByPath {
    public static readonly findElementByPathCommand = 'insights.findElementByPathCommand';

    constructor(
        private readonly htmlElementUtils: HTMLElementUtils,
        private readonly frameCommunicator: FrameCommunicator,
    ) {}

    public initialize = (): void => {
        this.frameCommunicator.subscribe(
            ElementFinderByPath.findElementByPathCommand,
            this.onFindElementByPath,
        );
    };

    protected onFindElementByPath = (
        result: any | undefined,
        error: ErrorMessageContent | undefined,
        messageSourceWindow: Window,
        responder?: FrameMessageResponseCallback,
    ): void => {
        this.processRequest(result).then(
            result => {
                responder != null && responder(result, undefined, messageSourceWindow);
            },
            err => {
                responder != null && responder(undefined, err, messageSourceWindow);
            },
        );
    };

    public processRequest = (message: ElementFinderByPathMessage): PromiseLike<string> => {
        if (!this.checkSyntax(message.path[0])) {
            return Promise.reject();
        }

        const element = this.htmlElementUtils.querySelector(message.path[0]) as HTMLElement;

        if (element == null) {
            return Promise.reject();
        }

        if (element.tagName.toLocaleLowerCase() !== 'iframe' && message.path.length > 1) {
            return Promise.reject();
        }

        if (element.tagName.toLocaleLowerCase() !== 'iframe' && message.path.length === 1) {
            const response = element.outerHTML;
            return Promise.resolve(response);
        }

        return this.iterateDeeperOnIframe(element, message);
    };

    private iterateDeeperOnIframe = (
        element: HTMLElement,
        message: ElementFinderByPathMessage,
    ): PromiseLike<string> => {
        message.path.shift();

        return this.frameCommunicator.sendMessage<ElementFinderByPathMessage, string>({
            command: ElementFinderByPath.findElementByPathCommand,
            frame: element as HTMLIFrameElement,
            message: {
                path: message.path,
            } as ElementFinderByPathMessage,
        });
    };

    private checkSyntax = (pathSegment: string): boolean => {
        if (pathSegment.startsWith(',') || pathSegment.startsWith(';')) {
            return false;
        }
        return true;
    };
}
