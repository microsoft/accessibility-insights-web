// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { BackchannelStoreRequestMessage } from 'common/types/backchannel-message-type';
import { BrowserBackchannelWindowMessagePoster } from 'injected/frameCommunicators/browser-backchannel-window-message-poster';
import { WindowMessage } from 'injected/frameCommunicators/window-message';
import {
    createSimulatedWindowUtils,
    SimulatedWindowUtils,
} from 'tests/unit/common/simulated-window';
import { IMock, It, Mock, Times } from 'typemoq';

import {
    BackchannelMessagePair,
    BackchannelWindowMessageTranslator,
    MESSAGE_STABLE_SIGNATURE,
    WindowMessageMetadata,
} from '../../../../../injected/frameCommunicators/backchannel-window-message-translator';

describe('BrowserBackchannelWindowMessagePoster', () => {
    let testSubject: BrowserBackchannelWindowMessagePoster;
    let mockBrowserAdapter: IMock<BrowserAdapter>;
    let mockBackchannelWindowMessageTranslator: IMock<BackchannelWindowMessageTranslator>;
    let mockWindowUtils: SimulatedWindowUtils;
    const messageSourceId = 'app id';
    const messageVersion = 'app version';
    let manifest: chrome.runtime.Manifest;

    function getSampleMessageWithResponseId(): WindowMessage {
        return {
            message: 'hello',
            command: 'message',
            messageId: 'id1',
            error: {},
        } as WindowMessage;
    }
    const sampleMessage = getSampleMessageWithResponseId();
    const sampleBackchannelMessage = {
        ...sampleMessage,
        messageSourceId: messageSourceId,
        messageStableSignature: MESSAGE_STABLE_SIGNATURE,
        messageVersion: messageVersion,
    };

    const backchannelResponseMessage = {
        messageId: sampleMessage.messageId,
        messageType: 'backchannel_window_message.retrieve_response',
        stringifiedMessageData: sampleMessage.message,
        messageSourceId: messageSourceId,
        messageStableSignature: MESSAGE_STABLE_SIGNATURE,
        messageVersion: messageVersion,
    };

    beforeEach(() => {
        manifest = {
            name: messageSourceId,
            version: messageVersion,
        } as chrome.runtime.Manifest;
        mockBrowserAdapter = Mock.ofType<BrowserAdapter>();
        mockBrowserAdapter.setup(b => b.getManifest()).returns(() => manifest);
        mockWindowUtils = createSimulatedWindowUtils();

        mockBackchannelWindowMessageTranslator = Mock.ofType<BackchannelWindowMessageTranslator>();
        testSubject = new BrowserBackchannelWindowMessagePoster(
            mockWindowUtils.object,
            mockBrowserAdapter.object,
            mockBackchannelWindowMessageTranslator.object,
        );
    });

    test('adds event listener on initialize', () => {
        mockWindowUtils
            .setup(x => x.addEventListener(window, 'message', It.isAny(), false))
            .verifiable(Times.once());
        testSubject.initialize();
        mockWindowUtils.verifyAll();
        mockBrowserAdapter.verifyAll();
        mockBackchannelWindowMessageTranslator.verifyAll();
    });

    test('postMessage successfully posts to both backchannel and to frame', async () => {
        testSubject.initialize();
        const targetWindow = {} as Window;
        const sampleMessage = getSampleMessageWithResponseId();

        mockBackchannelWindowMessageTranslator
            .setup(x => x.splitWindowMessage(sampleMessage))
            .returns(
                () =>
                    ({
                        backchannelMessage: {
                            messageType: 'backchannel_window_message.store_request',
                            stringifiedMessageData: sampleMessage.message,
                            ...sampleMessage,
                        } as BackchannelStoreRequestMessage,
                        windowMessageMetadata: sampleMessage as WindowMessageMetadata,
                    } as BackchannelMessagePair),
            )
            .verifiable(Times.once());

        mockBrowserAdapter
            .setup(x =>
                x.sendRuntimeMessage({
                    messageType: 'backchannel_window_message.store_request',
                    stringifiedMessageData: sampleMessage.message,
                    ...sampleMessage,
                }),
            )
            .verifiable(Times.once());

        mockWindowUtils
            .setup(x => x.postMessage(targetWindow, sampleMessage, '*'))
            .verifiable(Times.once());

        // sending message to iframe
        testSubject.postMessage(targetWindow, sampleMessage);
        mockWindowUtils.verifyAll();
        mockBrowserAdapter.verifyAll();
        mockBackchannelWindowMessageTranslator.verifyAll();
    });

    test('onWindowMessageEvent bails if we cannot parse receive message', () => {
        testSubject.initialize();
        const targetWindow = {} as Window;

        const sampleMessageEvent: MessageEvent = {
            source: targetWindow,
            data: { ...sampleBackchannelMessage, messageType: 'random type' },
        } as MessageEvent;

        mockBackchannelWindowMessageTranslator
            .setup(x =>
                x.tryCreateBackchannelReceiveMessage({
                    ...sampleBackchannelMessage,
                    messageType: 'random type',
                }),
            )
            .returns(() => null)
            .verifiable(Times.once());

        mockBrowserAdapter
            .setup(adapter => adapter.sendRuntimeMessage(It.isAny()))
            .verifiable(Times.never());

        mockBackchannelWindowMessageTranslator
            .setup(translator => translator.tryParseBackchannelRetrieveResponseMessage(It.isAny()))
            .verifiable(Times.never());

        // trigger message
        mockWindowUtils.notifyOnMessageEvent(sampleMessageEvent);
        mockWindowUtils.verifyAll();
        mockBrowserAdapter.verifyAll();
        mockBackchannelWindowMessageTranslator.verifyAll();
    });

    test('onWindowMessageEvent parses messages from backchannel and sends response to registered listeners', async () => {
        testSubject.initialize();

        const targetWindow = {} as Window;

        const sampleMessageEvent: MessageEvent = {
            source: targetWindow,
            data: sampleBackchannelMessage,
        } as MessageEvent;
        const listener1 = jest.fn((msg, win) => {
            expect(msg).toBe(sampleMessage.message);
            expect(win).toBe(targetWindow);
            return msg;
        });
        const listener2 = jest.fn((msg, win) => {
            expect(msg).toBe(sampleMessage.message);
            expect(win).toBe(targetWindow);
            return msg;
        });
        testSubject.addMessageListener(listener1);
        testSubject.addMessageListener(listener2);

        mockBackchannelWindowMessageTranslator
            .setup(x => x.tryCreateBackchannelReceiveMessage(sampleBackchannelMessage))
            .returns(() => {
                return {
                    messageId: sampleBackchannelMessage.messageId,
                    messageType: 'backchannel_window_message.retrieve_request',
                };
            })
            .verifiable(Times.once());

        mockBrowserAdapter
            .setup(adapter => adapter.sendRuntimeMessage(It.isAny()))
            .returns(() => Promise.resolve(backchannelResponseMessage))
            .verifiable(Times.once());

        mockBackchannelWindowMessageTranslator
            .setup(translator =>
                translator.tryParseBackchannelRetrieveResponseMessage(backchannelResponseMessage),
            )
            .returns(() => ({
                messageId: sampleMessage.messageId,
                messageType: 'backchannel_window_message.retrieve_response',
                stringifiedMessageData: JSON.stringify(sampleMessage.message),
            }))
            .verifiable(Times.once());

        // trigger message
        await mockWindowUtils.notifyOnMessageEvent(sampleMessageEvent);
        expect(listener1).toHaveBeenCalledTimes(1);
        expect(listener2).toHaveBeenCalledTimes(1);
        mockWindowUtils.verifyAll();
        mockBrowserAdapter.verifyAll();
        mockBackchannelWindowMessageTranslator.verifyAll();
    });

    test('onWindowMessageEvent does not call listeners if no response from browser', async () => {
        testSubject.initialize();

        const targetWindow = {} as Window;

        const sampleMessageEvent: MessageEvent = {
            source: targetWindow,
            data: sampleBackchannelMessage,
        } as MessageEvent;

        const listener1 = jest.fn((msg, win) => {
            expect(msg).toBe(sampleMessage.message);
            expect(win).toBe(targetWindow);
            return msg;
        });
        const listener2 = jest.fn((msg, win) => {
            expect(msg).toBe(sampleMessage.message);
            expect(win).toBe(targetWindow);
            return msg;
        });
        testSubject.addMessageListener(listener1);
        testSubject.addMessageListener(listener2);

        mockBackchannelWindowMessageTranslator
            .setup(x => x.tryCreateBackchannelReceiveMessage(sampleBackchannelMessage))
            .returns(() => {
                return {
                    messageId: sampleBackchannelMessage.messageId,
                    messageType: 'backchannel_window_message.retrieve_request',
                };
            })
            .verifiable(Times.once());

        mockBrowserAdapter
            .setup(adapter =>
                adapter.sendRuntimeMessage({
                    messageId: sampleBackchannelMessage.messageId,
                    messageType: 'backchannel_window_message.retrieve_request',
                }),
            )
            .returns(() => null)
            .verifiable(Times.once());

        mockBackchannelWindowMessageTranslator
            .setup(translator => translator.tryParseBackchannelRetrieveResponseMessage(It.isAny()))
            .returns(() => null)
            .verifiable(Times.once());

        // trigger message
        await mockWindowUtils.notifyOnMessageEvent(sampleMessageEvent);
        expect(listener1).not.toHaveBeenCalled();
        expect(listener2).not.toHaveBeenCalled();
        mockWindowUtils.verifyAll();
        mockBrowserAdapter.verifyAll();
        mockBackchannelWindowMessageTranslator.verifyAll();
    });

    test('onWindowMessageEvent bails silently if the browser indicates an invalid message token', async () => {
        testSubject.initialize();

        const targetWindow = {} as Window;

        const sampleMessageEvent: MessageEvent = {
            source: targetWindow,
            data: sampleBackchannelMessage,
        } as MessageEvent;

        const listener1 = jest.fn((msg, win) => {
            expect(msg).toBe(sampleMessage.message);
            expect(win).toBe(targetWindow);
            return msg;
        });
        const listener2 = jest.fn((msg, win) => {
            expect(msg).toBe(sampleMessage.message);
            expect(win).toBe(targetWindow);
            return msg;
        });
        testSubject.addMessageListener(listener1);
        testSubject.addMessageListener(listener2);

        mockBackchannelWindowMessageTranslator
            .setup(x => x.tryCreateBackchannelReceiveMessage(sampleBackchannelMessage))
            .returns(() => {
                return {
                    messageId: sampleBackchannelMessage.messageId,
                    messageType: 'backchannel_window_message.retrieve_request',
                };
            })
            .verifiable(Times.once());

        mockBrowserAdapter
            .setup(adapter =>
                adapter.sendRuntimeMessage({
                    messageId: sampleBackchannelMessage.messageId,
                    messageType: 'backchannel_window_message.retrieve_request',
                }),
            )
            .returns(() => Promise.reject(new Error('Could not find content for specified token')))
            .verifiable(Times.once());

        // trigger message
        await mockWindowUtils.notifyOnMessageEvent(sampleMessageEvent);
        expect(listener1).not.toHaveBeenCalled();
        expect(listener2).not.toHaveBeenCalled();
        mockWindowUtils.verifyAll();
        mockBrowserAdapter.verifyAll();
        mockBackchannelWindowMessageTranslator.verifyAll();
    });
});
