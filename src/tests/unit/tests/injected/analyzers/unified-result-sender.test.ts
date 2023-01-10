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
import { ConvertScanResultsToUnifiedResults } from 'injected/adapters/scan-results-to-unified-results';
import { ConvertScanResultsToUnifiedRulesDelegate } from 'injected/adapters/scan-results-to-unified-rules';
import { FilterResults } from 'injected/analyzers/filter-results';
import { NotificationTextCreator } from 'injected/analyzers/notification-text-creator';
import { MessageDelegate, PostResolveCallback } from 'injected/analyzers/rule-analyzer';
import { UnifiedResultSender } from 'injected/analyzers/unified-result-sender';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import { forOwn } from 'lodash';
import { ScanResults } from 'scanner/iruleresults';
import { IMock, Mock, Times } from 'typemoq';

interface UnifiedResultSenderTestDefinition {
    expectedMessageType: string;
    getMethodToTest: (testSubject: UnifiedResultSender) => PostResolveCallback;
    getInputResults: () => ScanResults;
    setupConverterMock: (
        mock: IMock<ConvertScanResultsToUnifiedResults>,
        input: ScanResults,
    ) => void;
    getNotificationText: () => string;
    setupNotificationTextCreatorMock: (mock: IMock<NotificationTextCreator>) => void;
}

describe('sendConvertedResults', () => {
    const axeInputResults = {
        targetPageTitle: 'title',
        targetPageUrl: 'url',
        timestamp: 'timestamp',
    } as ScanResults;
    const filteredAxeInputResults = {
        targetPageTitle: 'filtered title',
        targetPageUrl: 'filtered url',
        timestamp: 'filtered timestamp',
    } as ScanResults;
    const unifiedResults: UnifiedResult[] = [];
    const unifiedRules: UnifiedRule[] = [];
    const toolInfo = {} as ToolData;

    const testScanIncompleteWarningId = 'test-scan-incomplete-warning';

    const automatedChecksText = 'automated checks notification text';
    const needsReviewText = 'needs review notification text';

    let sendDelegate: IMock<MessageDelegate>;
    let convertToUnifiedRulesMock: IMock<ConvertScanResultsToUnifiedRulesDelegate>;
    let scanIncompleteWarningDetectorMock: IMock<ScanIncompleteWarningDetector>;
    let filterNeedsReviewResultsMock: IMock<FilterResults>;
    let convertToUnifiedResultsMock: IMock<ConvertScanResultsToUnifiedResults>;
    let notificationTextCreatorMock: IMock<NotificationTextCreator>;

    beforeEach(() => {
        sendDelegate = Mock.ofType<MessageDelegate>();
        convertToUnifiedRulesMock = Mock.ofType<ConvertScanResultsToUnifiedRulesDelegate>();
        scanIncompleteWarningDetectorMock = Mock.ofType<ScanIncompleteWarningDetector>();
        filterNeedsReviewResultsMock = Mock.ofType<FilterResults>();
        convertToUnifiedResultsMock = Mock.ofType<ConvertScanResultsToUnifiedResults>();
        notificationTextCreatorMock = Mock.ofType<NotificationTextCreator>();
    });

    const automatedChecksTest: UnifiedResultSenderTestDefinition = {
        expectedMessageType: Messages.UnifiedScan.ScanCompleted,
        getMethodToTest: testSubject => testSubject.sendAutomatedChecksResults,
        getInputResults: () => axeInputResults,
        setupConverterMock: (mock: IMock<ConvertScanResultsToUnifiedResults>, input: ScanResults) =>
            mock.setup(m => m.automatedChecksConversion(input)).returns(() => unifiedResults),
        getNotificationText: () => automatedChecksText,
        setupNotificationTextCreatorMock: (mock: IMock<NotificationTextCreator>) =>
            mock
                .setup(m => m.automatedChecksText(unifiedResults))
                .returns(() => automatedChecksText),
    };

    const needsReviewTest: UnifiedResultSenderTestDefinition = {
        expectedMessageType: Messages.NeedsReviewScan.ScanCompleted,
        getMethodToTest: testSubject => testSubject.sendNeedsReviewResults,
        getInputResults: () => filteredAxeInputResults,
        setupConverterMock: (mock: IMock<ConvertScanResultsToUnifiedResults>, input: ScanResults) =>
            mock.setup(m => m.needsReviewConversion(input)).returns(() => unifiedResults),
        getNotificationText: () => needsReviewText,
        setupNotificationTextCreatorMock: (mock: IMock<NotificationTextCreator>) =>
            mock.setup(m => m.needsReviewText(unifiedResults)).returns(() => needsReviewText),
    };

    const testCases = {
        automatedChecks: automatedChecksTest,
        needsReview: needsReviewTest,
    };

    forOwn(testCases, (testDefinition, testName) => {
        describe(testName, () => {
            it.each`
                warnings                         | telemetry
                ${[testScanIncompleteWarningId]} | ${{ scanIncompleteWarnings: [testScanIncompleteWarningId] }}
                ${[]}                            | ${null}
            `(
                'it send results with warnings: $warnings and telemetry: $telemetry',
                ({ warnings, telemetry }) => {
                    const inputResults = testDefinition.getInputResults();
                    testDefinition.setupConverterMock(convertToUnifiedResultsMock, inputResults);
                    convertToUnifiedRulesMock
                        .setup(m => m(inputResults))
                        .returns(val => unifiedRules);
                    scanIncompleteWarningDetectorMock
                        .setup(m => m.detectScanIncompleteWarnings(inputResults))
                        .returns(() => warnings);
                    filterNeedsReviewResultsMock
                        .setup(m => m(axeInputResults))
                        .returns(val => inputResults);
                    testDefinition.setupNotificationTextCreatorMock(notificationTextCreatorMock);

                    const notificationText = testDefinition.getNotificationText();

                    const testSubject = new UnifiedResultSender(
                        sendDelegate.object,
                        convertToUnifiedRulesMock.object,
                        toolInfo,
                        convertToUnifiedResultsMock.object,
                        scanIncompleteWarningDetectorMock.object,
                        notificationTextCreatorMock.object,
                        filterNeedsReviewResultsMock.object,
                    );

                    testDefinition.getMethodToTest(testSubject)({
                        results: null,
                        originalResult: axeInputResults,
                    });

                    const expectedPayload: UnifiedScanCompletedPayload = {
                        scanResult: unifiedResults,
                        rules: unifiedRules,
                        toolInfo: toolInfo,
                        targetAppInfo: {
                            name: inputResults.targetPageTitle,
                            url: inputResults.targetPageUrl,
                        },
                        timestamp: inputResults.timestamp,
                        scanIncompleteWarnings: warnings,
                        telemetry,
                        notificationText: notificationText,
                    };

                    const expectedMessage: Message = {
                        messageType: testDefinition.expectedMessageType,
                        payload: expectedPayload,
                    };

                    sendDelegate.verify(m => m(expectedMessage), Times.once());
                },
            );
        });
    });
});
