// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, MockBehavior, Times, It } from 'typemoq';

import { ResolutionCreator } from 'injected/adapters/resolution-creator';
import { generateUID } from '../../../../../common/uid-generator';
import {
    convertScanResultsToNeedsReviewUnifiedResults,
    convertScanResultsToUnifiedResults,
} from '../../../../../injected/adapters/scan-results-to-unified-results';
import { RuleResult, ScanResults } from '../../../../../scanner/iruleresults';

describe('ScanResults to Unified Results Test', () => {
    let generateGuidMock: IMock<() => string>;
    let resolutionCreatorMock: IMock<ResolutionCreator>;

    beforeEach(() => {
        const guidStub = 'gguid-mock-stub';
        generateGuidMock = Mock.ofInstance(generateUID, MockBehavior.Strict);
        generateGuidMock
            .setup(ggm => ggm())
            .returns(() => guidStub)
            .verifiable(Times.atLeastOnce());
        resolutionCreatorMock = Mock.ofType<ResolutionCreator>();
    });

    const nullIdentifiers = [null, undefined, {}];

    const howToFixUnifiedResolution = { howToFixSummary: 'how to fix' };
    const howToCheckUnifiedResolution = { howToFixSummary: 'how to check' };

    test.each(nullIdentifiers)(
        'convertScanResultsToUnifiedResults provides a defined UnifiedResult instance %s',
        scanResultStub => {
            const unifiedResults = convertScanResultsToUnifiedResults(
                scanResultStub as ScanResults,
                generateGuidMock.object,
                resolutionCreatorMock.object,
            );
            expect(unifiedResults).toBeDefined();
        },
    );

    test('conversion works fine when there is no data in scanresults', () => {
        resolutionCreatorMock
            .setup(m => m('how-to-fix', It.isAny()))
            .returns(val => howToFixUnifiedResolution);
        const scanResultsStub: ScanResults = createTestResultsWithNoData();
        expect(
            convertScanResultsToUnifiedResults(
                scanResultsStub,
                generateGuidMock.object,
                resolutionCreatorMock.object,
            ),
        ).toMatchSnapshot();
    });

    test('conversion works with filled up passes and failures value in scan results', () => {
        resolutionCreatorMock
            .setup(m => m('how-to-fix', It.isAny()))
            .returns(val => howToFixUnifiedResolution);
        const scanResultsStub: ScanResults = createTestResults();
        expect(
            convertScanResultsToUnifiedResults(
                scanResultsStub,
                generateGuidMock.object,
                resolutionCreatorMock.object,
            ),
        ).toMatchSnapshot();
        generateGuidMock.verifyAll();
    });

    test.each(nullIdentifiers)(
        'convertScanResultsToNeedsReviewUnifiedResults provides a defined UnifiedResult instance %s',
        scanResultStub => {
            const unifiedResults = convertScanResultsToNeedsReviewUnifiedResults(
                scanResultStub as ScanResults,
                generateGuidMock.object,
                resolutionCreatorMock.object,
            );
            expect(unifiedResults).toBeDefined();
        },
    );

    test('needs review conversion works fine when there is no data in scanresults', () => {
        resolutionCreatorMock
            .setup(m => m('how-to-check', It.isAny()))
            .returns(val => howToCheckUnifiedResolution);
        const scanResultsStub: ScanResults = createTestResultsWithNoData();
        expect(
            convertScanResultsToNeedsReviewUnifiedResults(
                scanResultsStub,
                generateGuidMock.object,
                resolutionCreatorMock.object,
            ),
        ).toMatchSnapshot();
    });

    test('needs review conversion works with filled up passes, failures and incomplete values in scan results', () => {
        resolutionCreatorMock
            .setup(m => m('how-to-check', It.isAny()))
            .returns(val => howToCheckUnifiedResolution);
        const scanResultsStub: ScanResults = createTestResultsWithIncompletes();
        expect(
            convertScanResultsToNeedsReviewUnifiedResults(
                scanResultsStub,
                generateGuidMock.object,
                resolutionCreatorMock.object,
            ),
        ).toMatchSnapshot();
        generateGuidMock.verifyAll();
    });

    function createTestResultsWithNoData(): ScanResults {
        return {
            passes: [],
            violations: [],
            incomplete: [],
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

    const incompleteNode: AxeNodeResult = {
        any: [],
        none: [],
        all: [],
        instanceId: 'id-incomplete',
        html: 'html-incomplete',
        target: ['incompleteTarget1'],
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

    function createTestResultsWithIncompletes(): ScanResults {
        return {
            passes: [
                {
                    id: 'test',
                    nodes: [passingNode],
                },
            ],
            violations: failedRules,
            incomplete: [
                {
                    id: 'test2',
                    nodes: [incompleteNode],
                },
            ],
            targetPageTitle: '',
            targetPageUrl: '',
        } as ScanResults;
    }
});
