// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Interpreter } from 'background/interpreter';
import { Message } from 'common/message';
import { DirectActionMessageDispatcher } from 'electron/adapters/direct-action-message-dispatcher';
import { Mock, Times } from 'typemoq';

describe('DirectActionMessageDispatcher', () => {
    it('dispatchMessage', () => {
        const interpreterMock = Mock.ofType<Interpreter>();

        const message = { messageType: 'test-message-type' } as Message;

        const testSubject = new DirectActionMessageDispatcher(
            interpreterMock.object,
        );

        testSubject.dispatchMessage(message);

        interpreterMock.verify(
            interpreter => interpreter.interpret(message),
            Times.once(),
        );
    });
});
