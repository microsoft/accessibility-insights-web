// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Logger } from 'common/logging/logger';
import { PromiseFactory, TimeoutError } from 'common/promises/promise-factory';
import { WindowMessagePoster } from 'injected/frameCommunicators/browser-backchannel-window-message-poster';

export type CommandMessage = {
    command: string;
    payload?: any;
};

export type CommandMessageResponse = {
    // if payload is null, this means that there is nothing in this response message
    payload: any;
};

export type CommandMessageResponseCallback = (response: CommandMessageResponse) => void;

// A listener may optionally respond to a message it receives. If it wishes to do so, it should
// return a Promise which resolves to the response. If it does not wish to respond to a message,
// it will return a Promise that resolves to null.
export type PromiseWindowCommandMessageListener = (
    receivedMessage: CommandMessage,
    sourceWindow: Window,
) => Promise<CommandMessageResponse | null>;

export type CallbackWindowCommandMessageListener = (
    receivedMessage: CommandMessage,
    sourceWindow: Window,
    // When the listener has finished its word and determined a response, it should invoke this
    // responseCallback. That will result in the corresponding sendCallbackCommandMessage's
    // replyHandler being called.
    responseCallback: CommandMessageResponseCallback,
) => void;

type WindowCommandMessageListenerRegistration =
    | {
          type: 'callback';
          listener: CallbackWindowCommandMessageListener;
      }
    | {
          type: 'promise';
          listener: PromiseWindowCommandMessageListener;
      };

type CommandMessageRequestWrapper = {
    type: 'CommandMessageRequest';
    commandMessageId: string; // not the same as the window message's messageId!
    command: string;
    payload?: any;
};

type CommandMessageResponseWrapper = {
    type: 'CommandMessageResponse';
    requestCommandMessageId: string; // corresponds to the request's commandMessageId. Not related to the window message's messageId!
    payload: any;
};

// RespondableCommandMessageCommunicator is responsible for:
// * assigning listeners to commands (each command can only have one)
// * assigning command message requests a unique commandMessageId and posting them to the window
// * associating pending response callbacks to command requests using the new commandMessageId
// * sending command response to pending response callbacks when a response is received from the window
//
// FrameMessenger and AxeFrameMessenger use a RespondableCommandMessageCommunicator to coordinate
// commands between target page frames.
export class RespondableCommandMessageCommunicator {
    // Single-use responseCallbacks are responsible for unregistering themselves when called.
    private responseCallbacks: {
        [requestMessageId: string]: CommandMessageResponseCallback;
    } = {};
    private listenersByCommand: {
        [command: string]: WindowCommandMessageListenerRegistration;
    } = {};

    // This needs to be long enough to consistently allow for a big, slow page to finish loading our
    // injected bundle, run our initializer, and allow for several round trips to the background
    // page (there will be 2 per nested iframe), even on a slow VM.
    public static promiseResponseTimeoutMilliseconds = 30000;

    constructor(
        private readonly windowMessagePoster: WindowMessagePoster,
        private readonly generateUIDFunc: () => string,
        private readonly promiseFactory: PromiseFactory,
        private readonly logger: Logger,
    ) {}

    public initialize() {
        this.windowMessagePoster.addMessageListener(this.onWindowMessage);
    }

    // Sends a message to a corresponding listener in the target Window, which must have been
    // previously registered using addCallbackCommandMessageListener in that Window. The provided
    // responseCallback will be invoked if and when the corresponding listener invokes the
    // corresponding responseCallback passed to it in the target Window.
    //
    // If allowMultipleResponses is specified, this will be allowed to happen multiple times. This
    // capability is required per axe-core's frameMessenger documentation, but it should only be
    // used if actually necessary, since there is currently no way for the communicator to know when
    // it's allowed to stop listening for further responses.
    public sendCallbackCommandMessage(
        target: Window,
        commandMessage: CommandMessage,
        responseCallback: (response: CommandMessageResponse) => void,
        responsesExpected: 'single' | 'multiple',
    ): void {
        const commandMessageRequestWrapper =
            this.createCommandMessageRequestWrapper(commandMessage);
        const messageId = commandMessageRequestWrapper.commandMessageId;

        let recordedResponseCallback = responseCallback;
        if (responsesExpected === 'single') {
            recordedResponseCallback = response => {
                delete this.responseCallbacks[messageId];
                responseCallback(response);
            };
        }

        this.responseCallbacks[messageId] = recordedResponseCallback;
        this.windowMessagePoster.postMessage(target, commandMessageRequestWrapper);
    }

