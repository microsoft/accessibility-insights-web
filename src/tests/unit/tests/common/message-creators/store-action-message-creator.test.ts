// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Dispatcher } from 'common/message-creators/types/dispatcher';
import { Mock } from 'typemoq';

import { StoreActionMessageCreatorImpl } from '../../../../../common/message-creators/store-action-message-creator-impl';

describe('StoreActionMessageCreatorImpl', () => {
    const dispatcherMock = Mock.ofType<Dispatcher>();

    test('getAllStates', () => {
        const messages = ['a', 'b', 'c', 'd'];

        messages.forEach(message => setupDispatcherMock(message));

        const testObject = new StoreActionMessageCreatorImpl(messages, dispatcherMock.object);

        testObject.getAllStates();

        dispatcherMock.verifyAll();
    });

    function setupDispatcherMock(message: string): void {
        dispatcherMock.setup(dispatcher => dispatcher.dispatchType(message));
    }
});
