// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, Times } from 'typemoq';
import { Message } from '../../../../../common/message';
import { Messages } from '../../../../../common/messages';
import { MessageDelegate } from '../../../../../injected/analyzers/rule-analyzer';
import { sendConvertedResults } from '../../../../../injected/analyzers/send-converted-results';

describe('sendConvertedResults', () => {
    it('should send a message', () => {
        const sendDelegate: IMock<MessageDelegate> = Mock.ofInstance(message => null);
        const expected: Message = {
            messageType: Messages.UnifiedScan.ScanCompleted,
            payload: {
                results: null,
            },
        };
        sendConvertedResults(null, sendDelegate.object);
        sendDelegate.verify(m => m(expected), Times.once());
    });
});
