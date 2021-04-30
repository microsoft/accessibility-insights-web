// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FrameMessenger } from 'injected/frameCommunicators/frame-messenger';
import {
    CommandMessage,
    CommandMessageResponse,
    PromiseWindowCommandMessageListener,
} from 'injected/frameCommunicators/respondable-command-message-communicator';
import { DictionaryStringTo } from 'types/common-types';

// This is a simulated FrameMessenger intended for testing how multiple FrameMessenger-based
// instances of a test subject communicate with one another. Use createLinkedPair to create
// two messenger instances, and use the provided "window" and "frameElement" properties in other
// mocks/test inputs to cause the test subjects to target messages to the other listener.
export class LinkedFrameMessenger extends FrameMessenger {
    public static createLinkedPair(): [LinkedFrameMessenger, LinkedFrameMessenger] {
        const first = new LinkedFrameMessenger();
        const second = new LinkedFrameMessenger();
        first.otherMessenger = second;
        second.otherMessenger = first;
        return [first, second];
    }

    private constructor() {
        super(null!);
    }

    private otherMessenger: LinkedFrameMessenger;
    private listeners: DictionaryStringTo<PromiseWindowCommandMessageListener> = {};
    public window: Window = {} as Window;
    public frameElement = { contentWindow: this.window } as HTMLIFrameElement;

    public initialize(): void {}
    public addMessageListener(
        command: string,
        listener: PromiseWindowCommandMessageListener,
    ): void {
        this.listeners[command] = listener;
    }
    public async sendMessageToFrame(
        targetFrame: HTMLIFrameElement,
        message: CommandMessage,
    ): Promise<CommandMessageResponse> {
        return await this.sendMessageToWindow(targetFrame.contentWindow, message);
    }

    public async sendMessageToWindow(
        targetWindow: Window,
        message: CommandMessage,
    ): Promise<CommandMessageResponse> {
        expect(targetWindow).toBe(this.otherMessenger.window);
        if (targetWindow !== this.otherMessenger.window) {
            throw new Error('Attempted to send a message to an unexpected target frame/window');
        }
        const listener = this.otherMessenger.listeners[message.command];
        expect(listener).not.toBeUndefined();
        return await listener(message, this.window);
    }
}
