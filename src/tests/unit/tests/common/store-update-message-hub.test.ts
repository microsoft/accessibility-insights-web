// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { getStoreStateMessage } from 'common/messages';
import { StoreUpdateMessageHub } from 'common/store-update-message-hub';
import { StoreNames } from 'common/stores/store-names';
import { StoreType } from 'common/types/store-type';
import { StoreUpdateMessage, storeUpdateMessageType } from 'common/types/store-update-message';
import { IMock, Mock, Times } from 'typemoq';

describe(StoreUpdateMessageHub, () => {
    const tabId = 1;
    const storeId = 'TestStore';
    let registeredListener: jest.Mock;

    let mockDispatcher: IMock<ActionMessageDispatcher>;

    let tabContextMessage: StoreUpdateMessage<string>;
    let globalStoreMessage: StoreUpdateMessage<string>;
    let listenerPromise: Promise<void>;

    let testSubject: StoreUpdateMessageHub;

    beforeEach(() => {
        mockDispatcher = Mock.ofType<ActionMessageDispatcher>();

        listenerPromise = Promise.resolve();
        registeredListener = jest.fn(() => listenerPromise);

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

        testSubject = new StoreUpdateMessageHub(mockDispatcher.object, tabId);

        testSubject.registerStoreUpdateListener(storeId, registeredListener);
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
        const result = testSubject.handleBrowserMessage(message);

        expect(registeredListener).toBeCalledTimes(0);
        expect(result).toBeUndefined();
    });

    it('sends an initial getStoreState message on registration', () => {
        const expectedMessage = getStoreStateMessage(StoreNames.FeatureFlagStore);
        mockDispatcher.setup(m => m.dispatchType(expectedMessage)).verifiable(Times.once());

        testSubject.registerStoreUpdateListener(StoreNames[StoreNames.FeatureFlagStore], () => {});

        mockDispatcher.verifyAll();
    });

    it('ignores if no listener is registered for this message', () => {
        const message = {
            ...tabContextMessage,
            storeId: 'AnotherStore',
        };

        const result = testSubject.handleBrowserMessage(message);

        expect(registeredListener).toBeCalledTimes(0);
        expect(result).toBeUndefined();
    });

    it('Calls registered listener for tab context store message', async () => {
        const resultPromise = testSubject.handleBrowserMessage(tabContextMessage);

        expect(resultPromise).toBe(listenerPromise);
        await resultPromise;

        expect(registeredListener).toBeCalledWith(tabContextMessage);
    });

    it('Calls registered listener for global store message', async () => {
        const resultPromise = testSubject.handleBrowserMessage(globalStoreMessage);

        expect(resultPromise).toBe(listenerPromise);
        await resultPromise;

        expect(registeredListener).toBeCalledWith(globalStoreMessage);
    });

    it('Calls registered listener if not created with a tab id', async () => {
        testSubject = new StoreUpdateMessageHub(mockDispatcher.object);
        testSubject.registerStoreUpdateListener(storeId, registeredListener);

        const resultPromise = testSubject.handleBrowserMessage(tabContextMessage);

        expect(resultPromise).toBe(listenerPromise);
        await resultPromise;

        expect(registeredListener).toBeCalledWith(tabContextMessage);
    });

    it('Does not overwrite listeners for the same store', () => {
        expect(() => testSubject.registerStoreUpdateListener(storeId, () => null)).toThrow();
    });

    it('Registers multiple listeners and distributes messages correctly', async () => {
        const anotherStoreId = 'AnotherStore';
        const anotherListener = jest.fn(() => Promise.resolve());

        const messageForStore = { ...tabContextMessage };
        const messageForAnotherStore = { ...tabContextMessage, storeId: anotherStoreId };

        testSubject.registerStoreUpdateListener(anotherStoreId, anotherListener);

        const resultPromise1 = testSubject.handleBrowserMessage(messageForStore);
        const resultPromise2 = testSubject.handleBrowserMessage(messageForAnotherStore);

        expect(resultPromise1).toBeInstanceOf(Promise);
        expect(resultPromise2).toBeInstanceOf(Promise);

        await resultPromise1;
        await resultPromise2;

        expect(registeredListener).toBeCalledWith(messageForStore);
        expect(anotherListener).toBeCalledWith(messageForAnotherStore);
    });
});
