// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UnifiedScanCompletedPayload } from 'background/actions/action-payloads';
import { Message } from 'common/message';
import { Messages } from 'common/messages';
import {
    ToolData,
    UnifiedResult,
    UnifiedRule,
} from 'common/types/store-data/unified-data-interface';
import { ConvertScanResultsToUnifiedResultsDelegate } from 'injected/adapters/scan-results-to-unified-results';
import { ConvertScanResultsToUnifiedRulesDelegate } from 'injected/adapters/scan-results-to-unified-rules';
import { MessageDelegate, PostResolveCallback } from 'injected/analyzers/rule-analyzer';
import { UnifiedResultSender } from 'injected/analyzers/unified-result-sender';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import { forOwn } from 'lodash';
import { IMock, Mock, Times } from 'typemoq';

interface UnifiedResultSenderTestDefinition {
    getMethodToTest: (testSubject: UnifiedResultSender) => PostResolveCallback;
    getConvertResultMock: () => IMock<ConvertScanResultsToUnifiedResultsDelegate>;
}

describe('sendConvertedResults', () => {
    const axeInputResults = {
        targetPageTitle: 'title',
        targetPageUrl: 'url',
        timestamp: 'timestamp',
    } as any;
    const unifiedResults: UnifiedResult[] = [];
    const unifiedRules: UnifiedRule[] = [];
    const toolInfo = {} as ToolData;

    const uuidGeneratorStub = () => null;
    const testScanIncompleteWarningId = 'test-scan-incomplete-warning';

    let sendDelegate: IMock<MessageDelegate>;
    let convertToUnifiedMock: IMock<ConvertScanResultsToUnifiedResultsDelegate>;
    let convertToUnifiedNeedsReviewMock: IMock<ConvertScanResultsToUnifiedResultsDelegate>;
    let convertToUnifiedRulesMock: IMock<ConvertScanResultsToUnifiedRulesDelegate>;
    let scanIncompleteWarningDetectorMock: IMock<ScanIncompleteWarningDetector>;

    beforeEach(() => {
        sendDelegate = Mock.ofType<MessageDelegate>();
        convertToUnifiedMock = Mock.ofType<ConvertScanResultsToUnifiedResultsDelegate>();
        convertToUnifiedNeedsReviewMock = Mock.ofType<ConvertScanResultsToUnifiedResultsDelegate>();
        convertToUnifiedRulesMock = Mock.ofType<ConvertScanResultsToUnifiedRulesDelegate>();
        scanIncompleteWarningDetectorMock = Mock.ofType<ScanIncompleteWarningDetector>();
    });

    const automatedChecksTest: UnifiedResultSenderTestDefinition = {
        getMethodToTest: testSubject => testSubject.sendAutomatedChecksResults,
        getConvertResultMock: () => convertToUnifiedMock,
    };

    const needsReviewTest: UnifiedResultSenderTestDefinition = {
        getMethodToTest: testSubject => testSubject.sendNeedsReviewResults,
        getConvertResultMock: () => convertToUnifiedNeedsReviewMock,
    };

    const testCases = {
        automatedChecks: automatedChecksTest,
        needsReview: needsReviewTest,
    };

    forOwn(testCases, (testObject, testName) => {
        describe(testName, () => {
            it.each`
                warnings                         | telemetry
                ${[testScanIncompleteWarningId]} | ${{ scanIncompleteWarnings: [testScanIncompleteWarningId] }}
                ${[]}                            | ${null}
            `(
                'it send results with warnings: $warnings and telemetry: $telemetry',
                ({ warnings, telemetry }) => {
                    testObject
                        .getConvertResultMock()
                        .setup(m => m(axeInputResults, uuidGeneratorStub))
                        .returns(val => unifiedResults);
                    convertToUnifiedRulesMock
                        .setup(m => m(axeInputResults))
                        .returns(val => unifiedRules);
                    scanIncompleteWarningDetectorMock
                        .setup(m => m.detectScanIncompleteWarnings())
                        .returns(() => warnings);

                    const testSubject = new UnifiedResultSender(
                        sendDelegate.object,
                        convertToUnifiedMock.object,
                        convertToUnifiedNeedsReviewMock.object,
                        convertToUnifiedRulesMock.object,
                        toolInfo,
                        uuidGeneratorStub,
                        scanIncompleteWarningDetectorMock.object,
                    );

                    testObject.getMethodToTest(testSubject)({
                        results: null,
                        originalResult: axeInputResults,
                    });

                    const expectedPayload: UnifiedScanCompletedPayload = {
                        scanResult: unifiedResults,
                        rules: unifiedRules,
                        toolInfo: toolInfo,
                        targetAppInfo: {
                            name: 'title',
                            url: 'url',
                        },
                        timestamp: 'timestamp',
                        scanIncompleteWarnings: warnings,
                        telemetry,
                    };

                    const expectedMessage: Message = {
                        messageType: Messages.UnifiedScan.ScanCompleted,
                        payload: expectedPayload,
                    };

                    sendDelegate.verify(m => m(expectedMessage), Times.once());
                },
            );
        });
    });
});
