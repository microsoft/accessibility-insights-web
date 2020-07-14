// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ScanIncompleteWarningId } from 'common/types/scan-incomplete-warnings';
import { UnifiedResult } from 'common/types/store-data/unified-data-interface';
import { NotificationTextCreator } from 'injected/analyzers/notification-text-creator';
import { ScanIncompleteWarningDetector } from 'injected/scan-incomplete-warning-detector';
import { IMock, Mock } from 'typemoq';

describe('NotificationTextCreator', () => {
    let testSubject: NotificationTextCreator;
    let scanIncompleteWarningDetectorMock: IMock<ScanIncompleteWarningDetector>;
    let unifiedResultStub: UnifiedResult;
    const testScanIncompletewarnings: ScanIncompleteWarningId[] = [
        'missing-required-cross-origin-permissions',
    ];

    beforeEach(() => {
        scanIncompleteWarningDetectorMock = Mock.ofType<ScanIncompleteWarningDetector>();
        testSubject = new NotificationTextCreator(scanIncompleteWarningDetectorMock.object);
        unifiedResultStub = { ruleId: 'test id' } as UnifiedResult;
    });

    it.each`
        unifiedResults                            | testScanWarnings                                 | expectedText
        ${undefined}                              | ${[]}                                            | ${'Congratulations!\n\nNeeds review found no instances to review on this page.'}
        ${null}                                   | ${[]}                                            | ${'Congratulations!\n\nNeeds review found no instances to review on this page.'}
        ${[]}                                     | ${[]}                                            | ${'Congratulations!\n\nNeeds review found no instances to review on this page.'}
        ${undefined}                              | ${testScanIncompletewarnings}                    | ${'There are iframes in the target page. Use FastPass or Assessment to provide additional permissions.\nNo instances to review found.'}
        ${null}                                   | ${testScanIncompletewarnings}                    | ${'There are iframes in the target page. Use FastPass or Assessment to provide additional permissions.\nNo instances to review found.'}
        ${[]}                                     | ${testScanIncompletewarnings}                    | ${'There are iframes in the target page. Use FastPass or Assessment to provide additional permissions.\nNo instances to review found.'}
        ${[unifiedResultStub, unifiedResultStub]} | ${[]}                                            | ${'Needs review found instances to review.'}
        ${[unifiedResultStub, unifiedResultStub]} | ${testScanIncompletewarnings}                    | ${'There are iframes in the target page. Use FastPass or Assessment to provide additional permissions.\nNeeds review found instances to review.'}
        ${[unifiedResultStub, unifiedResultStub]} | ${['unsupported-id' as ScanIncompleteWarningId]} | ${'Needs review found instances to review.'}
    `(
        'generates text for needs review with results: $unifiedResults and warnings: $testScanWarnings',
        ({ unifiedResults, testScanWarnings, expectedText }) => {
            scanIncompleteWarningDetectorMock
                .setup(m => m.detectScanIncompleteWarnings())
                .returns(() => testScanWarnings);

            expect(testSubject.needsReviewText(unifiedResults)).toEqual(expectedText);
        },
    );

    it.each`
        unifiedResults                            | testScanWarnings
        ${undefined}                              | ${[]}
        ${null}                                   | ${[]}
        ${[]}                                     | ${[]}
        ${undefined}                              | ${testScanIncompletewarnings}
        ${null}                                   | ${testScanIncompletewarnings}
        ${[]}                                     | ${testScanIncompletewarnings}
        ${[unifiedResultStub, unifiedResultStub]} | ${[]}
        ${[unifiedResultStub, unifiedResultStub]} | ${testScanIncompletewarnings}
        ${[unifiedResultStub, unifiedResultStub]} | ${['unsupported-id' as ScanIncompleteWarningId]}
    `(
        'generates null for automated checks with $unifiedResults and $testScanWarnings', // automated checks uses notifications generated from visualizationMessages.Common.ScanCompleted
        ({ unifiedResults, testScanWarnings }) => {
            scanIncompleteWarningDetectorMock
                .setup(m => m.detectScanIncompleteWarnings())
                .returns(testScanWarnings);

            expect(testSubject.automatedChecksText(unifiedResults)).toEqual(null);
        },
    );
});
