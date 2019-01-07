// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock } from 'typemoq';

import { IClientChromeAdapter } from '../../../../../common/client-browser-adapter';
import { IWindowMessage, WindowMessageMarshaller } from '../../../../../injected/frameCommunicators/window-message-marshaller';

describe('WindowMessageMarshallerTests', () => {
    let testSubject: WindowMessageMarshaller;
    let messageIdToBeReturned: string;
    let browserAdapter: IMock<IClientChromeAdapter>;
    const messageSourceId = 'app id';
    const messageVersion = 'app version';
    let manifest: chrome.runtime.Manifest;

    beforeEach(() => {
        manifest = {
            name: messageSourceId,
            version: messageVersion,
        } as chrome.runtime.Manifest;

        browserAdapter = Mock.ofType<IClientChromeAdapter>();
        browserAdapter
            .setup(b => b.getManifest())
            .returns(() => manifest);

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
        JSON.stringify({ messageId: '12' } as IWindowMessage), // source & version missing
        JSON.stringify({ messageSourceId: messageSourceId } as IWindowMessage), // message id & version missing
        JSON.stringify({ messageVersion: messageVersion } as IWindowMessage), // source &  message id missing
        JSON.stringify({
            messageId: { unknownMessageIdType: true } as any,
            messageSourceId: messageSourceId,
            messageVersion: messageVersion,
        } as IWindowMessage),
        JSON.stringify({
            messageSourceId: 'unknown source id',
            messageVersion: messageVersion,
            messageId: '12',
        } as IWindowMessage),
        JSON.stringify({
            messageVersion: 'unknown version',
            message: { hasMessage: true },
            messageSourceId: messageSourceId,
            messageId: '12',
        } as IWindowMessage),

    ])('handleParsingUnknownData', message => {
        expect(testSubject.parseMessage(message)).toBeNull();
    });

    test.each([{
        message: { a: 1 },
        error: {
            message: 'error msg',
            stack: 'stack',
            name: 'name',
        },
        messageSourceId: messageSourceId,
        messageVersion: messageVersion,
        messageId: 'id1',
        command: 'someCommand',
    } as IWindowMessage, // with message
    {
        messageSourceId: messageSourceId,
        messageVersion: messageVersion,
        messageId: 'id1',
        command: 'someCommand',
    } as IWindowMessage, // without message
    ])('handleParsingValidData', message => {

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
            messageSourceId: manifest.name,
            messageVersion: manifest.version,
        };

        const message = testSubject.createMessage(command, payload);

        expect(message).toEqual(expectedMessage);
    });
});
