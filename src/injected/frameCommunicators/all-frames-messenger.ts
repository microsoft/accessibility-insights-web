// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { HTMLElementUtils } from 'common/html-element-utils';
import { Logger } from 'common/logging/logger';
import { mergePromiseResponses } from 'common/merge-promise-responses';
import { PromiseFactory, TimeoutError } from 'common/promises/promise-factory';
import {
    CommandMessage,
    CommandMessageResponse,
    PromiseWindowCommandMessageListener,
} from 'injected/frameCommunicators/respondable-command-message-communicator';
import { SingleFrameMessenger } from 'injected/frameCommunicators/single-frame-messenger';
import { isEqual } from 'lodash';

// This class provides functionality for messaging all frames in a page that can
// respond, to handle cases where an iframe fails to load or does not have the
// script injected.
// On initialize(), we ping every frame and store a list of the frames that
// respond within 500ms. sendCommandToFrames only messages the frames that
// responded to the initial ping.
export class AllFramesMessenger {
    private responsiveFrames: HTMLIFrameElement[] | null = null;
    private readonly pingResponse: CommandMessageResponse = {
        payload: {
            status: 'ready',
        },
    };

    constructor(
        private readonly singleFrameMessenger: SingleFrameMessenger,
        private readonly htmlElementUtils: HTMLElementUtils,
        private readonly promiseFactory: PromiseFactory,
        private readonly logger: Logger,
        private readonly mergePromises: (
            promises: Promise<unknown>[],
        ) => Promise<void> = mergePromiseResponses,
        private readonly pingCommand: string = 'insights.pingFrame',
        private readonly pingTimeoutMilliseconds: number = 1000,
    ) {
        this.addMessageListener(this.pingCommand, async () => {
            await this.findResponsiveFrames();
            return this.pingResponse;
        });
    }

    public addMessageListener(
        command: string,
        listener: PromiseWindowCommandMessageListener,
    ): void {
        this.singleFrameMessenger.addMessageListener(command, listener);
    }

    public async sendMessageToWindow(
        targetWindow: Window,
        message: CommandMessage,
    ): Promise<CommandMessageResponse> {
        return this.singleFrameMessenger.sendMessageToWindow(targetWindow, message);
    }

    public async initializeAllFrames(): Promise<void> {
        await this.findResponsiveFrames();
    }

    public async sendCommandToAllFrames(command: string, payload?: any): Promise<void> {
        this.validateInitialized();

        const promises: Promise<unknown>[] = this.responsiveFrames!.map(frame =>
            this.singleFrameMessenger.sendMessageToFrame(frame, {
                command,
                payload,
            }),
        );
        await this.mergePromises(promises);
    }

    public async sendCommandToMultipleFrames(
        command: string,
        frames: HTMLIFrameElement[],
        getPayload?: (frame: HTMLIFrameElement, index: number) => any,
    ): Promise<void> {
        this.validateInitialized();

        const promises: Promise<unknown>[] = frames.map(async (frame, index) => {
            if (this.responsiveFrames!.includes(frame)) {
                await this.singleFrameMessenger.sendMessageToFrame(frame, {
                    command,
                    payload: getPayload?.(frame, index),
                });
            }
        });
        await this.mergePromises(promises);
    }

    private validateInitialized(): void {
        if (this.responsiveFrames == null) {
            throw new Error('AllFramesMessenger is not initialized.');
        }
    }

    private async findResponsiveFrames(): Promise<void> {
        const allIFrameElements = this.htmlElementUtils.getAllElementsByTagName(
            'iframe',
        ) as HTMLCollectionOf<HTMLIFrameElement>;

        if (allIFrameElements.length === 0) {
            this.responsiveFrames = [];
            return;
        }

        const pingResults = await this.pingFramesAndGetResults(allIFrameElements);

        this.processPingResults(pingResults, allIFrameElements);
    }

    private pingFramesAndGetResults(
        iframes: HTMLCollectionOf<HTMLIFrameElement>,
    ): Promise<PromiseSettledResult<unknown>[]> {
        const promises: Promise<unknown>[] = Object.entries(iframes).map(([_key, value]) =>
            this.promiseFactory.timeout(
                this.singleFrameMessenger.sendMessageToFrame(value, {
                    command: this.pingCommand,
                }),
                this.pingTimeoutMilliseconds,
            ),
        );

        return Promise.allSettled(promises);
    }

    private processPingResults(
        pingResults: PromiseSettledResult<unknown>[],
        allIFrameElements: HTMLCollectionOf<HTMLIFrameElement>,
    ): void {
        this.responsiveFrames = [];
        const timeoutErrors: TimeoutError[] = [];
        const unexpectedErrors: Error[] = [];

        pingResults.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                const response = (result as PromiseFulfilledResult<CommandMessageResponse>).value;
                if (isEqual(response, this.pingResponse)) {
                    this.responsiveFrames!.push(allIFrameElements[index]);
                } else {
                    const error = new Error(
                        `Recieved unexpected value for ping response: ${JSON.stringify(response)}`,
                    );
                    unexpectedErrors.push(error);
                }
            } else {
                const error = (result as PromiseRejectedResult).reason;
                if (error instanceof TimeoutError) {
                    timeoutErrors.push(error);
                } else {
                    unexpectedErrors.push(error);
                }
            }
        });

        // Timeouts are expected to happen occasionally, so we log and continue execution
        if (timeoutErrors.length > 0) {
            this.logger.error(
                `Some iframes could not be reached within ${this.pingTimeoutMilliseconds} milliseconds. Those frames will be ignored.`,
                timeoutErrors,
            );
        }

        if (unexpectedErrors.length > 0) {
            throw new AggregateError(unexpectedErrors);
        }
    }
}
