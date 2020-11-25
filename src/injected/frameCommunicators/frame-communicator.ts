// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Q from 'q';
import { HTMLElementUtils } from '../../common/html-element-utils';
import { Logger } from '../../common/logging/logger';
import { ErrorMessageContent } from './error-message-content';
import { FrameMessageResponseCallback, WindowMessageHandler } from './window-message-handler';

export interface MessageRequest<T> {
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

    constructor(
        protected windowMessageHandler: WindowMessageHandler,
        protected htmlElementUtils: HTMLElementUtils,
        private q: typeof Q,
        private logger: Logger,
    ) {
        this.window = window;
        this.document = document;
    }

    public initialize(): void {
        if (!this.initialized) {
            this.initialized = true;

            this.subscribe(
                FrameCommunicator.PingCommand,
                (
                    result: any | undefined,
                    error: ErrorMessageContent | undefined,
                    messageSourceWindow: Window,
                    responder?: FrameMessageResponseCallback,
                ) => {
                    this.invokeMethodIfExists(responder, result);
                },
            );

            this.subscribe(
                FrameCommunicator.DisposeCommand,
                (
                    result: any | undefined,
                    error: ErrorMessageContent | undefined,
                    messageSourceWindow: Window,
                    responder?: FrameMessageResponseCallback,
                ) => {
                    this.dispose().then(() => {
                        this.invokeMethodIfExists(responder, result);
                    });
                },
            );
        }
    }

    public dispose(): Q.IPromise<Q.PromiseState<FrameMessageResponseCallback>[]> {
        const allframes = this.getAllFrames();
        const framesLength = allframes.length;
        const frameMessageRequests: MessageRequest<null>[] = [];

        for (let i = 0; i < framesLength; i++) {
            frameMessageRequests.push({
                command: FrameCommunicator.DisposeCommand,
                frame: allframes[i],
            } as MessageRequest<null>);
        }

        const promise = this.executeRequestForAllFrameRequests(
            frameMessageRequests,
            FrameCommunicator.disposeTimeout,
        );
        promise.then(() => {
            this.windowMessageHandler.dispose();
        });

        return promise;
    }

    public subscribe(command: string, callback: FrameMessageResponseCallback): void {
        this.windowMessageHandler.addSubscriber(command, callback);
    }

    public sendMessage<TMessage, TResponse>(
        messageRequest: MessageRequest<TMessage>,
    ): Q.IPromise<TResponse> {
        const win = messageRequest.win
            ? messageRequest.win
            : this.htmlElementUtils.getContentWindow(messageRequest.frame);
        const defered = this.q.defer<TResponse>();
        const elementToReportOnFailure = messageRequest.win
            ? messageRequest.win
            : messageRequest.frame;

        if (win == null) {
            this.logger.log('cannot get content window for ', elementToReportOnFailure);
            defered.reject(null);
            return defered.promise;
        }

        if (messageRequest.frame && !this.doesFrameSupportScripting(messageRequest.frame)) {
            this.logger.log('cannot connect to sandboxed frame', messageRequest.frame);
            defered.reject('cannot connect to sandboxed frame' + messageRequest.frame);
            return defered.promise;
        } else {
            // give the window / frame .5s to respond to 'insights.ping', else log failed response
            const pingDeferred = this.q.defer<boolean>();

            // send 'insights.ping' to the window / frame
            this.windowMessageHandler.post(win, FrameCommunicator.PingCommand, null, () =>
                pingDeferred.resolve(true),
            );
            const timeoutPingPromise = this.q.timeout(pingDeferred.promise, 500);

            timeoutPingPromise.then(
                () => {
                    this.windowMessageHandler.post(
                        win,
                        messageRequest.command,
                        messageRequest.message,
                        data => {
                            if (data instanceof Error) {
                                defered.reject(data);
                            } else {
                                defered.resolve(data);
                            }
                        },
                    );
                },
                () => {
                    this.logger.log('cannot connect to ', elementToReportOnFailure);
                    defered.reject('cannot connect to ' + elementToReportOnFailure);
                },
            );
        }
        return this.q.timeout(defered.promise, FrameCommunicator.minWaitTimeForAllFrameResponse);
    }

    private doesFrameSupportScripting(frame: HTMLIFrameElement): boolean {
        return (
            !frame.hasAttribute('sandbox') ||
            frame.getAttribute('sandbox')!.toLocaleLowerCase().lastIndexOf('allow-scripts') >= 0
        );
    }

    public executeRequestForAllFrameRequests<T>(
        frameMessageRequests: MessageRequest<T>[],
        timeOut: number,
    ): Q.IPromise<Q.PromiseState<FrameMessageResponseCallback>[]> {
        const frameMessageRequestsLength = frameMessageRequests.length;

        const frameRequestPromises: Q.IPromise<FrameMessageResponseCallback>[] = [];

        for (let i = 0; i < frameMessageRequestsLength; i++) {
            frameRequestPromises.push(this.sendMessage(frameMessageRequests[i]));
        }

        const promise = this.q.allSettled(frameRequestPromises);

        return this.q.timeout(promise, timeOut);
    }

    private invokeMethodIfExists(method?: Function, data?: any): void {
        if (method) {
            method(data);
        }
    }

    private getAllFrames(): HTMLCollectionOf<HTMLIFrameElement> {
        return this.htmlElementUtils.getAllElementsByTagName(
            'iframe',
        ) as HTMLCollectionOf<HTMLIFrameElement>;
    }
}
