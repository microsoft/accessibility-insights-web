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

// This class provides functionality for messaging all frames in a page that can
// respond, to handle cases where an iframe fails to load or does not have the
// script injected.
// On initialize(), we ping every frame and store a list of the frames that
// respond within 500ms. sendCommandToFrames only messages the frames that
// responded to the initial ping.
export class AllFrameMessenger {
    private responsiveFrames: HTMLIFrameElement[] | null = null;

    constructor(
        private readonly singleFrameMessenger: SingleFrameMessenger,
        private readonly htmlElementUtils: HTMLElementUtils,
        private readonly promiseFactory: PromiseFactory,
        private readonly logger: Logger,
        private readonly mergePromises: (
            promises: Promise<unknown>[],
        ) => Promise<void> = mergePromiseResponses,
        private readonly pingCommand: string = 'insights.pingFrame',
        private readonly pingTimeoutMilliseconds: number = 500,
    ) {
        this.addMessageListener(this.pingCommand, async () => {
            await this.findResponsiveFrames();
            return null;
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

    public async initialize(): Promise<void> {
        await this.findResponsiveFrames();
    }

    public async sendCommandToFrames(command: string): Promise<void> {
        if (this.responsiveFrames == null) {
            throw new Error('AllFrameMessenger is not initialized.');
        }

        const promises: Promise<unknown>[] = this.responsiveFrames.map(frame =>
            this.singleFrameMessenger.sendMessageToFrame(frame, {
                command,
            }),
        );
        await this.mergePromises(promises);
    }

    private async findResponsiveFrames(): Promise<void> {
        const allIFrameElements = this.htmlElementUtils.getAllElementsByTagName(
            'iframe',
        ) as HTMLCollectionOf<HTMLIFrameElement>;

        if (allIFrameElements.length === 0) {
            this.responsiveFrames = [];
            return;
        }

        const promises: Promise<unknown>[] = [];
        for (let i = 0; i < allIFrameElements.length; i++) {
            promises.push(
                this.promiseFactory.timeout(
                    this.singleFrameMessenger.sendMessageToFrame(allIFrameElements[i], {
                        command: this.pingCommand,
                    }),
                    this.pingTimeoutMilliseconds,
                ),
            );
        }

        const results = await Promise.allSettled(promises);
        this.responsiveFrames = [];
        let allFramesSucceeded = true;

        results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                this.responsiveFrames!.push(allIFrameElements[index]);
            } else {
                allFramesSucceeded = false;
                const error = (result as PromiseRejectedResult).reason;
                // We expect timeout errors if the frame message fails to send.
                // Throw if the error is anything else.
                if (!(error instanceof TimeoutError)) {
                    throw error;
                }
            }
        });

        if (!allFramesSucceeded) {
            this.logger.error(
                `Some iframes could not be reached within ${this.pingTimeoutMilliseconds} milliseconds. Those frames will be ignored.`,
            );
        }
    }
}
