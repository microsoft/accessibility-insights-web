// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import Q from '../../node_modules/@types/q';
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
        private readonly q: typeof Q,
    ) {}

    public initialize(): void {
        this.frameCommunicator.subscribe(ElementFinderByPath.findElementByPathCommand, this.onfindElementByPath);
    }

    protected onfindElementByPath = (
        message: ElementFinderByPathMessage,
        error: ErrorMessageContent,
        sourceWin: Window,
        responder?: FrameMessageResponseCallback,
    ): void => {
        this.processRequest(message).then(
            result => {
                responder(result, null, sourceWin);
            },
            err => {
                responder(null, err, sourceWin);
            },
        );
    };

    public processRequest = (message: ElementFinderByPathMessage): Q.IPromise<string> => {
        const element = this.htmlElementUtils.querySelector(message.path[0]) as HTMLElement;

        const deferred = this.q.defer<string>();

        if (element == null) {
            deferred.resolve('error');
            return deferred.promise;
        }

        if (element.tagName.toLocaleLowerCase() !== 'iframe' && message.path.length > 1) {
            deferred.resolve('error');
            return deferred.promise;
        }

        if (element.tagName.toLocaleLowerCase() !== 'iframe' && message.path.length === 1) {
            const response = element ? element.outerHTML : 'error';
            deferred.resolve(response);
            return deferred.promise;
        }

        message.path.shift();

        this.frameCommunicator
            .sendMessage<ElementFinderByPathMessage, string>({
                command: ElementFinderByPath.findElementByPathCommand,
                frame: element as HTMLIFrameElement,
                message: {
                    path: message.path,
                } as ElementFinderByPathMessage,
            })
            .then(
                result => {
                    deferred.resolve(result);
                },
                err => {
                    deferred.resolve('error');
                },
            );
        return deferred.promise;
    };
}
