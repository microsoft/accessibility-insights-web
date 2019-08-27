// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, Times } from 'typemoq';
import { Message } from '../../../../../common/message';
import { Messages } from '../../../../../common/messages';
import { UnifiedResults } from '../../../../../common/types/store-data/unified-data-interface';
import { ConvertResultsDelegate } from '../../../../../injected/adapters/scan-results-to-unified-results';
import { MessageDelegate } from '../../../../../injected/analyzers/rule-analyzer';
import { UnifiedResultSender } from '../../../../../injected/analyzers/unified-result-sender';

describe('sendConvertedResults', () => {
    it('should send a message', () => {
        const sendDelegate: IMock<MessageDelegate> = Mock.ofInstance(message => null);
        const convertToUnifiedMock: IMock<ConvertResultsDelegate> = Mock.ofInstance((scanResults, uuidGenerator) => null);
        const uuidGeneratorStub = () => null;
        const testSubject = new UnifiedResultSender(sendDelegate.object, convertToUnifiedMock.object, uuidGeneratorStub);

        const axeInputResults = {} as any;
        const unifiedResults: UnifiedResults = {
            results: [],
        };
        convertToUnifiedMock.setup(m => m(axeInputResults, uuidGeneratorStub)).returns(val => unifiedResults);
        testSubject.sendResults({
            results: null,
            originalResult: axeInputResults,
        });
        convertToUnifiedMock.verifyAll();

        const expectedMessage: Message = {
            messageType: Messages.UnifiedScan.ScanCompleted,
            payload: unifiedResults,
        };
        sendDelegate.verify(m => m(expectedMessage), Times.once());
    });
});
