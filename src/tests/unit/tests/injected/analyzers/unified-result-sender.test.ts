// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, Times } from 'typemoq';
import { UnifiedScanCompletedPayload } from '../../../../../background/actions/action-payloads';
import { Message } from '../../../../../common/message';
import { Messages } from '../../../../../common/messages';
import { UnifiedResult } from '../../../../../common/types/store-data/unified-data-interface';
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
        const unifiedResults: UnifiedResult[] = [];
        convertToUnifiedMock.setup(m => m(axeInputResults, uuidGeneratorStub)).returns(val => unifiedResults);
        testSubject.sendResults({
            results: null,
            originalResult: axeInputResults,
        });
        convertToUnifiedMock.verifyAll();

        const expectedPayload: UnifiedScanCompletedPayload = {
            scanResult: unifiedResults,
            rules: [],
        };
        const expectedMessage: Message = {
            messageType: Messages.UnifiedScan.ScanCompleted,
            payload: expectedPayload,
        };
        sendDelegate.verify(m => m(expectedMessage), Times.once());
    });
});
