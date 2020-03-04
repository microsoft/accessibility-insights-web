// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ActionMessageDispatcher } from 'common/message-creators/types/dispatcher';
import { Mock, Times } from 'typemoq';

import { Message } from '../../../../../common/message';
import { PathSnippetActionMessageCreator } from '../../../../../common/message-creators/path-snippet-action-message-creator';
import { Messages } from '../../../../../common/messages';

describe('PathSnippetActionMessageCreatorTest', () => {
    const dispatcherMock = Mock.ofType<ActionMessageDispatcher>();
    let testSubject: PathSnippetActionMessageCreator;

    beforeEach(() => {
        dispatcherMock.reset();
        testSubject = new PathSnippetActionMessageCreator(dispatcherMock.object);
    });

    it('dispatches message for addCorrespondingSnippet', () => {
        const snippet = 'test snippet';

        const expectedMessage: Message = {
            messageType: Messages.PathSnippet.AddCorrespondingSnippet,
            payload: snippet,
        };

        testSubject.addCorrespondingSnippet(snippet);
        dispatcherMock.verify(
            dispatcher => dispatcher.dispatchMessage(expectedMessage),
            Times.once(),
        );
    });
});
