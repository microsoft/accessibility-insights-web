// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

import { generateUID } from '../../../../../common/uid-generator';
import {
    convertScanResultsToUnifiedResults,
    convertScanResultsToNeedsReviewUnifiedResults,
} from '../../../../../injected/adapters/scan-results-to-unified-results';
import { RuleResult, ScanResults } from '../../../../../scanner/iruleresults';

describe('ScanResults to Unified Results Test', () => {
    let generateGuidMock: IMock<() => string>;

    beforeEach(() => {
        const guidStub = 'gguid-mock-stub';
        generateGuidMock = Mock.ofInstance(generateUID, MockBehavior.Strict);
        generateGuidMock
            .setup(ggm => ggm())
            .returns(() => guidStub)
            .verifiable(Times.atLeastOnce());
    });
    const nullIdentifiers = [null, undefined, {}];
    test.each(nullIdentifiers)(
        'convertScanResultsToUnifiedResults provides a defined UnifiedResult instance %s',
        scanResultStub => {
            const unifiedResults = convertScanResultsToUnifiedResults(
                scanResultStub as ScanResults,
                generateGuidMock.object,
            );
            expect(unifiedResults).toBeDefined();
        },
    );

    test('conversion works fine when there is no data in scanresults', () => {
        const scanResultsStub: ScanResults = createTestResultsWithNoData();
        expect(
            convertScanResultsToUnifiedResults(scanResultsStub, generateGuidMock.object),
        ).toMatchSnapshot();
    });

    test('conversion works with filled up passes and failures value in scan results', () => {
        const scanResultsStub: ScanResults = createTestResults();
        expect(
            convertScanResultsToUnifiedResults(scanResultsStub, generateGuidMock.object),
        ).toMatchSnapshot();
        generateGuidMock.verifyAll();
    });

    test.each(nullIdentifiers)(
        'convertScanResultsToNeedsReviewUnifiedResults provides a defined UnifiedResult instance %s',
        scanResultStub => {
            const unifiedResults = convertScanResultsToNeedsReviewUnifiedResults(
                scanResultStub as ScanResults,
                generateGuidMock.object,
            );
            expect(unifiedResults).toBeDefined();
        },
    );

    test('needs review conversion works fine when there is no data in scanresults', () => {
        const scanResultsStub: ScanResults = createTestResultsWithNoData();
        expect(
            convertScanResultsToNeedsReviewUnifiedResults(scanResultsStub, generateGuidMock.object),
        ).toMatchSnapshot();
    });

    test('needs review conversion works with filled up passes and failures value in scan results', () => {
        const scanResultsStub: ScanResults = createTestResults();
        expect(
            convertScanResultsToNeedsReviewUnifiedResults(scanResultsStub, generateGuidMock.object),
        ).toMatchSnapshot();
        generateGuidMock.verifyAll();
    });

    // add with incompletes as well?

    function createTestResultsWithNoData(): ScanResults {
        return {
            passes: [],
            violations: [],
            targetPageTitle: '',
            targetPageUrl: '',
        } as ScanResults;
    }

    const node1: AxeNodeResult = {
        any: [
            {
                id: 'test-id',
                message: 'any-test-message',
                data: {},
            },
        ],
        none: [],
        all: [],
        instanceId: 'id1',
        html: 'html1',
        target: ['target1', 'id1'],
        failureSummary: 'how to fix 1',
    };

    const node2: AxeNodeResult = {
        any: [],
        none: [
            {
                id: 'none-test-id',
                message: 'none-test-message',
                data: {},
            },
        ],
        all: [],
        instanceId: 'id2',
        snippet: 'html2',
        target: ['target2', 'id2'],
        failureSummary: 'how to fix 2',
    } as AxeNodeResult;

    const node3: AxeNodeResult = {
        any: [],
        none: [],
        all: [
            {
                id: 'all-test-id',
                message: 'all-test-message',
                data: {},
            },
        ],
        instanceId: 'id3',
        html: 'html3',
        target: ['target3', 'id3'],
        failureSummary: 'how to fix 3',
    };

    const passingNode: AxeNodeResult = {
        any: [],
        none: [],
        all: [],
        instanceId: 'id-pass',
        html: 'html-pass',
        target: ['passTarget1', 'passTarget2'],
    };

    const failedRules: RuleResult[] = [
        {
            id: 'id1',
            nodes: [node1, node2],
            description: 'des1',
            help: 'help1',
            guidanceLinks: [
                {
                    text: 'text1',
                    href: 'testurl1',
                },
            ],
            helpUrl: 'https://id1',
        },
        {
            id: 'id2',
            nodes: [node3],
            description: 'des2',
            help: 'help2',
            guidanceLinks: [
                {
                    text: 'text2',
                    href: 'testurl2',
                },
            ],
            helpUrl: 'https://id2',
        },
    ];

    function createTestResults(): ScanResults {
        return {
            passes: [
                {
                    id: 'test',
                    nodes: [passingNode],
                },
            ],
            violations: failedRules,
            targetPageTitle: '',
            targetPageUrl: '',
        } as ScanResults;
    }
});
