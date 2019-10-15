// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Interpreter } from 'background/interpreter';
import { Message } from 'common/message';
import { ActionMessageDispatcherAdapter } from 'electron/adapters/action-message-dispatcher-adapter';
import { Mock, Times } from 'typemoq';

describe('ActionMessageDispatcherAdapter', () => {
    it('dispatchMessage', () => {
        const interpreterMock = Mock.ofType<Interpreter>();

        const message = { messageType: 'test-message-type' } as Message;

        const testSubject = new ActionMessageDispatcherAdapter(interpreterMock.object);

        testSubject.dispatchMessage(message);

        interpreterMock.verify(interpreter => interpreter.interpret(message), Times.once());
    });
});
