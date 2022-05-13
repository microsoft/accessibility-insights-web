// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { StoreUpdateMessageHub } from '../../../../common/store-update-message-hub';
import { StoreType } from '../../../../common/types/store-type';
import {
    StoreUpdateMessage,
    storeUpdateMessageType,
} from '../../../../common/types/store-update-message';

describe(StoreUpdateMessageHub, () => {
    const tabId = 1;
    const storeId = 'TestStore';
    let registeredListener: jest.Mock;

    let tabContextMessage: StoreUpdateMessage<string>;
    let globalStoreMessage: StoreUpdateMessage<string>;

    let testSubject: StoreUpdateMessageHub;

    beforeEach(() => {
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

        testSubject = new StoreUpdateMessageHub(tabId);

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
        testSubject.handleMessage(message);

        expect(registeredListener).toBeCalledTimes(0);
    });

    it('ignores if no listener is registered for this message', () => {
        const message = {
            ...tabContextMessage,
            storeId: 'AnotherStore',
        };

        testSubject.handleMessage(message);

        expect(registeredListener).toBeCalledTimes(0);
    });

    it('Calls registered listener for tab context store message', () => {
        testSubject.handleMessage(tabContextMessage);

        expect(registeredListener).toBeCalledWith(tabContextMessage);
    });

    it('Calls registered listener for global store message', () => {
        testSubject.handleMessage(globalStoreMessage);

        expect(registeredListener).toBeCalledWith(globalStoreMessage);
    });

    it('Calls registered listener if not created with a tab id', () => {
        testSubject = new StoreUpdateMessageHub();
        testSubject.registerStoreUpdateListener(storeId, registeredListener);

        testSubject.handleMessage(tabContextMessage);

        expect(registeredListener).toBeCalledWith(tabContextMessage);
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

        testSubject.handleMessage(messageForStore);
        testSubject.handleMessage(messageForAnotherStore);

        expect(registeredListener).toBeCalledWith(messageForStore);
        expect(anotherListener).toBeCalledWith(messageForAnotherStore);
    });

    it('Returns resolved void promise', () => {
        const result = testSubject.handleMessage(tabContextMessage);

        expect(result).toBe(undefined);
    });
});
