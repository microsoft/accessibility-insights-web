// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Interpreter } from 'background/interpreter';
import { PingResponder } from 'background/ping-responder';
import { Messages } from 'common/messages';
import { IMock, It, Mock, Times } from 'typemoq';

describe(PingResponder, () => {
    let mockInterpreter: IMock<Interpreter>;
    let testSubject: PingResponder;

    beforeEach(() => {
        mockInterpreter = Mock.ofType<Interpreter>();
        testSubject = new PingResponder(mockInterpreter.object);
    });

    it('registers an async ping message handler that resolves with pong', async () => {
        let pingHandler: Function;
        mockInterpreter
            .setup(m => m.registerTypeToPayloadCallback(Messages.Common.Ping, It.isAny()))
            .callback((message, callback) => {
                pingHandler = callback;
            })
            .verifiable(Times.once());

        testSubject.initialize();

        mockInterpreter.verifyAll();
        await expect(pingHandler()).resolves.toBe('pong');
    });
});
