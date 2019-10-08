// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CardSelectionPayload } from 'background/actions/action-payloads';
import { Message } from 'common/message';
import { ActionMessageDispatcher } from 'common/message-creators/action-message-dispatcher';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { Messages } from 'common/messages';
import { IMock, Mock, Times } from 'typemoq';

describe('Card Selection Message Creator', () => {
    let dispatcherMock: IMock<ActionMessageDispatcher>;
    let testSubject: CardSelectionMessageCreator;

    beforeEach(() => {
        dispatcherMock = Mock.ofType<ActionMessageDispatcher>();
        testSubject = new CardSelectionMessageCreator(dispatcherMock.object);
    });

    it('dispatches message for toggleCardSelection', () => {
        const resultInstanceUid = 'test-uid';
        const payload: CardSelectionPayload = {
            resultInstanceUid,
        };

        const expectedMessage: Message = {
            messageType: Messages.CardSelection.CardSelectionToggled,
            payload,
        };

        testSubject.toggleCardSelection(resultInstanceUid);

        dispatcherMock.verify(handler => handler.dispatchMessage(expectedMessage), Times.once());
    });
});
