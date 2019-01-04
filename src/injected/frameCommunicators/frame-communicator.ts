// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Q from 'q';

import { HTMLElementUtils } from '../../common/html-element-utils';
import { WindowUtils } from '../../common/window-utils';
import { FrameMessageResponseCallback, WindowMessageHandler } from './window-message-handler';
import { IErrorMessageContent } from './window-message-marshaller';

export interface IMessageRequest<T> {
    frame?: HTMLIFrameElement;
    win?: Window;
    command: string;
    message?: T;
}

export class FrameCommunicator {
    public static PingCommand = 'insights.ping';
    public static DisposeCommand = 'insights.dispose';
    public static minWaitTimeForAllFrameResponse = 10e4;
    public static disposeTimeout = 1e4;

    protected window: Window;
    protected document: Document;
    protected initialized: boolean;
    protected htmlElementUtils: HTMLElementUtils;
    protected windowMessageHandler: WindowMessageHandler;
    protected windowUtils: WindowUtils;
    private _q: typeof Q;

    constructor(windowMessageHandler: WindowMessageHandler, htmlElementUtils: HTMLElementUtils, windowUtils: WindowUtils, q: typeof Q) {
        this.window = window;
        this.document = document;
        this.htmlElementUtils = htmlElementUtils;
        this.windowMessageHandler = windowMessageHandler;
        this.windowUtils = windowUtils;
        this._q = q;
    }

    public initialize(): void {
        if (!this.initialized) {
            this.initialized = true;

            this.subscribe(FrameCommunicator.PingCommand, (data: any, error: IErrorMessageContent, messageSourceWindow: Window, callback: Function) => {
                this.invokeMethodIfExists(callback, data);
            });

            this.subscribe(FrameCommunicator.DisposeCommand, (data: any, error: IErrorMessageContent, messageSourceWindow: Window, callback: Function) => {
                this.dispose().then(() => {
                    this.invokeMethodIfExists(callback, data);
                });
            });
        }
    }

    public dispose(): Q.IPromise<Q.PromiseState<FrameMessageResponseCallback>[]> {
        const allframes = this.getAllFrames();
        const framesLength = allframes.length;
        const frameMessageRequests: IMessageRequest<null>[] = [];

        for (let i = 0; i < framesLength; i++) {
            frameMessageRequests.push({
                command: FrameCommunicator.DisposeCommand,
                frame: allframes[i],
            } as IMessageRequest<null>);
        }

        const promise = this.executeRequestForAllFrameRequests(frameMessageRequests, FrameCommunicator.disposeTimeout);
        promise.then(() => {
            this.windowMessageHandler.dispose();
        });

        return promise;
    }

    public subscribe(command: string, callback: FrameMessageResponseCallback): void {
        this.windowMessageHandler.addSubscriber(command, callback);
    }

    public sendMessage<TMessage, TResponse>(messageRequest: IMessageRequest<TMessage>): Q.IPromise<TResponse> {
        const win = messageRequest.win ? messageRequest.win : this.htmlElementUtils.getContentWindow(messageRequest.frame);
        const defered = this._q.defer<TResponse>();
        const elementToReportOnFailure = messageRequest.win ? messageRequest.win : messageRequest.frame;

        if (win == null) {
            console.log('cannot get content window for ', elementToReportOnFailure);
            defered.reject(null);
            return defered.promise;
        }

        if (messageRequest.frame && !this.doesFrameSupportScripting(messageRequest.frame)) {
            console.log('cannot connect to sandboxed frame', messageRequest.frame);
            defered.reject('cannot connect to sandboxed frame' + messageRequest.frame);
            return defered.promise;
        }
        else {
            // give the window / frame .5s to respond to 'insights.ping', else log failed response
            const pingDeferred = this._q.defer<boolean>();

            // send 'insights.ping' to the window / frame
            this.windowMessageHandler.post(win, FrameCommunicator.PingCommand, null, () => pingDeferred.resolve(true));
            const timeoutPingPromise = this._q.timeout(pingDeferred.promise, 500);

            timeoutPingPromise.then(() => {
                this.windowMessageHandler.post(win, messageRequest.command, messageRequest.message, data => {

                    if (data instanceof Error) {
                        defered.reject(data);
                    } else {
                        defered.resolve(data);
                    }
                });
            }, () => {
                console.log('cannot connect to ', elementToReportOnFailure);
                defered.reject('cannot connect to ' + elementToReportOnFailure);
            });
        }
        return this._q.timeout(defered.promise, FrameCommunicator.minWaitTimeForAllFrameResponse);
    }

    private doesFrameSupportScripting(frame: HTMLIFrameElement) {
        return !frame.hasAttribute('sandbox') || frame.getAttribute('sandbox').toLocaleLowerCase().lastIndexOf('allow-scripts') >= 0;
    }

    public executeRequestForAllFrameRequests<T>(
        frameMessageRequests: IMessageRequest<T>[],
        timeOut: number): Q.IPromise<Q.PromiseState<FrameMessageResponseCallback>[]> {
        const frameMessageRequestsLength = frameMessageRequests.length;

        const frameRequestPromises: Q.IPromise<FrameMessageResponseCallback>[] = [];

        for (let i = 0; i < frameMessageRequestsLength; i++) {
            frameRequestPromises.push(this.sendMessage(frameMessageRequests[i]));
        }

        const promise = this._q.allSettled(frameRequestPromises);

        return this._q.timeout(promise, timeOut);
    }

    private invokeMethodIfExists(method: Function, data?: any): void {
        if (method) {
            method(data);
        }
    }

    private getAllFrames(): NodeListOf<HTMLIFrameElement> {
        return this.htmlElementUtils.getAllElementsByTagName('iframe') as NodeListOf<HTMLIFrameElement>;
    }
}
