// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ResolutionCreator } from 'injected/adapters/resolution-creator';
import { ConvertScanResultsToUnifiedResults } from 'injected/adapters/scan-results-to-unified-results';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';
import { generateUID } from '../../../../../common/uid-generator';
import { RuleResult, ScanResults } from '../../../../../scanner/iruleresults';

describe('ScanResults to Unified Results Test', () => {
    let generateGuidMock: IMock<() => string>;
    let fixResolutionCreatorMock: IMock<ResolutionCreator>;
    let checkResolutionCreatorMock: IMock<ResolutionCreator>;

    beforeEach(() => {
        const guidStub = 'gguid-mock-stub';
        generateGuidMock = Mock.ofInstance(generateUID, MockBehavior.Strict);
        generateGuidMock
            .setup(ggm => ggm())
            .returns(() => guidStub)
            .verifiable(Times.atLeastOnce());
        fixResolutionCreatorMock = Mock.ofType<ResolutionCreator>();
        checkResolutionCreatorMock = Mock.ofType<ResolutionCreator>();
    });

    const nullIdentifiers = [null, undefined, {}];

    const fixResolutionStub: DictionaryStringTo<any> = { 'test fix resolution': {} };
    const checkResolutionStub: DictionaryStringTo<any> = { 'test check resolution': {} };

    test.each(nullIdentifiers)(
        'automatedChecksConversion provides a defined UnifiedResult instance %s',
        scanResultStub => {
            const testSubject = getTestSubject();
            const unifiedResults = testSubject.automatedChecksConversion(
                scanResultStub as ScanResults,
            );
            expect(unifiedResults).toBeDefined();
        },
    );

    test('automaticChecksConversion works fine when there is no data in scanresults', () => {
        const testSubject = getTestSubject();
        const scanResultsStub: ScanResults = createTestResultsWithNoData();
        expect(testSubject.automatedChecksConversion(scanResultsStub)).toMatchSnapshot();
    });

    test('automaticChecksConversion works with filled up passes and failures value in scan results', () => {
        setupResolutionMock(fixResolutionCreatorMock, 'test', passingNode, fixResolutionStub);
        setupResolutionMock(fixResolutionCreatorMock, 'id1', node1, fixResolutionStub);
        setupResolutionMock(fixResolutionCreatorMock, 'id1', node2, fixResolutionStub);
        setupResolutionMock(fixResolutionCreatorMock, 'id2', node3, fixResolutionStub);

        const testSubject = getTestSubject();
        const scanResultsStub: ScanResults = createTestResults();
        expect(testSubject.automatedChecksConversion(scanResultsStub)).toMatchSnapshot();
        generateGuidMock.verifyAll();
    });

    test.each(nullIdentifiers)(
        'needsReviewConversion provides a defined UnifiedResult instance %s',
        scanResultStub => {
            const testSubject = getTestSubject();
            const unifiedResults = testSubject.needsReviewConversion(scanResultStub as ScanResults);
            expect(unifiedResults).toBeDefined();
        },
    );

    test('needsReviewConversion works fine when there is no data in scanresults', () => {
        const testSubject = getTestSubject();
        const scanResultsStub: ScanResults = createTestResultsWithNoData();
        expect(testSubject.needsReviewConversion(scanResultsStub)).toMatchSnapshot();
    });

    test('needsReviewConversion works with filled up passes, failures and incomplete values in scan results', () => {
        setupResolutionMock(checkResolutionCreatorMock, 'test', passingNode, checkResolutionStub);
        setupResolutionMock(checkResolutionCreatorMock, 'id1', node1, checkResolutionStub);
        setupResolutionMock(checkResolutionCreatorMock, 'id1', node2, checkResolutionStub);
        setupResolutionMock(checkResolutionCreatorMock, 'id2', node3, checkResolutionStub);
        setupResolutionMock(
            checkResolutionCreatorMock,
            'test2',
            incompleteNode,
            checkResolutionStub,
        );

        const testSubject = getTestSubject();
        const scanResultsStub: ScanResults = createTestResultsWithIncompletes();
        expect(testSubject.needsReviewConversion(scanResultsStub)).toMatchSnapshot();
        generateGuidMock.verifyAll();
    });

    function setupResolutionMock(
        mock: IMock<ResolutionCreator>,
        id: string,
        nodeResult: AxeNodeResult,
        resolutionStub: DictionaryStringTo<any>,
    ): void {
        mock.setup(m =>
            m({
                ruleId: id,
                nodeResult: nodeResult,
            }),
        ).returns(() => resolutionStub);
    }

    function getTestSubject(): ConvertScanResultsToUnifiedResults {
        return new ConvertScanResultsToUnifiedResults(
            generateGuidMock.object,
            fixResolutionCreatorMock.object,
            checkResolutionCreatorMock.object,
        );
    }

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
