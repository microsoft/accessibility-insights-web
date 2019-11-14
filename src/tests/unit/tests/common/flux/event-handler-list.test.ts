// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';

import { EventHandlerList } from '../../../../../common/flux/event-handler-list';
import { FunctionPPR } from '../../../../../types/common-types';

describe('HandlerTest', () => {
    let testObject: EventHandlerList<any, any>;
    let firstHandlerMock: IMock<FunctionPPR<any, any, any>>;
    let secondHandlerMock: IMock<FunctionPPR<any, any, any>>;
    const senderStub = { id: 'the-sender' };
    const argsStub = { arg: 'value' };

    beforeEach(() => {
        firstHandlerMock = Mock.ofInstance((sender, args) => null);
        secondHandlerMock = Mock.ofInstance((sender, args) => null);

        testObject = new EventHandlerList();
    });

    test('invokeHandlers, no handlers', () => {
        testObject.invokeHandlers(senderStub, argsStub);
    });

    test('subscribe and invokeHandlers (2 handlers)', () => {
        firstHandlerMock
            .setup(hm => hm(senderStub, argsStub))
            .verifiable(Times.once());

        secondHandlerMock
            .setup(hm => hm(senderStub, argsStub))
            .verifiable(Times.once());

        testObject.subscribe(firstHandlerMock.object);
        testObject.subscribe(secondHandlerMock.object);

        testObject.invokeHandlers(senderStub, argsStub);

        firstHandlerMock.verifyAll();
        secondHandlerMock.verifyAll();
    });

    test('unsuscribe', () => {
        firstHandlerMock
            .setup(hm => hm(senderStub, argsStub))
            .verifiable(Times.once());

        testObject.subscribe(firstHandlerMock.object);

        testObject.invokeHandlers(senderStub, argsStub);

        firstHandlerMock.verifyAll();

        firstHandlerMock.reset();

        firstHandlerMock
            .setup(hm => hm(It.isAny(), It.isAny()))
            .verifiable(Times.never());

        testObject.unsubscribe(firstHandlerMock.object);

        testObject.invokeHandlers(senderStub, argsStub);

        firstHandlerMock.verifyAll();
    });

    test('unsuscribe, null handler', () => {
        firstHandlerMock
            .setup(hm => hm(senderStub, argsStub))
            .verifiable(Times.once());

        testObject.subscribe(firstHandlerMock.object);
        testObject.unsubscribe(null);

        testObject.invokeHandlers(senderStub, argsStub);

        firstHandlerMock.verifyAll();
    });
});
