// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IPC_MESSAGE_CHANNEL_NAME } from 'electron/ipc/ipc-channel-names';
import { IpcMessageDispatcher } from 'electron/ipc/ipc-message-dispatcher';

describe('IpcMessageDispatcher', () => {
    it('should send dispatched messages as-is on IPC_MESSAGE_CHANNEL_NAME to each registered sink', () => {
        const stubMessage = { messageType: 'test message', payload: 'test payload' };

        const testSubject = new IpcMessageDispatcher();
        const mockSink = jest.fn();
        testSubject.registerMessageSink(mockSink);

        testSubject.dispatchMessage(stubMessage);

        expect(mockSink.mock.calls).toEqual([[IPC_MESSAGE_CHANNEL_NAME, stubMessage]]);
    });

    it('should stop dispatching messages to unregistered sinks', () => {
        const testSubject = new IpcMessageDispatcher();
        const mockSink = jest.fn();
        testSubject.registerMessageSink(mockSink);
        testSubject.unregisterMessageSink(mockSink);

        testSubject.dispatchMessage({ messageType: 'test message', payload: 'test payload' });

        expect(mockSink.mock.calls.length).toBe(0);
    });
});
