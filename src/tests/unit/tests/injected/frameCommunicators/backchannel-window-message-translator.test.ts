// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { WindowUtils } from 'common/window-utils';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

import {
    BackchannelWindowMessageTranslator,
    MESSAGE_STABLE_SIGNATURE,
} from '../../../../../injected/frameCommunicators/backchannel-window-message-translator';

describe('BackchannelWindowMessageTranslator', () => {
    let testSubject: BackchannelWindowMessageTranslator;
    let mockBrowserAdapter: IMock<BrowserAdapter>;
    let mockWindowUtils: IMock<WindowUtils>;

    const uniqueId = 'unique_id';
    const uIntArray = new Uint8Array(32);
    const messageSourceId = 'app id';
    const messageVersion = 'app version';
    let manifest: chrome.runtime.Manifest;
    const validMessageId = '12';
    const validMessageProperty = { hasMessage: true };
    const translatorSourceId = 'app id-BackchannelWindowMessageTranslator';

    beforeEach(() => {
        manifest = {
            name: messageSourceId,
            version: messageVersion,
        } as chrome.runtime.Manifest;

        mockWindowUtils = Mock.ofType(WindowUtils, MockBehavior.Strict);
        mockWindowUtils
            .setup(x => x.getRandomValueArray(32))
            .returns(() => uIntArray)
            .verifiable(Times.once());
        mockBrowserAdapter = Mock.ofType<BrowserAdapter>();
        mockBrowserAdapter.setup(b => b.getManifest()).returns(() => manifest);
        testSubject = new BackchannelWindowMessageTranslator(
            mockBrowserAdapter.object,
            mockWindowUtils.object,
            () => {
                return uniqueId;
            },
        );
    });

    test.each`
        description       | message
        ${'plain string'} | ${'this is a message'}
        ${'number'}       | ${1}
        ${'null'}         | ${null}
        ${'passed a command'} | ${{
    command: 'someCommand',
}}
        ${'message object'} | ${{
    message: { a: 1 },
    error: {
        message: 'error msg',
        stack: 'stack',
        name: 'name',
    },
    command: 'someCommand',
}}
    `(
        'splitWindowMessage parses message when message is $description',
        ({ description, message }) => {
            const backchannelMessagePair = testSubject.splitWindowMessage(message);
            const { backchannelMessage, windowMessageMetadata } = backchannelMessagePair;
            expect(windowMessageMetadata).toEqual({
                messageId:
                    'unique_id_MCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCww',
                messageStableSignature: MESSAGE_STABLE_SIGNATURE,
                messageSourceId: translatorSourceId,
                messageVersion: messageVersion,
            });
            expect(backchannelMessage).toEqual({
                messageId:
                    'unique_id_MCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCwwLDAsMCww',
                messageType: 'backchannel_window_message.store_request',
                stringifiedMessageData: JSON.stringify(message),
            });
        },
    );

    // This will return null for any message which does not appear to come from us.
    // In particular, it will return null for any message with the a type layout, source ID,
    // stable signature, etc which does not appear to have been created by createWindowMessage().
    // public tryCreateBackchannelReceiveMessage(
    //     rawReceivedWindowMessage: any,
    // ): BackchannelRetrieveRequestMessage | null
    test('tryCreateBackchannelReceiveMessage with valid input', () => {
        const backchannelRequestMessage = testSubject.tryCreateBackchannelReceiveMessage(`{
            "messageId": "${validMessageId}",
            "message": "${validMessageProperty}",
            "messageStableSignature": "${MESSAGE_STABLE_SIGNATURE}",
            "messageSourceId": "${translatorSourceId}",
            "messageVersion": "${messageVersion}"
        }`);
        expect(backchannelRequestMessage).toHaveProperty(
            'messageType',
            'backchannel_window_message.retrieve_request',
        );
        expect(backchannelRequestMessage.messageId).toEqual(validMessageId);
    });

    test.each`
        description                                           | message
        ${'null'}                                             | ${null}
        ${'non-stringified object'}                           | ${{}}
        ${'non-JSON-parseable string'}                        | ${`{invalid json}`}
        ${'empty object'}                                     | ${`{}`}
        ${'message with only messageId present'}              | ${`{ "messageId": "${validMessageId}" }`}
        ${'message with only messageSourceId present'}        | ${`{ "messageSourceId": "${translatorSourceId}" }`}
        ${'message with only messageVersion present'}         | ${`{ "messageVersion": "${messageVersion}" }`}
        ${'message with only messageStableSignature present'} | ${`{ "messageStableSignature": "${MESSAGE_STABLE_SIGNATURE}" }`}
        ${'message with only messageId missing'} | ${`{
    "message": "${validMessageProperty}",
    "messageStableSignature": "${MESSAGE_STABLE_SIGNATURE}",
    "messageSourceId": "${translatorSourceId}",
    "messageVersion": "${messageVersion}"
}`}
        ${'message with messageStableSignature missing'} | ${`{
    "messageId": "${validMessageId}",
    "message": "${validMessageProperty}",
    "messageSourceId": "${translatorSourceId}",
    "messageVersion": "${messageVersion}"
}`}
        ${'message with messageSourceId missing'} | ${`{
    "messageId": "${validMessageId}",
    "message": "${validMessageProperty}",
    "messageStableSignature": "${MESSAGE_STABLE_SIGNATURE}",
    "messageVersion": "${messageVersion}"
}`}
        ${'message with messageVersion missing'} | ${`{
    "messageId": "${validMessageId}",
    "message": "${validMessageProperty}",
    "messageStableSignature": "${MESSAGE_STABLE_SIGNATURE}",
    "messageSourceId": "${translatorSourceId}"
}`}
        ${'message with messageId malformed'} | ${`{
    "messageId": 0,
    "message": "${validMessageProperty}",
    "messageStableSignature": "${MESSAGE_STABLE_SIGNATURE}",
    "messageSourceId": "${translatorSourceId}",
    "messageVersion": "${messageVersion}"
}`}
        ${'message with messageStableSignature malformed'} | ${`{
    "messageId": "${validMessageId}",
    "message": "${validMessageProperty}",
    "messageStableSignature": "unknown stable signature",
    "messageSourceId": "${translatorSourceId}",
    "messageVersion": "${messageVersion}"
}`}
        ${'message with unknown messageSourceId'} | ${`{
    "messageId": "${validMessageId}",
    "message": "${validMessageProperty}",
    "messageStableSignature": "${MESSAGE_STABLE_SIGNATURE}",
    "messageSourceId": "unknown source id",
    "messageVersion": "${messageVersion}"
}`}
        ${'message with unknown messageVersion'} | ${`{
    "messageId": "${validMessageId}",
    "message": "${validMessageProperty}",
    "messageStableSignature": "${MESSAGE_STABLE_SIGNATURE}",
    "messageSourceId": "${translatorSourceId}",
    "messageVersion": "unknown version"
}`}
    `(
        'tryCreateBackchannelReceiveMessage returns null when input is $description',
        ({ message }) => {
            expect(testSubject.tryCreateBackchannelReceiveMessage(message)).toBeNull();
        },
    );

    // This will return null for any message which is not directed towards the Backchannel
    // public tryParseBackchannelRetrieveResponseMessage(
    //     rawBackchannelMessage: any,
    // ): BackchannelRetrieveResponseMessage | null
    test('tries to create a Backchannel Retrieve Response Message based on proper input', () => {
        const message = {
            messageId: validMessageId,
            stringifiedMessageData: 'string_data',
            messageType: 'backchannel_window_message.retrieve_response',
        };
        const backchannelResponseMessage =
            testSubject.tryParseBackchannelRetrieveResponseMessage(message);
        expect(backchannelResponseMessage).toHaveProperty(
            'messageType',
            'backchannel_window_message.retrieve_response',
        );
        expect(backchannelResponseMessage).toHaveProperty('stringifiedMessageData', 'string_data');
        expect(backchannelResponseMessage.messageId).toEqual(message.messageId);
    });

    test('fails to create a Backchannel Retrieve Response Message based on improper input', () => {
        const message = { isMessage: false };
        const backchannelResponseMessage =
            testSubject.tryParseBackchannelRetrieveResponseMessage(message);
        expect(backchannelResponseMessage).toEqual(null);
    });

    test.each`
        description | message
        ${'missing message type'} | ${{
    messageId: validMessageId,
    message: validMessageProperty,
    messageStableSignature: MESSAGE_STABLE_SIGNATURE,
    messageSourceId: translatorSourceId,
    messageVersion: messageVersion, //missing messageType
}}
        ${'wrong message type'} | ${{
    messageId: validMessageId,
    message: validMessageProperty,
    messageStableSignature: MESSAGE_STABLE_SIGNATURE,
    messageSourceId: translatorSourceId,
    messageVersion: messageVersion,
    messageType: 'wrong message type',
}}
    `(
        'tryParseBackchannelRetrieveResponseMessage with $description',
        ({ description, message }) => {
            expect(testSubject.tryParseBackchannelRetrieveResponseMessage(message)).toBeNull();
        },
    );
});
