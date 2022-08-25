// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StoreHub } from 'background/stores/store-hub';
import { Logger } from 'common/logging/logger';
import { flushSettledPromises } from 'tests/common/flush-settled-promises';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { BaseStore } from '../../../../common/base-store';
import { StateDispatcher } from '../../../../common/state-dispatcher';
import { StoreType } from '../../../../common/types/store-type';
import {
    StoreUpdateMessage,
    storeUpdateMessageType,
} from '../../../../common/types/store-update-message';

describe('StateDispatcherTest', () => {
    test('fire changed event on initialize', async () => {
        const newstoreData: StoreStubData = { value: 'testValue' };
        const expectedMessage: StoreUpdateMessage<StoreStubData> = {
            messageType: storeUpdateMessageType,
            storeId: 'testStoreId',
            storeType: StoreType.TabContextStore,
            payload: newstoreData,
        };

        const storeMock: IMock<BaseStore<StoreStubData, Promise<void>>> =
            Mock.ofType<BaseStore<StoreStubData, Promise<void>>>();
        const storeHubStrictMock = Mock.ofType<StoreHubStub>(null, MockBehavior.Strict);
        storeHubStrictMock
            .setup(hub => hub.getAllStores())
            .returns(() => [storeMock.object])
            .verifiable(Times.once());
        storeHubStrictMock
            .setup(hub => hub.getStoreType())
            .returns(() => StoreType.TabContextStore)
            .verifiable(Times.once());

        storeMock
            .setup(sm => sm.getId())
            .returns(() => expectedMessage.storeId)
            .verifiable();
        storeMock
            .setup(sm => sm.getState())
            .returns(() => newstoreData)
            .verifiable();

        const broadcastMock = Mock.ofType<(message: Object) => Promise<void>>();
        broadcastMock
            .setup(bc => bc(It.isValue(expectedMessage)))
            .returns(() => Promise.resolve())
            .verifiable();

        const loggerMock = Mock.ofType<Logger>();
        const stateDispatcher = new StateDispatcher(
            broadcastMock.object,
            storeHubStrictMock.object,
            loggerMock.object,
        );
        await stateDispatcher.initialize();

        storeMock.verifyAll();
        broadcastMock.verifyAll();
    });

    test('fire changed event from store', async () => {
        const newstoreData: StoreStubData = { value: 'testValue' };
        const expectedMessage: StoreUpdateMessage<StoreStubData> = {
            messageType: storeUpdateMessageType,
            storeId: 'testStoreId',
            storeType: StoreType.TabContextStore,
            payload: newstoreData,
        };

        let privateDispatcher: Function;
        const storeMock: IMock<BaseStore<StoreStubData, Promise<void>>> =
            Mock.ofType<BaseStore<StoreStubData, Promise<void>>>();
        const storeHubMock = Mock.ofType<StoreHubStub>(null, MockBehavior.Strict);

        storeHubMock.setup(hub => hub.getAllStores()).returns(() => [storeMock.object]);
        storeHubMock.setup(hub => hub.getStoreType()).returns(() => StoreType.TabContextStore);
        storeMock.setup(sm => sm.getId()).returns(() => expectedMessage.storeId);
        storeMock.setup(sm => sm.getState()).returns(() => newstoreData);
        storeMock
            .setup(sm =>
                sm.addChangedListener(
                    It.is<(args?: unknown) => Promise<void>>(handler => {
                        return handler !== null;
                    }),
                ),
            )
            .callback(action => {
                privateDispatcher = action;
            });

        const broadcastMock = Mock.ofType<(message: Object) => Promise<void>>();
        broadcastMock.setup(m => m(It.isAny())).returns(() => Promise.resolve());

        const loggerMock = Mock.ofType<Logger>();
        const stateDispatcher = new StateDispatcher(
            broadcastMock.object,
            storeHubMock.object,
            loggerMock.object,
        );
        await stateDispatcher.initialize();

        broadcastMock.reset();
        broadcastMock
            .setup(m => m(expectedMessage))
            .returns(() => Promise.resolve())
            .verifiable(Times.once());

        privateDispatcher.call(stateDispatcher);

        broadcastMock.verifyAll();
    });

    test('propagate exceptions in broadcasting changes to logger.error', async () => {
        const newstoreData: StoreStubData = { value: 'testValue' };
        const expectedMessage: StoreUpdateMessage<StoreStubData> = {
            messageType: storeUpdateMessageType,
            storeId: 'testStoreId',
            storeType: StoreType.TabContextStore,
            payload: newstoreData,
        };

        let privateDispatcher: Function;
        const storeMock: IMock<BaseStore<StoreStubData, Promise<void>>> =
            Mock.ofType<BaseStore<StoreStubData, Promise<void>>>();
        const storeHubMock = Mock.ofType<StoreHubStub>(null, MockBehavior.Strict);

        storeHubMock.setup(hub => hub.getAllStores()).returns(() => [storeMock.object]);
        storeHubMock.setup(hub => hub.getStoreType()).returns(() => StoreType.TabContextStore);
        storeMock.setup(sm => sm.getId()).returns(() => expectedMessage.storeId);
        storeMock.setup(sm => sm.getState()).returns(() => newstoreData);
        storeMock
            .setup(sm =>
                sm.addChangedListener(
                    It.is<(args?: unknown) => Promise<void>>(handler => {
                        return handler !== null;
                    }),
                ),
            )
            .callback(action => {
                privateDispatcher = action;
            });

        const expectedError = 'expected broadcastMessage error';
        const broadcastMock = Mock.ofType<(message: Object) => Promise<void>>();
        broadcastMock.setup(m => m(It.isAny())).returns(() => Promise.resolve());

        const loggerMock = Mock.ofType<Logger>();
        loggerMock.setup(m => m.error(expectedError)).verifiable(Times.once());
        const stateDispatcher = new StateDispatcher(
            broadcastMock.object,
            storeHubMock.object,
            loggerMock.object,
        );
        await stateDispatcher.initialize();

        broadcastMock.reset();
        broadcastMock.setup(m => m(It.isAny())).returns(() => Promise.reject(expectedError));

        privateDispatcher.call(stateDispatcher);
        await flushSettledPromises();

        loggerMock.verifyAll();
    });
});

class StoreHubStub implements StoreHub {
    public getAllStores(): BaseStore<any, Promise<void>>[] {
        throw new Error('Method not implemented.');
    }
    public getStoreType(): StoreType {
        throw new Error('Method not implemented.');
    }
}

interface StoreStubData {
    value: string;
}
