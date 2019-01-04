// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { IStoreHub } from '../../../background/stores/istore-hub';
import { GenericStoreMessageTypes } from '../../../common/constants/generic-store-messages-types';
import { IBaseStore } from '../../../common/istore';
import { StateDispatcher } from '../../../common/state-dispatcher';
import { StoreType } from '../../../common/types/store-type';
import { StoreUpdateMessage } from '../../../common/types/store-update-message';
import { StoreStub } from '../../Common/store-stub';

describe('StateDispatcherTest', () => {
    test('fire changed event on initialize', () => {
        const newstoreData: StoreStubData = { value: 'testValue' };
        const expectedMessage: StoreUpdateMessage<StoreStubData> = {
            isStoreUpdateMessage: true,
            type: GenericStoreMessageTypes.storeStateChanged,
            storeId: 'testStoreId',
            storeType: StoreType.TabContextStore,
            payload: newstoreData,
        };

        const storeMock: IMock<IBaseStore<StoreStubData>> = Mock.ofType<IBaseStore<StoreStubData>>();
        const storeHubStrictMock = Mock.ofType<StoreHubStub>(null, MockBehavior.Strict);
        storeHubStrictMock.
            setup(x => x.getAllStores())
            .returns(() => [storeMock.object])
            .verifiable(Times.once());
        storeHubStrictMock.
            setup(x => x.getStoreType())
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

        const defaultBoardcastMessage = (message: Object) => { };
        const broadcastMock = Mock.ofInstance<(message: Object) => void>(defaultBoardcastMessage);
        broadcastMock
            .setup(bc => bc(It.isValue(expectedMessage)))
            .verifiable();

        const stateDispatcher = new StateDispatcher(broadcastMock.object, storeHubStrictMock.object);
        stateDispatcher.initialize();

        storeMock.verifyAll();
        broadcastMock.verifyAll();
    });

    test('fire changed event from store', () => {
        const newstoreData: StoreStubData = { value: 'testValue' };
        const expectedMessage: StoreUpdateMessage<StoreStubData> = {
            isStoreUpdateMessage: true,
            type: GenericStoreMessageTypes.storeStateChanged,
            storeId: 'testStoreId',
            storeType: StoreType.TabContextStore,
            payload: newstoreData,
        };

        let privateDispatcher: Function;
        const storeMock: IMock<IBaseStore<StoreStubData>> = Mock.ofType<IBaseStore<StoreStubData>>(StoreStub);
        const storeHubMock = Mock.ofType<StoreHubStub>(null, MockBehavior.Strict);

        storeHubMock.
            setup(x => x.getAllStores())
            .returns(() => [storeMock.object]);
        storeHubMock.
            setup(x => x.getStoreType())
            .returns(() => StoreType.TabContextStore);
        storeMock
            .setup(sm => sm.getId())
            .returns(() => expectedMessage.storeId);
        storeMock
            .setup(sm => sm.getState())
            .returns(() => newstoreData);
        storeMock
            .setup(sm => sm.addChangedListener(It.is<Function>(handler => { return handler !== null; })))
            .callback(action => { privateDispatcher = action; });

        const defaultBoardcastMessage = (message: Object) => { };
        const broadcastMock = Mock.ofInstance<(message: Object) => void>(defaultBoardcastMessage);

        const stateDispatcher = new StateDispatcher(broadcastMock.object, storeHubMock.object);
        stateDispatcher.initialize();
        broadcastMock.reset();

        privateDispatcher.call(stateDispatcher);

        broadcastMock.verify(bc => bc(It.isValue(expectedMessage)), Times.once());
    });
});

class StoreHubStub implements IStoreHub {
    public getAllStores(): IBaseStore<any>[] {
        throw new Error('Method not implemented.');
    }
    public getStoreType(): StoreType {
        throw new Error('Method not implemented.');
    }
}

interface StoreStubData {
    value: string;
}
