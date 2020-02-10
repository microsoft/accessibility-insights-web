// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { It, Mock } from 'typemoq';

import { BrowserAdapter } from '../../../../common/browser-adapters/browser-adapter';
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
    test('onChange for this proxy', () => {
        const expectedData = 'test';
        let onChange: (message: StoreUpdateMessage<string>) => void;
        const browserAdapterMock = Mock.ofType<BrowserAdapter>();
        browserAdapterMock
            .setup(it => it.addListenerOnMessage(It.isAny()))
            .callback(callback => {
                onChange = callback;
            })
            .verifiable();

        const storeProxy = new TestableStoreProxy('TestStore', browserAdapterMock.object, 1);

        onChange.call(storeProxy, {
            messageType: GenericStoreMessageTypes.storeStateChanged,
            tabId: 1,
            storeId: 'TestStore',
            storeType: StoreType.TabContextStore,
            isStoreUpdateMessage: true,
            payload: 'test',
        } as StoreUpdateMessage<string>);

        expect(storeProxy.getState()).toEqual(expectedData);
        expect(storeProxy.emitChangedCallCount).toBe(1);
        browserAdapterMock.verifyAll();
    });

    test('onChange for this proxy, when state is same', () => {
        const expectedData = 'test';
        let onChange: () => void;
        const browserAdapterMock = Mock.ofType<BrowserAdapter>();

        browserAdapterMock
            .setup(it => it.addListenerOnMessage(It.isAny()))
            .callback(callback => {
                onChange = callback;
            })
            .verifiable();

        const storeProxy = new TestableStoreProxy('TestStore', browserAdapterMock.object, 1);

        const stateUpdateMessage: StoreUpdateMessage<string> = {
            messageType: GenericStoreMessageTypes.storeStateChanged,
            tabId: 1,
            storeId: 'TestStore',
            isStoreUpdateMessage: true,
            storeType: StoreType.TabContextStore,
            payload: 'test',
        };

        onChange.call(storeProxy, stateUpdateMessage);
        storeProxy.emitChangedCallCount = 0;

        // calling store update event again with same data
        onChange.call(storeProxy, stateUpdateMessage);

        expect(storeProxy.getState()).toEqual(expectedData);
        expect(storeProxy.emitChangedCallCount).toBe(0);
        browserAdapterMock.verifyAll();
    });

    test('onChange for this proxy when tab id is null in storeProxy', () => {
        const expectedData = 'test';
        let onChange: (message: StoreUpdateMessage<string>) => void;
        const browserAdapterMock = Mock.ofType<BrowserAdapter>();
        browserAdapterMock
            .setup(it => it.addListenerOnMessage(It.isAny()))
            .callback(callback => {
                onChange = callback;
            })
            .verifiable();

        const storeProxy = new TestableStoreProxy('TestStore', browserAdapterMock.object);

        onChange.call(storeProxy, {
            messageType: GenericStoreMessageTypes.storeStateChanged,
            tabId: 1,
            storeId: 'TestStore',
            storeType: StoreType.TabContextStore,
            isStoreUpdateMessage: true,
            payload: 'test',
        } as StoreUpdateMessage<string>);

        expect(storeProxy.getState()).toEqual(expectedData);
        expect(storeProxy.emitChangedCallCount).toBe(1);
        browserAdapterMock.verifyAll();
    });

    test('onChange for another proxy', () => {
        let onChange: (message: StoreUpdateMessage<string>) => void;
        const browserAdapterMock = Mock.ofType<BrowserAdapter>();
        browserAdapterMock
            .setup(it => it.addListenerOnMessage(It.isAny()))
            .callback(callback => {
                onChange = callback;
            })
            .verifiable();

        const storeProxy = new TestableStoreProxy('TestStore', browserAdapterMock.object, 1);

        onChange.call(storeProxy, {
            messageType: GenericStoreMessageTypes.storeStateChanged,
            tabId: 1,
            storeId: 'AnotherProxy',
            storeType: StoreType.TabContextStore,
            isStoreUpdateMessage: true,
            payload: 'this value should not affect TestStoreProxy',
        } as StoreUpdateMessage<string>);

        expect(storeProxy.getState()).not.toBeDefined();
        expect(storeProxy.emitChangedCallCount).toBe(0);
        browserAdapterMock.verifyAll();
    });

    test('onChange message is for global store', () => {
        let onChange: (message: StoreUpdateMessage<string>) => void;
        const expectedData = 'test';
        const browserAdapterMock = Mock.ofType<BrowserAdapter>();
        browserAdapterMock
            .setup(it => it.addListenerOnMessage(It.isAny()))
            .callback(callback => {
                onChange = callback;
            })
            .verifiable();

        const storeProxy = new TestableStoreProxy('GlobalStoreProxy', browserAdapterMock.object, 1);

        onChange.call(storeProxy, {
            messageType: GenericStoreMessageTypes.storeStateChanged,
            storeType: StoreType.GlobalStore,
            storeId: 'GlobalStoreProxy',
            isStoreUpdateMessage: true,
            payload: expectedData,
        } as StoreUpdateMessage<string>);

        expect(storeProxy.getState()).toEqual(expectedData);
        expect(storeProxy.emitChangedCallCount).toBe(1);
        browserAdapterMock.verifyAll();
    });

    test('onChange for another tab', () => {
        let onChange: (message: StoreUpdateMessage<string>) => void;
        const browserAdapterMock = Mock.ofType<BrowserAdapter>();
        browserAdapterMock
            .setup(it => it.addListenerOnMessage(It.isAny()))
            .callback(callback => {
                onChange = callback;
            })
            .verifiable();

        const storeProxy = new TestableStoreProxy('TestStore', browserAdapterMock.object, 1);

        onChange.call(storeProxy, {
            messageType: GenericStoreMessageTypes.storeStateChanged,
            tabId: 2,
            storeType: StoreType.TabContextStore,
            storeId: 'TestStore',
            isStoreUpdateMessage: true,
            payload: 'another store state',
        } as StoreUpdateMessage<string>);

        expect(storeProxy.getState()).not.toBeDefined();
        expect(storeProxy.emitChangedCallCount).toBe(0);
        browserAdapterMock.verifyAll();
    });

    test('onChange message type is not GenericStoreMessageTypes.storeChanged', () => {
        let onChange: (message: StoreUpdateMessage<string>) => void;
        const browserAdapterMock = Mock.ofType<BrowserAdapter>();
        browserAdapterMock
            .setup(it => it.addListenerOnMessage(It.isAny()))
            .callback(callback => {
                onChange = callback;
            })
            .verifiable();

        const storeProxy = new TestableStoreProxy('TestStore', browserAdapterMock.object, 1);

        onChange.call(storeProxy, {
            messageType: 'ANOTHER_KIND_OF_MESSAGE',
            tabId: 1,
            storeType: StoreType.TabContextStore,
            storeId: 'TestStore',
            isStoreUpdateMessage: true,
            payload: 'store state',
        } as StoreUpdateMessage<string>);

        expect(storeProxy.getState()).not.toBeDefined();
        expect(storeProxy.emitChangedCallCount).toBe(0);
        browserAdapterMock.verifyAll();
    });

    test('onChange message is store update message', () => {
        let onChange: (message: StoreUpdateMessage<string>) => void;
        const browserAdapterMock = Mock.ofType<BrowserAdapter>();
        browserAdapterMock
            .setup(it => it.addListenerOnMessage(It.isAny()))
            .callback(callback => {
                onChange = callback;
            })
            .verifiable();

        const storeProxy = new TestableStoreProxy('TestStore', browserAdapterMock.object, 1);

        onChange.call(storeProxy, {
            messageType: 'STORE_UPDATED',
            tabId: 1,
            storeType: StoreType.TabContextStore,
            storeId: 'TestStore',
            payload: 'store state',
        } as StoreUpdateMessage<string>);

        expect(storeProxy.getState()).not.toBeDefined();
        expect(storeProxy.emitChangedCallCount).toBe(0);
        browserAdapterMock.verifyAll();
    });
});
