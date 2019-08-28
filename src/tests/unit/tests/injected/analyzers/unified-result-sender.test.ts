// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, Times } from 'typemoq';
import { UnifiedScanCompletedPayload } from '../../../../../background/actions/action-payloads';
import { Message } from '../../../../../common/message';
import { Messages } from '../../../../../common/messages';
import { UnifiedResult, UnifiedRule } from '../../../../../common/types/store-data/unified-data-interface';
import { ConvertScanResultsToUnifiedResultsDelegate } from '../../../../../injected/adapters/scan-results-to-unified-results';
import { ConvertScanResultsToUnifiedRulesDelegate } from '../../../../../injected/adapters/scan-results-to-unified-rules';
import { MessageDelegate } from '../../../../../injected/analyzers/rule-analyzer';
import { UnifiedResultSender } from '../../../../../injected/analyzers/unified-result-sender';
import { ScanResults } from '../../../../../scanner/iruleresults';

describe('sendConvertedResults', () => {
    it('should send a message', () => {
        const sendDelegate: IMock<MessageDelegate> = Mock.ofInstance(message => null);
        const convertToUnifiedMock: IMock<ConvertScanResultsToUnifiedResultsDelegate> = Mock.ofInstance(
            (scanResults, uuidGenerator) => null,
        );
        const convertToUnifiedRulesMock: IMock<ConvertScanResultsToUnifiedRulesDelegate> = Mock.ofInstance(
            (scanResults: ScanResults) => null,
        );
        const uuidGeneratorStub = () => null;
        const testSubject = new UnifiedResultSender(
            sendDelegate.object,
            convertToUnifiedMock.object,
            convertToUnifiedRulesMock.object,
            uuidGeneratorStub,
        );

        const axeInputResults = {} as any;
        const unifiedResults: UnifiedResult[] = [];
        const unifiedRules: UnifiedRule[] = [];
        convertToUnifiedMock.setup(m => m(axeInputResults, uuidGeneratorStub)).returns(val => unifiedResults);
        convertToUnifiedRulesMock.setup(m => m(axeInputResults)).returns(val => unifiedRules);
        testSubject.sendResults({
            results: null,
            originalResult: axeInputResults,
        });
        convertToUnifiedMock.verifyAll();
        convertToUnifiedRulesMock.verifyAll();
        const expectedPayload: UnifiedScanCompletedPayload = {
            scanResult: unifiedResults,
            rules: unifiedRules,
        };
        const expectedMessage: Message = {
            messageType: Messages.UnifiedScan.ScanCompleted,
            payload: expectedPayload,
        };
        sendDelegate.verify(m => m(expectedMessage), Times.once());
    });
});
