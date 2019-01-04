// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior } from 'typemoq';

import { StoreActionMessageCreator } from '../../../../common/message-creators/store-action-message-creator';

describe('StateActionMessageCreator', () => {
    const tabId: number = -1;
    let postMessageMock: IMock<(message: IMessage) => void>;

    test('getAllStates', () => {
        const messages = [
            'a',
            'b',
            'c',
            'd',
        ];

        postMessageMock = Mock.ofInstance((_message: IMessage) => { }, MockBehavior.Strict);

        messages.forEach(message => setupPostMessageMock(message));

        const testObject = new StoreActionMessageCreator(
            messages,
            postMessageMock.object,
            tabId,
        );

        testObject.getAllStates();

        postMessageMock.verifyAll();
    });

    function setupPostMessageMock(message: string): void {
        postMessageMock
            .setup(pm => pm(It.isValue({
                type: message,
                tabId: tabId,
            })));
    }
});

