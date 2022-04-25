// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { IMock, It, Mock } from 'typemoq';
import { BrowserAdapter } from '../../../../common/browser-adapters/browser-adapter';
import { StoreUpdateMessageDistributor } from '../../../../common/store-update-message-distributor';
import { StoreType } from '../../../../common/types/store-type';
import {
    StoreUpdateMessage,
    storeUpdateMessageType,
} from '../../../../common/types/store-update-message';

describe(StoreUpdateMessageDistributor, () => {
    const tabId = 1;
    const storeId = 'TestStore';
    let browserAdapterMock: IMock<BrowserAdapter>;
    let onMessage: (message: StoreUpdateMessage<any>, sender?: any) => void;
    let registeredListener: jest.Mock;

    let tabContextMessage: StoreUpdateMessage<string>;
    let globalStoreMessage: StoreUpdateMessage<string>;

    let testSubject: StoreUpdateMessageDistributor;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>();
        browserAdapterMock
            .setup(b => b.addListenerOnMessage(It.isAny()))
            .callback(listener => (onMessage = listener));

        registeredListener = jest.fn();

        tabContextMessage = {
            messageType: storeUpdateMessageType,
            storeId,
            payload: 'store update payload',
            tabId,
            storeType: StoreType.TabContextStore,
        } as StoreUpdateMessage<string>;

        globalStoreMessage = {
            messageType: storeUpdateMessageType,
            storeId,
            payload: 'store update payload',
            tabId: null,
            storeType: StoreType.GlobalStore,
        } as StoreUpdateMessage<string>;

        testSubject = new StoreUpdateMessageDistributor(browserAdapterMock.object, tabId);

        testSubject.initialize();
        testSubject.registerStoreUpdateListener(storeId, registeredListener);
    });

    afterEach(() => {
        browserAdapterMock.verifyAll();
    });

    const invalidMessages: StoreUpdateMessage<string>[] = [
        {
            ...tabContextMessage,
            messageType: 'something else',
        } as unknown as StoreUpdateMessage<string>,
        { ...tabContextMessage, payload: undefined },
        { ...tabContextMessage, storeId: undefined },
        { ...tabContextMessage, tabId: tabId + 10 },
    ];
    it.each(invalidMessages)('ignores invalid message: %o', message => {
        onMessage(message);

        expect(registeredListener).toBeCalledTimes(0);
    });

    it('ignores if no listener is registered for this message', () => {
        const message = {
            ...tabContextMessage,
            storeId: 'AnotherStore',
        };

        onMessage(message);

        expect(registeredListener).toBeCalledTimes(0);
    });

    it('Calls registered listener for tab context store message', () => {
        onMessage(tabContextMessage);

        expect(registeredListener).toBeCalledWith(tabContextMessage);
    });

    it('Calls registered listener for global store message', () => {
        onMessage(globalStoreMessage);

        expect(registeredListener).toBeCalledWith(globalStoreMessage);
    });

    it('Does not overwrite listeners for the same store', () => {
        expect(() => testSubject.registerStoreUpdateListener(storeId, () => null)).toThrow();
    });

    it('Registers multiple listeners and distributes messages correctly', () => {
        const anotherStoreId = 'AnotherStore';
        const anotherListener = jest.fn();

        const messageForStore = { ...tabContextMessage };
        const messageForAnotherStore = { ...tabContextMessage, storeId: anotherStoreId };

        testSubject.registerStoreUpdateListener(anotherStoreId, anotherListener);

        onMessage(messageForStore);
        onMessage(messageForAnotherStore);

        expect(registeredListener).toBeCalledWith(messageForStore);
        expect(anotherListener).toBeCalledWith(messageForAnotherStore);
    });

    it('dispose removes message listener', () => {
        browserAdapterMock.setup(o => o.removeListenerOnMessage(onMessage)).verifiable();

        testSubject.dispose();
    });
});
