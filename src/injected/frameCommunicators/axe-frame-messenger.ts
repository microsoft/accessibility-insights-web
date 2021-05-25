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

// These are the corrected typings from https://github.com/dequelabs/axe-core/pull/2885, which
// didn't quite make the axe-core 4.2.1 release. They can be replaced with axe.* typings once
// https://github.com/dequelabs/axe-core/pull/2885 merges and releases.
namespace axe2885 {
    export type FrameMessenger = {
        open: (topicHandler: TopicHandler) => Close | void;
        post: (frameWindow: Window, data: TopicData, replyHandler: ReplyHandler) => boolean | void;
    };
    export type Close = Function;
    export type TopicHandler = (data: TopicData, responder: Responder) => void;
    export type ReplyHandler = (
        message: any | Error,
        keepalive: boolean,
        responder: Responder,
    ) => void;
    export type Responder = (
        message: any | Error,
        keepalive?: boolean,
        replyHandler?: ReplyHandler,
    ) => void;
    export type TopicData = { topic: String } & ReplyData;
    export type ReplyData = { channelId: String; message: any; keepalive: boolean };
}

const postCommand = 'axe.frameMessenger.post';
type PostCommandRequestPayload = axe2885.TopicData;
type PostCommandResponsePayload =
    | { type: 'success'; message: any; keepalive: boolean }
    | { type: 'error' };

// AxeFrameMessenger is an axe-core axe.frameMessenger-compatible version of our FrameMessenger
export class AxeFrameMessenger implements axe2885.FrameMessenger {
    private topicHandlers: axe2885.TopicHandler[] = [];

    constructor(
        private readonly underlyingCommunicator: RespondableCommandMessageCommunicator,
        private readonly windowUtils: WindowUtils,
        private readonly logger: Logger,
    ) {}

    public registerGlobally(axeInstance: typeof axe) {
        // "as any" should be removed when replacing axe421.* with axe.*
        axeInstance.frameMessenger(this as any);
    }

    public open = (topicHandler: axe2885.TopicHandler): axe2885.Close => {
        if (this.topicHandlers.length === 0) {
            this.underlyingCommunicator.addCallbackCommandMessageListener(
                postCommand,
                this.onMessage,
            );
        }
        this.topicHandlers.push(topicHandler);
        return () => this.close(topicHandler);
    };

    public close = (topicHandler: axe2885.TopicHandler) => {
        this.topicHandlers = this.topicHandlers.filter(h => h !== topicHandler);
        if (this.topicHandlers.length === 0) {
            this.underlyingCommunicator.removeCommandMessageListener(postCommand);
        }
    };

    public post = (
        frameWindow: Window,
        topicData: axe2885.TopicData,
        replyHandler: axe2885.ReplyHandler,
    ): boolean => {
        const payload: PostCommandRequestPayload = topicData;
        const message: CommandMessage = { command: postCommand, payload };

        const replyToReplyCallback: axe2885.Responder = () => {
            // As of 4.2.1, axe-core is documented as not using replies to replies, and we don't
            // use any axe-core plugins that might require this.
            this.logger.error(
                'AxeFrameMessenger does not support replies-to-replies, but a post replyHandler invoked a responder.',
            );
        };

        const responseCallback = (response: CommandMessageResponse): void => {
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
                );
            }
        };

        try {
            this.underlyingCommunicator.sendCallbackCommandMessage(
                frameWindow,
                message,
                responseCallback,
                // Usage for keepAlive is missing from the axe-core frame-messenger documentation,
                // but this behavior matches the default axe-core frame messenger.
                topicData.keepalive ? 'multiple' : 'single',
            );
            return true;
        } catch (e) {
            this.logger.error(
                `Error while attempting to send axe-core frameMessenger message: ${e.message}`,
                e,
            );
            return false;
        }
    };

    public onMessage: CallbackWindowCommandMessageListener = (
        receivedMessage: CommandMessage,
        sourceWindow: Window,
        commandMessageResponder: (response: CommandMessageResponse) => void,
    ): void => {
        if (sourceWindow !== this.windowUtils.getParentWindow()) {
            this.logger.error('Received unexpected axe-core message from a non-parent window');
            return;
        }

        const receivedPayload: PostCommandRequestPayload = receivedMessage.payload;
        const topicData: axe2885.TopicData = receivedPayload;
        const topicResponder: axe2885.Responder = (
            message: any,
            keepalive?: boolean,
            replyHandler?: axe2885.ReplyHandler,
        ): void => {
            if (replyHandler != null) {
                // As of 4.2.1, axe-core is documented as not using replies to replies, and we don't
                // use any axe-core plugins that might require this.
                this.logger.error(
                    'AxeFrameMessenger does not support replies-to-replies, but a topicHandler provided a replyHandler in a response callback.',
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