    // Sends a message to a corresponding listener in the target Window, which must have been
    // previously registered using addPromiseCommandMessageListener in that Window. The returned
    // Promise will resolve if and when the corresponding listener in the target Window resolves.
    //
    // Unlike sendCallbackCommandMessage, this method has a timeout built in (see
    // RespondableCommandMessageCommunicator.promiseResponseTimeoutMilliseconds)
    public async sendPromiseCommandMessage(
        target: Window,
        commandMessage: CommandMessage,
    ): Promise<CommandMessageResponse> {
        let timedOut = false;

        // This creates a "deferred" Promise which we will resolved later in onWindowMessage (by
        // calling the resolver function we're storing in pendingResponseResolvers) when we receive
        // a matching response from the windowMessagePoster.
        let pendingResponseResolver: CommandMessageResponseCallback;
        const pendingResponsePromise = new Promise<CommandMessageResponse>(resolver => {
            pendingResponseResolver = resolver;
        });

        const responseCallback = (response: CommandMessageResponse) => {
            if (timedOut) {
                this.logger.error(
                    `Received a response for command ${commandMessage.command} after it timed out`,
                );
            }
            pendingResponseResolver(response);
        };

        this.sendCallbackCommandMessage(target, commandMessage, responseCallback, 'single');

        try {
            return await this.promiseFactory.timeout(
                pendingResponsePromise,
                RespondableCommandMessageCommunicator.promiseResponseTimeoutMilliseconds,
            );
        } catch (e) {
            // Timeout is the only option here; we never use (or store) the reject callback from
            // pendingResponsePromise
            timedOut = true;
            throw new TimeoutError(
                'Timed out attempting to establish communication with target window. ' +
                    'Is there a script inside it intercepting window messages? ' +
                    `Underlying error: ${e.message}`,
            );
        }
    }

    // Registers a listener that will be invoked when other Windows make corresponding
    // sendPromiseCommandMessage invocations. Each time such a message is sent, the listener will be
    // called. The response the listener resolves with will become the value that the corresponding
    // sendPromiseCommandMessage call in the other Window resolves with.
    public addPromiseCommandMessageListener(
        command: string,
        listener: PromiseWindowCommandMessageListener,
    ): void {
        this.addCommandMessageListener(command, { type: 'promise', listener: listener });
    }

    // Registers a listener that will be invoked when other Windows make corresponding
    // sendCallbackCommandMessage invocations. Each time such a message is sent, the listener will
    // be called with a new responseCallback. Each time the listener invokes that responseCallback,
    // the corresponding responseCallback that was passed to sendCallbackCommandMessage in the other
    // Window will be invoked with the same response.
    public addCallbackCommandMessageListener(
        command: string,
        listener: CallbackWindowCommandMessageListener,
    ): void {
        this.addCommandMessageListener(command, { type: 'callback', listener: listener });
    }

    public removeCommandMessageListener(command: string): void {
        delete this.listenersByCommand[command];
    }

    private addCommandMessageListener(
        command: string,
        listener: WindowCommandMessageListenerRegistration,
    ): void {
        if (this.listenersByCommand[command] != null) {
            throw new Error(`Cannot register two listeners for the same command (${command})`);
        }
        this.listenersByCommand[command] = listener;
    }

