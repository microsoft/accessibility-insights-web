// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';
import { EventHandlerList } from '../../../../../common/flux/event-handler-list';
import { FunctionPPR } from '../../../../../types/common-types';

describe('HandlerTest', () => {
    describe('SyncCallbacks', () => {
        let testObject: EventHandlerList<any, any, void>;
        let firstSyncHandlerMock: IMock<FunctionPPR<any, any, void>>;
        let secondSyncHandlerMock: IMock<FunctionPPR<any, any, void>>;
        const senderStub = { id: 'the-sender' };
        const argsStub = { arg: 'value' };

        beforeEach(() => {
            firstSyncHandlerMock = Mock.ofInstance((sender, args) => null);
            secondSyncHandlerMock = Mock.ofInstance((sender, args) => null);

            testObject = new EventHandlerList();
        });

        test('invokeHandlers, no handlers', () => {
            testObject.invokeHandlers(senderStub, argsStub);
        });

        test('subscribe and invokeHandlers (2 sync handlers)', () => {
            firstSyncHandlerMock.setup(hm => hm(senderStub, argsStub)).verifiable(Times.once());

            secondSyncHandlerMock.setup(hm => hm(senderStub, argsStub)).verifiable(Times.once());

            testObject.subscribe(firstSyncHandlerMock.object);
            testObject.subscribe(secondSyncHandlerMock.object);

            const result = testObject.invokeHandlers(senderStub, argsStub);
            expect(result).toBeUndefined();

            firstSyncHandlerMock.verifyAll();
            secondSyncHandlerMock.verifyAll();
        });

        test('unsuscribe', () => {
            firstSyncHandlerMock.setup(hm => hm(senderStub, argsStub)).verifiable(Times.once());

            testObject.subscribe(firstSyncHandlerMock.object);

            let result = testObject.invokeHandlers(senderStub, argsStub);
            expect(result).toBeUndefined();

            firstSyncHandlerMock.verifyAll();

            firstSyncHandlerMock.reset();

            firstSyncHandlerMock.setup(hm => hm(It.isAny(), It.isAny())).verifiable(Times.never());

            testObject.unsubscribe(firstSyncHandlerMock.object);

            result = testObject.invokeHandlers(senderStub, argsStub);
            expect(result).toBeUndefined();

            firstSyncHandlerMock.verifyAll();
        });

        test('unsuscribe, null handler', () => {
            firstSyncHandlerMock.setup(hm => hm(senderStub, argsStub)).verifiable(Times.once());

            testObject.subscribe(firstSyncHandlerMock.object);
            testObject.unsubscribe(null);

            const result = testObject.invokeHandlers(senderStub, argsStub);
            expect(result).toBeUndefined();

            firstSyncHandlerMock.verifyAll();
        });
    });
    describe('AsyncCallbacks', () => {
        let testObject: EventHandlerList<any, any, Promise<void>>;
        let firstAsyncHandlerMock: IMock<FunctionPPR<any, any, Promise<void>>>;
        let secondAsyncHandlerMock: IMock<FunctionPPR<any, any, Promise<void>>>;
        const senderStub = { id: 'the-sender' };
        const argsStub = { arg: 'value' };

        beforeEach(() => {
            firstAsyncHandlerMock = Mock.ofInstance((sender, args) => Promise.resolve());
            secondAsyncHandlerMock = Mock.ofInstance((sender, args) => Promise.resolve());

            testObject = new EventHandlerList();
        });

        test('subscribe and invokeHandlers (2 async handlers)', async () => {
            firstAsyncHandlerMock
                .setup(hm => hm(senderStub, argsStub))
                .returns(hm => Promise.resolve())
                .verifiable(Times.once());

            secondAsyncHandlerMock
                .setup(hm => hm(senderStub, argsStub))
                .returns(hm => Promise.resolve())
                .verifiable(Times.once());

            testObject.subscribe(firstAsyncHandlerMock.object);
            testObject.subscribe(secondAsyncHandlerMock.object);

            const result = testObject.invokeHandlers(senderStub, argsStub);
            await expect(result).resolves.toBeUndefined();

            firstAsyncHandlerMock.verifyAll();
            secondAsyncHandlerMock.verifyAll();
        });
    });
});
