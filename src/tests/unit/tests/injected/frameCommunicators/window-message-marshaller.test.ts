// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock } from 'typemoq';

import { BrowserAdapter } from '../../../../../common/browser-adapters/browser-adapter';
import { WindowMessage } from '../../../../../injected/frameCommunicators/window-message';
import {
    MESSAGE_STABLE_SIGNATURE,
    WindowMessageMarshaller,
} from '../../../../../injected/frameCommunicators/window-message-marshaller';

describe('WindowMessageMarshallerTests', () => {
    let testSubject: WindowMessageMarshaller;
    let messageIdToBeReturned: string;
    let browserAdapter: IMock<BrowserAdapter>;
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

        browserAdapter = Mock.ofType<BrowserAdapter>();
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
        JSON.stringify({ messageId: '12' } as WindowMessage),
        JSON.stringify({ messageSourceId: messageSourceId } as WindowMessage),
        JSON.stringify({ messageVersion: messageVersion } as WindowMessage),
        JSON.stringify({ messageStableSignature: MESSAGE_STABLE_SIGNATURE } as WindowMessage),
        // Only one required field missing
        JSON.stringify({
            // messageId: { unknownMessageIdType: true } as any,
            message: validMessageProperty,
            messageStableSignature: MESSAGE_STABLE_SIGNATURE,
            messageSourceId: messageSourceId,
            messageVersion: messageVersion,
        } as WindowMessage),
        JSON.stringify({
            messageId: validMessageId,
            message: validMessageProperty,
            // messageStableSignature: 'unknown stable signature',
            messageSourceId: messageSourceId,
            messageVersion: messageVersion,
        } as WindowMessage),
        JSON.stringify({
            messageId: validMessageId,
            message: validMessageProperty,
            messageStableSignature: MESSAGE_STABLE_SIGNATURE,
            // messageSourceId: 'unknown source id',
            messageVersion: messageVersion,
        } as WindowMessage),
        JSON.stringify({
            messageId: validMessageId,
            message: validMessageProperty,
            messageStableSignature: MESSAGE_STABLE_SIGNATURE,
            messageSourceId: messageSourceId,
            // messageVersion: 'unknown version',
        } as WindowMessage),
        // Only one required field malformed
        JSON.stringify({
            messageId: { unknownMessageIdType: true } as any,
            message: validMessageProperty,
            messageStableSignature: MESSAGE_STABLE_SIGNATURE,
            messageSourceId: messageSourceId,
            messageVersion: messageVersion,
        } as WindowMessage),
        JSON.stringify({
            messageId: validMessageId,
            message: validMessageProperty,
            messageStableSignature: 'unknown stable signature',
            messageSourceId: messageSourceId,
            messageVersion: messageVersion,
        } as WindowMessage),
        JSON.stringify({
            messageId: validMessageId,
            message: validMessageProperty,
            messageStableSignature: MESSAGE_STABLE_SIGNATURE,
            messageSourceId: 'unknown source id',
            messageVersion: messageVersion,
        } as WindowMessage),
        JSON.stringify({
            messageId: validMessageId,
            message: validMessageProperty,
            messageStableSignature: MESSAGE_STABLE_SIGNATURE,
            messageSourceId: messageSourceId,
            messageVersion: 'unknown version',
        } as WindowMessage),
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
            messageStableSignature: MESSAGE_STABLE_SIGNATURE,
            messageSourceId: messageSourceId,
            messageVersion: messageVersion,
            messageId: 'id1',
            command: 'someCommand',
        } as WindowMessage, // with message
        {
            messageStableSignature: MESSAGE_STABLE_SIGNATURE,
            messageSourceId: messageSourceId,
            messageVersion: messageVersion,
            messageId: 'id1',
            command: 'someCommand',
        } as WindowMessage, // without message
    ])('handleParsingValidData: %#', message => {
        expect(testSubject.parseMessage(JSON.stringify(message))).toEqual(message);
    });

    test('createMessageWithResponseId', () => {
        const command = 'command1';
        const responseId = 'responseId';
        const payload = {};
        const expectedMessage: WindowMessage = {
            messageId: responseId,
            command: command,
            message: payload,
            error: undefined,
            messageStableSignature: MESSAGE_STABLE_SIGNATURE,
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
        const expectedMessage: WindowMessage = {
            messageId: messageIdToBeReturned,
            command: command,
            message: payload,
            error: undefined,
            messageStableSignature: MESSAGE_STABLE_SIGNATURE,
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
        const expectedMessage: WindowMessage = {
            messageId: messageIdToBeReturned,
            command: command,
            message: undefined,
            error: {
                message: payload.message,
                stack: payload.stack,
                name: payload.name,
            },
            messageStableSignature: MESSAGE_STABLE_SIGNATURE,
            messageSourceId: manifest.name,
            messageVersion: manifest.version,
        };

        const message = testSubject.createMessage(command, payload);

        expect(message).toEqual(expectedMessage);
    });

    test('the shape of our window messages must match the shape/signature our partner teams test for', () => {
        const command = 'command1';
        const responseId = 'responseId';
        const payload = {};
        const actualMessage = testSubject.createMessage(command, payload, responseId);

        expect(typeof actualMessage).toBe('object');

        // Using strings instead of strongly typed names to avoid accidentally tool-refactoring the names/values
        // such that this test still passes but our partners break; those partners depend on this *exact* format
        // to distinguish our messages from unknown/assumed-malicious messages.
        expect(actualMessage['messageStableSignature']).toBe(
            'e467510c-ca1f-47df-ace1-a39f7f0678c9',
        );
    });
});
