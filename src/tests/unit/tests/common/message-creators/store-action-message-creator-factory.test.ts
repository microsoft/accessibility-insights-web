// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Mock, MockBehavior } from 'typemoq';

import { BaseStore } from '../../../../../common/base-store';
import { EnumHelper } from '../../../../../common/enum-helper';
import { ActionMessageDispatcher } from '../../../../../common/message-creators/action-message-dispatcher';
import { StoreActionMessageCreator } from '../../../../../common/message-creators/store-action-message-creator';
import { StoreActionMessageCreatorFactory } from '../../../../../common/message-creators/store-action-message-creator-factory';
import { getStoreStateMessage } from '../../../../../common/messages';
import { StoreNames } from '../../../../../common/stores/store-names';

describe('StoreActionMessageCreatorFactoryTest', () => {
    const dispatcherMock = Mock.ofType<ActionMessageDispatcher>(undefined, MockBehavior.Strict);

    beforeEach(() => {
        dispatcherMock.reset();
    });

    it('dispatches messages for fromStores', () => {
        const createStoreMock = (storeName: StoreNames) => {
            const mock = Mock.ofType<BaseStore<any>>(undefined, MockBehavior.Strict);
            mock.setup(store => store.getId()).returns(() => StoreNames[storeName]);
            return mock;
        };

        const storeNames = EnumHelper.getNumericValues<StoreNames>(StoreNames);

        const storeMocks = storeNames.map(createStoreMock).map(mock => mock.object);

        const expectedMessages = storeNames.map(name => getStoreStateMessage(name));

        testWithExpectedMessages(expectedMessages, testObject => testObject.fromStores(storeMocks));
    });

    function testWithExpectedMessages(
        messages: string[],
        getter: (testObject: StoreActionMessageCreatorFactory) => StoreActionMessageCreator,
    ): void {
        messages.forEach(message => setupDispatcherMock(message));

        const testObject = new StoreActionMessageCreatorFactory(dispatcherMock.object);

        const creator = getter(testObject);

        creator.getAllStates();

        dispatcherMock.verifyAll();
    }

    function setupDispatcherMock(messageType: string): void {
        dispatcherMock.setup(dispatcher => dispatcher.dispatchType(messageType));
    }
});
