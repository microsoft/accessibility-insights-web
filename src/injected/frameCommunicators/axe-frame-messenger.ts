// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import type * as axe from 'axe-core';
import { Logger } from 'common/logging/logger';
import { WindowUtils } from 'common/window-utils';
import {
    CommandMessage,
    CommandMessageResponse,
    RespondableCommandMessageCommunicator,
    CallbackWindowCommandMessageListener,
} from './respondable-command-message-communicator';

const postCommand = 'axe.frameMessenger.post';
type PostCommandRequestPayload = axe.TopicData;
type PostCommandResponsePayload =
    | { type: 'success'; message: any; keepalive: boolean }
    | { type: 'error' };

// AxeFrameMessenger is an axe-core axe.frameMessenger-compatible version of our FrameMessenger
export class AxeFrameMessenger implements axe.FrameMessenger {
    private topicHandlers: axe.TopicHandler[] = [];

    constructor(
        private readonly underlyingCommunicator: RespondableCommandMessageCommunicator,
        private readonly windowUtils: WindowUtils,
        private readonly logger: Logger,
    ) {}

    public registerGlobally(axeInstance: typeof axe) {
        // "as any" should be removed when replacing axe421.* with axe.*
        axeInstance.frameMessenger(this as any);
    }

    public open = (topicHandler: axe.TopicHandler): axe.Close => {
        if (this.topicHandlers.length === 0) {
            this.underlyingCommunicator.addCallbackCommandMessageListener(
                postCommand,
                this.onMessage,
            );
        }
        this.topicHandlers.push(topicHandler);
        return () => this.close(topicHandler);
    };

    public close = (topicHandler: axe.TopicHandler) => {
        this.topicHandlers = this.topicHandlers.filter(h => h !== topicHandler);
        if (this.topicHandlers.length === 0) {
            this.underlyingCommunicator.removeCommandMessageListener(postCommand);
        }
    };

    public post = (
        frameWindow: Window,
        topicData: axe.TopicData,
        replyHandler: axe.ReplyHandler,
    ): boolean => {
        const payload: PostCommandRequestPayload = topicData;
        const message: CommandMessage = { command: postCommand, payload };

        const replyToReplyCallback: axe.Responder = () => {
            // As of 4.2.1, axe-core is documented as not using replies to replies, and we don't
            // use any axe-core plugins that might require this.
            this.logger.error(
                'AxeFrameMessenger does not support replies-to-replies, but a post replyHandler invoked a responder.',
                new Error(),
            );
        };

        const responseCallback = async (response: CommandMessageResponse): Promise<void> => {
            const payload: PostCommandResponsePayload = response.payload;
            // This behavior of passing an Error object if the respondee throws an error is missing
            // from the axe-core frame-messenger documentation, but it matches the default axe-core
            // behavior.
            const messageOrError: any | Error =
                payload.type === 'success'
                    ? payload.message
                    : new Error('An axe-core error occurred in a child frame.');

            const keepalive = payload.type === 'success' ? payload.keepalive : false;

            try {
                replyHandler(messageOrError, keepalive, replyToReplyCallback);
            } catch (e) {
                // We intentionally omit the original error message/stack because it could feasibly
                // contain information from the child frame, which we wouldn't want to leak to this
                // frame's console.
                this.logger.error(
                    'An axe-core error occurred while processing a result from a child frame.',
                    new Error(),
                );
            }
        };

        // Float this promise to keep function synchronous and match axe's interface.
        // This means that we can't catch errors and return false to short-circuit axe's
        // polling mechanism if this message fails, but axe should still time out and
        // handle the failure.
        void this.underlyingCommunicator
            .sendCallbackCommandMessage(
                frameWindow,
                message,
                responseCallback,
                // Usage for keepAlive is missing from the axe-core frame-messenger documentation,
                // but this behavior matches the default axe-core frame messenger.
                topicData.keepalive ? 'multiple' : 'single',
            )
            .catch(e =>
                this.logger.error(
                    `Error while attempting to send axe-core frameMessenger message: ${e.message}`,
                    e,
                ),
            );

        return true;
    };

    public onMessage: CallbackWindowCommandMessageListener = (
        receivedMessage: CommandMessage,
        sourceWindow: Window,
        commandMessageResponder: (response: CommandMessageResponse) => void,
    ): void => {
        if (sourceWindow !== this.windowUtils.getParentWindow()) {
            this.logger.error(
                'Received unexpected axe-core message from a non-parent window',
                new Error(),
            );
            return;
        }

        const receivedPayload: PostCommandRequestPayload = receivedMessage.payload;
        const topicData: axe.TopicData = receivedPayload;
        const topicResponder: axe.Responder = (
            message: any,
            keepalive?: boolean,
            replyHandler?: axe.ReplyHandler,
        ): void => {
            if (replyHandler != null) {
                // As of 4.2.1, axe-core is documented as not using replies to replies, and we don't
                // use any axe-core plugins that might require this.
                this.logger.error(
                    'AxeFrameMessenger does not support replies-to-replies, but a topicHandler provided a replyHandler in a response callback.',
                    new Error(),
                );
            }
            const responsePayload: PostCommandResponsePayload = {
                type: 'success',
                message,
                keepalive: keepalive ?? false,
            };
            const responseMessage: CommandMessageResponse = { payload: responsePayload };
            commandMessageResponder(responseMessage);
        };

        for (const topicHandler of this.topicHandlers) {
            try {
                topicHandler(topicData, topicResponder);
            } catch (e) {
                // intentionally omitting the original error message/stack here, since it would get
                // passed to axe-core and logged to the console, which could leak information across
                // a cross-origin boundary.
                const responsePayload: PostCommandResponsePayload = { type: 'error' };
                const responseMessage: CommandMessageResponse = { payload: responsePayload };
                commandMessageResponder(responseMessage);
            }
        }
    };
}
