// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CommandMessage,
    CommandMessageResponse,
    RespondableCommandMessageCommunicator,
    PromiseWindowCommandMessageListener,
} from './respondable-command-message-communicator';

// FrameMessenger is responsible for sending messages between different target page frames.
//
// Generally, a component in one frame of the target page will use a FrameMessenger to communicate
// with other instances of the same component in different frames. For example, a highlight box
// drawer that needs to be able to draw something in a nested iframe might:
//   * Register a "draw" command listener in every target page frame, and have that listener accept
//     a payload containing a selector to draw at
//   * If the selector is for a child iframe (eg, "#frame; #child-element"), use FrameMessenger to
//     send a "draw #child-element" message to that child iframe element
//
// FrameMessenger should *only* be used for messages that need to be targeted to a *specific* frame
// or window. For messages that are not so specifically targetted, prefer using the more common flux
// data flow instead.
export class FrameMessenger {
    constructor(
        private readonly respondableCommandMessageCommunicator: RespondableCommandMessageCommunicator,
    ) {}

    public addMessageListener(
        command: string,
        listener: PromiseWindowCommandMessageListener,
    ): void {
        this.respondableCommandMessageCommunicator.addPromiseCommandMessageListener(
            command,
            listener,
        );
    }

    public async sendMessageToFrame(
        targetFrame: HTMLIFrameElement,
        message: CommandMessage,
    ): Promise<CommandMessageResponse> {
        if (targetFrame == null || !this.doesFrameSupportScripting(targetFrame)) {
            throw new Error('Target frame has a sandbox attribute which disallows scripts');
        }

        const contentWindow = targetFrame.contentWindow;
        if (contentWindow == null) {
            throw new Error('Target frame does not have a contentWindow');
        }

        return await this.sendMessageToWindow(contentWindow, message);
    }

    // Use this to send a message to window.parent or window.top.
    // To send a message to someFrameElement.contentWindow, use sendMessageToFrame instead.
    public async sendMessageToWindow(
        targetWindow: Window,
        message: CommandMessage,
    ): Promise<CommandMessageResponse> {
        return await this.respondableCommandMessageCommunicator.sendPromiseCommandMessage(
            targetWindow,
            message,
        );
    }

    // This is best-effort; there are other reasons why our code in the target frame might not be
    // able to run and/or see frame messages (eg, if other JS in the page has a window message
    // handler registered that prevents message event propagation).
    private doesFrameSupportScripting(frame: HTMLIFrameElement): boolean {
        return (
            !frame.hasAttribute('sandbox') ||
            frame.getAttribute('sandbox')!.toLowerCase().lastIndexOf('allow-scripts') >= 0
        );
    }
}
