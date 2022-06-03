// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { PromiseFactory } from 'common/promises/promise-factory';
import { BrowserBackchannelWindowMessagePoster } from 'injected/frameCommunicators/browser-backchannel-window-message-poster';
import {
    PromiseWindowCommandMessageListener,
    CallbackWindowCommandMessageListener,
    CommandMessage,
    CommandMessageResponse,
    RespondableCommandMessageCommunicator,
    CommandMessageResponseCallback,
} from 'injected/frameCommunicators/respondable-command-message-communicator';
import { failTestOnErrorLogger } from 'tests/unit/common/fail-test-on-error-logger';
import { Mock } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';

export class LinkedRespondableCommunicator extends RespondableCommandMessageCommunicator {
    public static createLinkedMockPair(): PairOf<LinkedRespondableCommunicator> {
        const first = new LinkedRespondableCommunicator(
            Mock.ofType<BrowserBackchannelWindowMessagePoster>().object,
            () => 'unique_id',
            Mock.ofType<PromiseFactory>().object,
            failTestOnErrorLogger,
        );
        const second = new LinkedRespondableCommunicator(
            Mock.ofType<BrowserBackchannelWindowMessagePoster>().object,
            () => 'unique_id',
            Mock.ofType<PromiseFactory>().object,
            failTestOnErrorLogger,
        );
        first.other = second;
        second.other = first;
        return [first, second];
    }

    public window: Window = {} as Window;
    other: LinkedRespondableCommunicator;

    public async sendPromiseCommandMessage(
        target: Window,
        commandMessage: CommandMessage,
    ): Promise<CommandMessageResponse> {
        this.assertIsLinkedWindow(target);
        const listener = this.other.asyncListeners[commandMessage.command];
        this.assertListenerExists(listener, commandMessage.command);

        const listenerResponse = await this.other.asyncListeners[commandMessage.command](
            commandMessage,
            this.window,
        );
        return listenerResponse ?? { payload: null };
    }

    public async sendCallbackCommandMessage(
        target: Window,
        commandMessage: CommandMessage,
        responseCallback: CommandMessageResponseCallback,
        responsesExpected: 'single' | 'multiple',
    ) {
        this.assertIsLinkedWindow(target);
        const listener = this.other.callbackListeners[commandMessage.command];
        this.assertListenerExists(listener, commandMessage.command);

        const originalResponseCallback = responseCallback;
        let responseAlreadyReceived = false;
        responseCallback = async response => {
            if (!responseAlreadyReceived || responsesExpected === 'multiple') {
                responseAlreadyReceived = true;
                await originalResponseCallback(response);
            }
        };

        listener(commandMessage, this.window, responseCallback);
    }

    private assertIsLinkedWindow(target: Window) {
        if (target !== this.other.window) {
            throw new Error(
                'target window unreachable (LinkedRespondableCommunicator not linked to it)',
            );
        }
    }

    private assertListenerExists(listener: Function | undefined, command: string) {
        if (listener == null) {
            throw new Error(`target window reachable, but is not listening for command ${command}`);
        }
    }

    asyncListeners: DictionaryStringTo<PromiseWindowCommandMessageListener> = {};
    callbackListeners: DictionaryStringTo<CallbackWindowCommandMessageListener> = {};

    public addPromiseCommandMessageListener(
        command: string,
        listener: PromiseWindowCommandMessageListener,
    ): void {
        this.asyncListeners[command] = listener;
    }

    public addCallbackCommandMessageListener(
        command: string,
        listener: CallbackWindowCommandMessageListener,
    ): void {
        this.callbackListeners[command] = listener;
    }

    public removeCommandMessageListener(command: string): void {
        delete this.callbackListeners[command];
    }
}

export type PairOf<T> = [T, T];
