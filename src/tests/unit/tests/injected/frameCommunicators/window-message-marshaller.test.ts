// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock } from 'typemoq';

import { ClientBrowserAdapter } from '../../../../../common/client-browser-adapter';
import {
    IWindowMessage,
    WindowMessageMarshaller,
    STABLE_MESSAGE_SIGNATURE,
} from '../../../../../injected/frameCommunicators/window-message-marshaller';

describe('WindowMessageMarshallerTests', () => {
    let testSubject: WindowMessageMarshaller;
    let messageIdToBeReturned: string;
    let browserAdapter: IMock<ClientBrowserAdapter>;
    const messageSourceId = 'app id';
    const messageVersion = 'app version';
    let manifest: chrome.runtime.Manifest;
    const validMessageId = '12';
    const validMessageProperty = { hasMessage: true };

    beforeEach(() => {
        manifest = {
            name: messageSourceId,
            version: messageVersion,
        } as chrome.runtime.Manifest;

        browserAdapter = Mock.ofType<ClientBrowserAdapter>();
        browserAdapter.setup(b => b.getManifest()).returns(() => manifest);

        testSubject = new WindowMessageMarshaller(browserAdapter.object, () => {
            return messageIdToBeReturned;
        });
    });

    test('handleParsingInvalidJsonString', () => {
        expect(testSubject.parseMessage('invalid json')).toBeNull();
        expect(testSubject.parseMessage({})).toBeNull();
    });

    test.each([
        null,
        JSON.stringify({}),
        // Only one required field present
        JSON.stringify({ messageId: '12' } as IWindowMessage),
        JSON.stringify({ messageSourceId: messageSourceId } as IWindowMessage),
        JSON.stringify({ messageVersion: messageVersion } as IWindowMessage),
        JSON.stringify({ messageStableSignature: STABLE_MESSAGE_SIGNATURE } as IWindowMessage),
        // Only one required field missing
        JSON.stringify({
            // messageId: { unknownMessageIdType: true } as any,
            message: validMessageProperty,
            messageStableSignature: STABLE_MESSAGE_SIGNATURE,
            messageSourceId: messageSourceId,
            messageVersion: messageVersion,
        } as IWindowMessage),
        JSON.stringify({
            messageId: validMessageId,
            message: validMessageProperty,
            // messageStableSignature: 'unknown stable signature',
            messageSourceId: messageSourceId,
            messageVersion: messageVersion,
        } as IWindowMessage),
        JSON.stringify({
            messageId: validMessageId,
            message: validMessageProperty,
            messageStableSignature: STABLE_MESSAGE_SIGNATURE,
            // messageSourceId: 'unknown source id',
            messageVersion: messageVersion,
        } as IWindowMessage),
        JSON.stringify({
            messageId: validMessageId,
            message: validMessageProperty,
            messageStableSignature: STABLE_MESSAGE_SIGNATURE,
            messageSourceId: messageSourceId,
            // messageVersion: 'unknown version',
        } as IWindowMessage),
        // Only one required field malformed
        JSON.stringify({
            messageId: { unknownMessageIdType: true } as any,
            message: validMessageProperty,
            messageStableSignature: STABLE_MESSAGE_SIGNATURE,
            messageSourceId: messageSourceId,
            messageVersion: messageVersion,
        } as IWindowMessage),
        JSON.stringify({
            messageId: validMessageId,
            message: validMessageProperty,
            messageStableSignature: 'unknown stable signature',
            messageSourceId: messageSourceId,
            messageVersion: messageVersion,
        } as IWindowMessage),
        JSON.stringify({
            messageId: validMessageId,
            message: validMessageProperty,
            messageStableSignature: STABLE_MESSAGE_SIGNATURE,
            messageSourceId: 'unknown source id',
            messageVersion: messageVersion,
        } as IWindowMessage),
        JSON.stringify({
            messageId: validMessageId,
            message: validMessageProperty,
            messageStableSignature: STABLE_MESSAGE_SIGNATURE,
            messageSourceId: messageSourceId,
            messageVersion: 'unknown version',
        } as IWindowMessage),
    ])('handleParsingUnknownData: %#', message => {
        expect(testSubject.parseMessage(message)).toBeNull();
    });

    test.each([
        {
            message: { a: 1 },
            error: {
                message: 'error msg',
                stack: 'stack',
                name: 'name',
            },
            messageStableSignature: STABLE_MESSAGE_SIGNATURE,
            messageSourceId: messageSourceId,
            messageVersion: messageVersion,
            messageId: 'id1',
            command: 'someCommand',
        } as IWindowMessage, // with message
        {
            messageStableSignature: STABLE_MESSAGE_SIGNATURE,
            messageSourceId: messageSourceId,
            messageVersion: messageVersion,
            messageId: 'id1',
            command: 'someCommand',
        } as IWindowMessage, // without message
    ])('handleParsingValidData: %#', message => {
        expect(testSubject.parseMessage(JSON.stringify(message))).toEqual(message);
    });

    test('createMessageWithResponseId', () => {
        const command = 'command1';
        const responseId = 'responseId';
        const payload = {};
        const expectedMessage: IWindowMessage = {
            messageId: responseId,
            command: command,
            message: payload,
            error: undefined,
            messageStableSignature: STABLE_MESSAGE_SIGNATURE,
            messageSourceId: manifest.name,
            messageVersion: manifest.version,
        };

        const message = testSubject.createMessage(command, payload, responseId);

        expect(message).toEqual(expectedMessage);
    });

    test('createMessageWithoutResponseId', () => {
        const command = 'command1';
        const payload = {};
        messageIdToBeReturned = 'newId1';
        const expectedMessage: IWindowMessage = {
            messageId: messageIdToBeReturned,
            command: command,
            message: payload,
            error: undefined,
            messageStableSignature: STABLE_MESSAGE_SIGNATURE,
            messageSourceId: manifest.name,
            messageVersion: manifest.version,
        };

        const message = testSubject.createMessage(command, payload);

        expect(message).toEqual(expectedMessage);
    });

    test('createMessageWithError', () => {
        const command = 'command1';
        const payload = new Error('hi');
        messageIdToBeReturned = 'newId1';
        const expectedMessage: IWindowMessage = {
            messageId: messageIdToBeReturned,
            command: command,
            message: undefined,
            error: {
                message: payload.message,
                stack: payload.stack,
                name: payload.name,
            },
            messageStableSignature: STABLE_MESSAGE_SIGNATURE,
            messageSourceId: manifest.name,
            messageVersion: manifest.version,
        };

        const message = testSubject.createMessage(command, payload);

        expect(message).toEqual(expectedMessage);
    });
});