    private onWindowMessage = async (receivedMessage: any, sourceWindow: Window): Promise<void> => {
        if (isCommandMessageRequestWrapper(receivedMessage)) {
            await this.onRequestMessage(receivedMessage, sourceWindow);
        } else if (isCommandMessageResponseWrapper(receivedMessage)) {
            await this.onResponseMessage(receivedMessage);
        }
    };

    private onResponseMessage = async (
        receivedMessage: CommandMessageResponseWrapper,
    ): Promise<void> => {
        const responseCallback = this.responseCallbacks[receivedMessage.requestCommandMessageId];
        const unwrappedResponse = { payload: receivedMessage.payload };
        await this.logErrors(`${receivedMessage.requestCommandMessageId} response callback`, () => {
            responseCallback?.(unwrappedResponse);
        });
    };

    private onRequestMessage = async (
        receivedMessage: CommandMessageRequestWrapper,
        sourceWindow: Window,
    ): Promise<void> => {
        const { command, commandMessageId } = receivedMessage;
        const unwrappedRequest: CommandMessage = {
            command: receivedMessage.command,
            payload: receivedMessage.payload,
        };
        const listener = this.listenersByCommand[command];

        const sendResponse = this.makeSendResponseCallback(commandMessageId, sourceWindow);

        if (listener == null) {
            sendResponse({ payload: null });
        } else if (listener.type === 'callback') {
            await this.logErrors(`${command} listener callback`, () =>
                listener.listener(unwrappedRequest, sourceWindow, sendResponse),
            );
        } else if (listener.type === 'promise') {
            let listenerResponse: CommandMessageResponse | null = null;
            await this.logErrors(`${command} promise listener`, async () => {
                const possibleResponsePromise = listener.listener(unwrappedRequest, sourceWindow);
                if (possibleResponsePromise instanceof Promise) {
                    listenerResponse = await possibleResponsePromise;
                }
            });
            if (listenerResponse == null) {
                listenerResponse = { payload: null };
            }
            sendResponse(listenerResponse);
        }
    };

    private async logErrors(context, operation) {
        try {
            operation();
        } catch (e) {
            this.logger.error(`Error at ${context}: ${e.message}`, e);
        }
    }

    private makeSendResponseCallback(
        requestCommandMessageId: string,
        sourceWindow: Window,
    ): CommandMessageResponseCallback {
        return (response: CommandMessageResponse) => {
            const responseWrapper = this.createCommandMessageResponseWrapper(
                requestCommandMessageId,
                response,
            );
            this.windowMessagePoster.postMessage(sourceWindow, responseWrapper);
        };
    }

    private createCommandMessageRequestWrapper(
        commandMessage: CommandMessage,
    ): CommandMessageRequestWrapper {
        const commandMessageId = this.generateUIDFunc();

        return {
            type: 'CommandMessageRequest',
            commandMessageId,
            ...commandMessage,
        };
    }

    private createCommandMessageResponseWrapper(
        commandMessageId: string,
        commandMessageResponse: CommandMessageResponse,
    ): CommandMessageResponseWrapper {
        return {
            type: 'CommandMessageResponse',
            requestCommandMessageId: commandMessageId,
            payload: commandMessageResponse.payload,
        };
    }
}

function isCommandMessageRequestWrapper(
    rawMessage: any,
): rawMessage is CommandMessageRequestWrapper {
    return (
        typeof rawMessage === 'object' &&
        rawMessage.type === 'CommandMessageRequest' &&
        typeof rawMessage.commandMessageId === 'string' &&
        typeof rawMessage.command === 'string'
    );
}

function isCommandMessageResponseWrapper(
    rawMessage: any,
): rawMessage is CommandMessageResponseWrapper {
    return (
        typeof rawMessage === 'object' &&
        rawMessage.type === 'CommandMessageResponse' &&
        typeof rawMessage.requestCommandMessageId === 'string'
    );
}
