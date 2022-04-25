// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StoreUpdateMessageDistributor } from 'common/store-update-message-distributor';
import { IMock, It, Mock } from 'typemoq';
import { GenericStoreMessageTypes } from '../../../../common/constants/generic-store-messages-types';
import { StoreProxy } from '../../../../common/store-proxy';
import { StoreType } from '../../../../common/types/store-type';
import { StoreUpdateMessage } from '../../../../common/types/store-update-message';

class TestableStoreProxy<TState> extends StoreProxy<TState> {
    public emitChangedCallCount: number = 0;

    public emitChanged(): void {
        this.emitChangedCallCount++;
    }
}

describe('StoreProxyTest', () => {
    const expectedData = 'test';
    const storeId = 'TestStore';
    let onChange: (message: StoreUpdateMessage<string>) => void;
    let messageDistributorMock: IMock<StoreUpdateMessageDistributor>;

    let testSubject: TestableStoreProxy<string>;

    beforeEach(() => {
        messageDistributorMock = Mock.ofType<StoreUpdateMessageDistributor>();
        messageDistributorMock
            .setup(m => m.registerStoreUpdateListener(storeId, It.isAny()))
            .callback((storeId, callback) => (onChange = callback))
            .verifiable();

        testSubject = new TestableStoreProxy('TestStore', messageDistributorMock.object);
    });

    afterEach(() => {
        messageDistributorMock.verifyAll();
    });

    test('onChange when state is different', () => {
        onChange.call(testSubject, {
            messageType: GenericStoreMessageTypes.storeStateChanged,
            tabId: 1,
            storeId: 'TestStore',
            storeType: StoreType.TabContextStore,
            isStoreUpdateMessage: true,
            payload: 'test',
        } as StoreUpdateMessage<string>);

        expect(testSubject.getState()).toEqual(expectedData);
        expect(testSubject.emitChangedCallCount).toBe(1);
    });

    test('onChange when state is same', () => {
        const stateUpdateMessage: StoreUpdateMessage<string> = {
            messageType: GenericStoreMessageTypes.storeStateChanged,
            tabId: 1,
            storeId: 'TestStore',
            isStoreUpdateMessage: true,
            storeType: StoreType.TabContextStore,
            payload: 'test',
        };

        onChange.call(testSubject, stateUpdateMessage);
        testSubject.emitChangedCallCount = 0;

        // calling store update event again with same data
        onChange.call(testSubject, stateUpdateMessage);

        expect(testSubject.getState()).toEqual(expectedData);
        expect(testSubject.emitChangedCallCount).toBe(0);
    });

    test('onChange message type is not GenericStoreMessageTypes.storeChanged', () => {
        onChange.call(testSubject, {
            messageType: 'ANOTHER_KIND_OF_MESSAGE',
            tabId: 1,
            storeType: StoreType.TabContextStore,
            storeId: 'TestStore',
            payload: 'store state',
        } as unknown as StoreUpdateMessage<string>);

        expect(testSubject.getState()).not.toBeDefined();
        expect(testSubject.emitChangedCallCount).toBe(0);
    });

    test('onChange message is store update message', () => {
        onChange.call(testSubject, {
            messageType: GenericStoreMessageTypes.storeStateChanged,
            tabId: 1,
            storeType: StoreType.TabContextStore,
            storeId: 'TestStore',
            payload: 'store state',
        } as StoreUpdateMessage<string>);

        expect(testSubject.getState()).not.toBeDefined();
        expect(testSubject.emitChangedCallCount).toBe(0);
    });
});
