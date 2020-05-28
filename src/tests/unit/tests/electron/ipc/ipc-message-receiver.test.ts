// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Interpreter } from 'background/interpreter';
import { Logger } from 'common/logging/logger';
import { InterpreterMessage } from 'common/message';
import { IpcRenderer } from 'electron';
import { IPC_MESSAGE_CHANNEL_NAME } from 'electron/ipc/ipc-channel-names';
import { IpcMessageReceiver } from 'electron/ipc/ipc-message-receiver';
import { isFunction } from 'lodash';
import { IMock, It, Mock, Times } from 'typemoq';

describe('IpcMessageReceiver', () => {
    let testSubject: IpcMessageReceiver;

    let mockInterpreter: IMock<Interpreter>;
    let mockIpcRenderer: IMock<IpcRenderer>;
    let mockLogger: IMock<Logger>;
    let testSubjectMessageHandler: Function;

    let sentMessages: InterpreterMessage[];

    const validIpcEvent = { senderId: 0 };
    const validMessage = { messageType: 'test-message' };

    beforeEach(() => {
        mockInterpreter = Mock.ofType<Interpreter>();
        mockIpcRenderer = Mock.ofType<IpcRenderer>();
        mockLogger = Mock.ofType<Logger>();
        testSubjectMessageHandler = null;
        sentMessages = [];

        mockIpcRenderer
            .setup(m => m.on(IPC_MESSAGE_CHANNEL_NAME, It.is(isFunction)))
            .callback((channelName, handler) => {
                testSubjectMessageHandler = handler;
            })
            .verifiable();

        mockInterpreter
            .setup(m => m.interpret(It.isAny()))
            .callback(message => sentMessages.push(message));

        testSubject = new IpcMessageReceiver(
            mockInterpreter.object,
            mockIpcRenderer.object,
            mockLogger.object,
        );
        testSubject.initialize();

        mockIpcRenderer.verifyAll();
    });

    it('rejects messages with events from non-main-process senderIds', () => {
        testSubjectMessageHandler({ senderId: 1 }, validMessage);

        expect(sentMessages).toEqual([]);
        mockLogger.verify(
            l => l.error('Ignoring unexpected message from non-main-process senderId'),
            Times.once(),
        );
    });

    it('rejects messages with no args', () => {
        testSubjectMessageHandler(validIpcEvent);

        expect(sentMessages).toEqual([]);
        mockLogger.verify(l => l.error('Ignoring malformated message args'), Times.once());
    });

    // prettier-ignore
    const invalidMessages = [
        null,
        undefined,
        'non-object',
        {},
        { messageType: null },
        { messageType: { notString: true } },
    ];

    it.each(invalidMessages)('rejects invalid message %p with error', message => {
        testSubjectMessageHandler(validIpcEvent, message);

        expect(sentMessages).toEqual([]);
        mockLogger.verify(l => l.error('Ignoring malformated message args'), Times.once());
    });

    // prettier-ignore
    const validMessages = [
        { messageType: 'no-payload' },
        { messageType: 'with-payload', payload: { someProp: true } },
    ];

    it.each(validMessages)('propagates well-formatted message %p as-is', message => {
        testSubjectMessageHandler(validIpcEvent, message);
        expect(sentMessages).toEqual([message]);
    });
});
