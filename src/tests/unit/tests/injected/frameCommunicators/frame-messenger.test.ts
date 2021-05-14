// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FrameMessenger } from 'injected/frameCommunicators/frame-messenger';
import { CommandMessage } from 'injected/frameCommunicators/respondable-command-message-communicator';
import { LinkedRespondableCommunicator } from 'tests/unit/common/linked-respondable-communicator';

// These tests simulate two FrameMessagers in different browser contexts communicating with one
// another. frameMessenger1 and frameMessenger2 are initialized with LinkedRespondableCommunicators
// that are pre-linked to one another in association with stubs window1 and window2.
describe('FrameMessenger', () => {
    let window1: Window;
    let window2: Window;
    let unlinkedWindow: Window;
    let frameMessenger1: FrameMessenger;
    let frameMessenger2: FrameMessenger;
    let underlyingCommunicator1: LinkedRespondableCommunicator;
    let underlyingCommunicator2: LinkedRespondableCommunicator;
    const irrelevantMessage: CommandMessage = {
        command: 'irrelevant',
        payload: 'irrelevant',
    };

    beforeEach(() => {
        [underlyingCommunicator1, underlyingCommunicator2] =
            LinkedRespondableCommunicator.createLinkedMockPair();
        window1 = underlyingCommunicator1.window;
        frameMessenger1 = new FrameMessenger(underlyingCommunicator1);
        window2 = underlyingCommunicator2.window;
        frameMessenger2 = new FrameMessenger(underlyingCommunicator2);
        unlinkedWindow = {} as Window;
    });

    describe('sendMessageToWindow/addMessageListener communication', () => {
        it('propagates rejection from the underlying communicator', async () => {
            frameMessenger2.addMessageListener('throw-error', async (message, source) => {
                expect(source).toBe(window1);
                throw new Error('from throw-error listener');
            });

            const sendToFailingListener = frameMessenger1.sendMessageToWindow(window2, {
                command: 'throw-error',
                payload: 'irrelevant',
            });

            await expect(sendToFailingListener).rejects.toThrowErrorMatchingInlineSnapshot(
                `"from throw-error listener"`,
            );
        });

        it("resolves with the other end's response in the happy path", async () => {
            frameMessenger2.addMessageListener('repeat-twice', async (message, source) => {
                expect(source).toBe(window1);
                return { payload: `${message.payload}${message.payload}` };
            });

            const response = await frameMessenger1.sendMessageToWindow(window2, {
                command: 'repeat-twice',
                payload: 'original',
            });

            expect(response.payload).toBe('originaloriginal');
        });
    });

    describe('sendMessageToFrame/addMessageListener communication', () => {
        it('propagates rejection from the underlying communicator', async () => {
            const target = makeStubFrame(unlinkedWindow);
            const sendPromise = frameMessenger1.sendMessageToFrame(target, {
                command: 'irrelevant',
                payload: 'irrelevant',
            });

            await expect(sendPromise).rejects.toThrowErrorMatchingInlineSnapshot(
                `"target window unreachable (LinkedRespondableCommunicator not linked to it)"`,
            );
        });

        it("rejects with a descriptive error if the target's sandbox attribute disallows scripts", async () => {
            const frameWithRestrictiveSandbox = makeStubFrame(
                window2,
                'sandbox-attr that-doesnt include-script-allowance',
            );
            const sendToFrameWithRestrictiveSandbox = frameMessenger1.sendMessageToFrame(
                frameWithRestrictiveSandbox,
                irrelevantMessage,
            );

            await expect(
                sendToFrameWithRestrictiveSandbox,
            ).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Target frame has a sandbox attribute which disallows scripts"`,
            );
        });

        it('rejects with a descriptive error if the target has no contentWindow', async () => {
            const frameWithoutWindow = makeStubFrame(undefined);
            const sendToFrameWithoutWindow = frameMessenger1.sendMessageToFrame(
                frameWithoutWindow,
                irrelevantMessage,
            );

            await expect(sendToFrameWithoutWindow).rejects.toThrowErrorMatchingInlineSnapshot(
                `"Target frame does not have a contentWindow"`,
            );
        });

        it("resolves with the other end's response for valid frame with no sandbox attr", async () => {
            frameMessenger2.addMessageListener('repeat-twice', async (message, source) => {
                expect(source).toBe(window1);
                return { payload: `${message.payload}${message.payload}` };
            });

            const reachableUnsandboxedFrame = makeStubFrame(window2);
            const response = await frameMessenger1.sendMessageToFrame(reachableUnsandboxedFrame, {
                command: 'repeat-twice',
                payload: 'original',
            });

            expect(response.payload).toBe('originaloriginal');
        });

        it("resolves with the other end's response for valid frame with a sandbox attr that allows scripts", async () => {
            frameMessenger2.addMessageListener('repeat-twice', async (message, source) => {
                expect(source).toBe(window1);
                return { payload: `${message.payload}${message.payload}` };
            });

            const reachableSandboxedFrame = makeStubFrame(
                window2,
                'something allow-scripts something-else',
            );
            const response = await frameMessenger1.sendMessageToFrame(reachableSandboxedFrame, {
                command: 'repeat-twice',
                payload: 'original',
            });

            expect(response.payload).toBe('originaloriginal');
        });

        function makeStubFrame(contentWindow: Window, sandboxAttr?: string): HTMLIFrameElement {
            return {
                contentWindow,
                hasAttribute: attr => attr === 'sandbox' && sandboxAttr != null,
                getAttribute: attr => (attr === 'sandbox' ? sandboxAttr : null),
            } as HTMLIFrameElement;
        }
    });
});
