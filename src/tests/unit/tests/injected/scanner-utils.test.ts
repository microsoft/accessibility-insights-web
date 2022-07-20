// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScopingStore } from 'background/stores/global/scoping-store';
import { ScopingInputTypes } from 'common/types/store-data/scoping-input-types';
import {
    DecoratedAxeNodeResult,
    HtmlElementAxeResults,
} from 'common/types/store-data/visualization-scan-result-data';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { Logger } from '../../../../common/logging/logger';
import { ScopingStoreData } from '../../../../common/types/store-data/scoping-store-data';
import { ScannerUtils } from '../../../../injected/scanner-utils';
import { scan } from '../../../../scanner/exposed-apis';
import { RuleResult, ScanResults } from '../../../../scanner/iruleresults';
import { ScanOptions } from '../../../../scanner/scan-options';
import { DictionaryStringTo } from '../../../../types/common-types';

describe('ScannerUtilsTest', () => {
    let scannerMock: IMock<typeof scan>;
    let testSubject: ScannerUtils;
    let scopingStoreMock: IMock<ScopingStore>;
    let scopingState: ScopingStoreData;

    beforeEach(() => {
        scannerMock = Mock.ofInstance(scan, MockBehavior.Strict);
        scopingStoreMock = Mock.ofType(ScopingStore, MockBehavior.Strict);
        scopingStoreMock
            .setup(sm => sm.getState())
            .returns(() => scopingState)
            .verifiable();
        const loggerMock = Mock.ofType<Logger>();
        testSubject = new ScannerUtils(scannerMock.object, loggerMock.object, null);
        scopingState = {
            selectors: {
                [ScopingInputTypes.include]: [],
                [ScopingInputTypes.exclude]: [],
            },
        };
    });

    test('scan', (completeSignal: () => void) => {
        const selectors = ['1', '2', '3'];
        const rulesToRun = ['rule1', 'rule2', 'rule3'];
        const testInclude = scopingState.selectors[ScopingInputTypes.include];
        const testExclude = scopingState.selectors[ScopingInputTypes.exclude];
        const scanOptions: ScanOptions = {
            testsToRun: rulesToRun,
            include: testInclude,
            exclude: testExclude,
        };

        const expectedAxeResults: ScanResults = {
            passes: [getSampleRule('rule1', [selectors[0]]), getSampleRule('rule2', selectors)],
            violations: [
                getSampleRule('rule1', [selectors[1]]),
                getSampleRule('rule3', [selectors[0], selectors[1]]),
            ],
            inapplicable: [],
            incomplete: [],
            timestamp: '0',
            targetPageUrl: 'test url',
            targetPageTitle: 'test title',
        };

        scannerMock
            .setup(sm =>
                sm(
                    It.isValue({
                        testsToRun: rulesToRun,
                        include: testInclude,
                        exclude: testExclude,
                    }),
                    It.isAny(),
                    It.isAny(),
                ),
            )
            .callback((rulesToBeRun, successCallback, errorCallback) => {
                successCallback(expectedAxeResults);
            });

        testSubject.scan(scanOptions, results => {
            expect(results).toEqual(expectedAxeResults);
            completeSignal();
        });
    });

    test('getFailingInstances', () => {
        const selectors = ['1', '2', '3'];
        const expectedElementSelectors = ['1', '2'];
        const element1Selector = expectedElementSelectors[0];
        const element2Selector = expectedElementSelectors[1];

        const axeResults: ScanResults = {
            passes: [getSampleRule('rule1', [element1Selector]), getSampleRule('rule2', selectors)],
            violations: [
                getSampleRule('rule1', [element2Selector]),
                getSampleRule('rule3', [element1Selector, element2Selector]),
            ],
            inapplicable: [],
            incomplete: [],
            timestamp: '0',
            targetPageUrl: 'test url',
            targetPageTitle: 'test title',
        };
        const selectorMap = testSubject.getFailingInstances(axeResults);

        expect(Object.keys(selectorMap)).toEqual(expectedElementSelectors);
        const expectedElement1RuleResults: DictionaryStringTo<boolean> = {
            rule3: false,
        };

        const expectedElement2RuleResults: DictionaryStringTo<boolean> = {
            rule1: false,
            rule3: false,
        };

        verifyElementSelector(
            selectorMap[element1Selector],
            element1Selector,
            expectedElement1RuleResults,
        );

        verifyElementSelector(
            selectorMap[element2Selector],
            element2Selector,
            expectedElement2RuleResults,
        );
    });

    test('getPassingInstances', () => {
        const selectors = ['1', '2', '3'];
        const expectedElementSelectors = ['1', '2'];
        const element1Selector = expectedElementSelectors[0];
        const element2Selector = expectedElementSelectors[1];

        const axeResults: ScanResults = {
            passes: [
                getSampleRule('rule1', [element1Selector]),
                getSampleRule('rule2', [element1Selector, element2Selector]),
            ],
            violations: [getSampleRule('rule3', selectors)],
            inapplicable: [],
            incomplete: [],
            timestamp: '0',
            targetPageUrl: 'test url',
            targetPageTitle: 'test title',
        };
        const selectorMap = testSubject.getPassingInstances(axeResults);

        expect(Object.keys(selectorMap)).toEqual(expectedElementSelectors);
        const expectedElement1RuleResults: DictionaryStringTo<boolean> = {
            rule1: true,
            rule2: true,
        };

        const expectedElement2RuleResults: DictionaryStringTo<boolean> = {
            rule2: true,
        };

        verifyElementSelector(
            selectorMap[element1Selector],
            element1Selector,
            expectedElement1RuleResults,
        );

        verifyElementSelector(
            selectorMap[element2Selector],
            element2Selector,
            expectedElement2RuleResults,
        );
    });

    test('getPassingInstances with separate snippet field', () => {
        const selectors = ['1', '2', '3'];
        const expectedElementSelectors = ['1', '2'];
        const element1Selector = expectedElementSelectors[0];
        const element2Selector = expectedElementSelectors[1];

        const axeResults: ScanResults = {
            passes: [
                getSampleRule('rule1', [element1Selector], true),
                getSampleRule('rule2', [element1Selector, element2Selector]),
            ],
            violations: [getSampleRule('rule3', selectors)],
            inapplicable: [],
            incomplete: [],
            timestamp: '0',
            targetPageUrl: 'test url',
            targetPageTitle: 'test title',
        };
        const selectorMap = testSubject.getPassingInstances(axeResults);

        expect(Object.keys(selectorMap)).toEqual(expectedElementSelectors);
        const expectedElement1RuleResults: DictionaryStringTo<boolean> = {
            rule1: true,
            rule2: true,
        };

        const expectedElement2RuleResults: DictionaryStringTo<boolean> = {
            rule2: true,
        };

        verifyElementSelector(
            selectorMap[element1Selector],
            element1Selector,
            expectedElement1RuleResults,
        );

        verifyElementSelector(
            selectorMap[element2Selector],
            element2Selector,
            expectedElement2RuleResults,
        );
    });

    test('getIncompleteInstances', () => {
        const selectors = ['1', '2', '3'];
        const expectedElementSelectors = ['1', '2'];
        const element1Selector = expectedElementSelectors[0];
        const element2Selector = expectedElementSelectors[1];

        const axeResults: ScanResults = {
            passes: [getSampleRule('rule1', [element1Selector]), getSampleRule('rule2', selectors)],
            violations: [],
            inapplicable: [],
            incomplete: [
                getSampleRule('rule1', [element2Selector]),
                getSampleRule('rule3', [element1Selector, element2Selector]),
            ],
            timestamp: '0',
            targetPageUrl: 'test url',
            targetPageTitle: 'test title',
        };
        const selectorMap = testSubject.getIncompleteInstances(axeResults);

        expect(Object.keys(selectorMap)).toEqual(expectedElementSelectors);
        const expectedElement1RuleResults: DictionaryStringTo<boolean> = {
            rule3: undefined,
        };

        const expectedElement2RuleResults: DictionaryStringTo<boolean> = {
            rule1: undefined,
            rule3: undefined,
        };

        verifyElementSelector(
            selectorMap[element1Selector],
            element1Selector,
            expectedElement1RuleResults,
        );

        verifyElementSelector(
            selectorMap[element2Selector],
            element2Selector,
            expectedElement2RuleResults,
        );
    });

    test('getAllCompletedInstances with IDs', () => {
        const generateUIDMock = Mock.ofInstance(() => {
            return null;
        });
        const loggerMock = Mock.ofType<Logger>();
        testSubject = new ScannerUtils(
            scannerMock.object,
            loggerMock.object,
            generateUIDMock.object,
        );

        generateUIDMock
            .setup(generate => generate())
            .returns(() => {
                return 1;
            })
            .verifiable(Times.once());

        const axeResults: ScanResults = {
            passes: [getSampleRule('rule1', ['test'])],
            violations: [],
            inapplicable: [],
            incomplete: [],
            timestamp: '0',
            targetPageUrl: 'test url',
            targetPageTitle: 'test title',
        };

        const selectorMap = testSubject.getAllCompletedInstances(axeResults);
        expect(selectorMap.test.ruleResults.rule1.id).toBe(1);
        expect(axeResults.passes[0].nodes[0].instanceId).toBe(1);
        generateUIDMock.verifyAll();
    });

    test('getFailingOrPassingInstances with empty results', () => {
        const axeResults: ScanResults = {
            passes: [],
            violations: [],
            inapplicable: [],
            incomplete: [],
            timestamp: '0',
            targetPageUrl: 'test url',
            targetPageTitle: 'test title',
        };

        const actual = testSubject.getFailingOrPassingInstances(axeResults);

        expect(actual).toEqual({});
    });

    test('getFailingOrPassingInstances with failures', () => {
        const selectors = ['1', '2', '3'];
        const expectedElementSelectors = ['1', '2'];
        const element1Selector = expectedElementSelectors[0];
        const element2Selector = expectedElementSelectors[1];

        const axeResults: ScanResults = {
            passes: [getSampleRule('rule1', [element1Selector]), getSampleRule('rule2', selectors)],
            violations: [
                getSampleRule('rule1', [element2Selector]),
                getSampleRule('rule3', [element1Selector, element2Selector]),
            ],
            inapplicable: [],
            incomplete: [],
            timestamp: '0',
            targetPageUrl: 'test url',
            targetPageTitle: 'test title',
        };

        const actual = testSubject.getFailingOrPassingInstances(axeResults);

        const expected = testSubject.getFailingInstances(axeResults);
        expect(actual).toEqual(expected);
    });

    test('getFailingOrPassingInstances with passes only', () => {
        const selectors = ['1', '2', '3'];
        const expectedElementSelectors = ['1'];
        const element1Selector = expectedElementSelectors[0];

        const axeResults: ScanResults = {
            passes: [getSampleRule('rule1', [element1Selector]), getSampleRule('rule2', selectors)],
            violations: [],
            inapplicable: [],
            incomplete: [],
            timestamp: '0',
            targetPageUrl: 'test url',
            targetPageTitle: 'test title',
        };

        const actual = testSubject.getFailingOrPassingInstances(axeResults);

        const expected = testSubject.getPassingInstances(axeResults);
        expect(actual).toEqual(expected);
    });

    test('getAllCompletedInstances', () => {
        const selectors = ['1', '2', '3'];
        const expectedElementSelectors = ['1', '2', '3'];
        const element1Selector = expectedElementSelectors[0];
        const element2Selector = expectedElementSelectors[1];
        const element3Selector = expectedElementSelectors[2];

        const axeResults: ScanResults = {
            passes: [
                getSampleRule('rule1', [element2Selector]),
                getSampleRule('rule2', selectors),
                getSampleRule('rule3', [element2Selector]),
            ],
            violations: [
                getSampleRule('rule1', [element3Selector]),
                getSampleRule('rule3', [element1Selector, element3Selector]),
            ],
            inapplicable: [],
            incomplete: [],
            timestamp: '0',
            targetPageUrl: 'test url',
            targetPageTitle: 'test title',
        };

        const selectorMap = testSubject.getAllCompletedInstances(axeResults);

        expect(Object.keys(selectorMap)).toEqual(expectedElementSelectors);
        const expectedElement1RuleResults: DictionaryStringTo<boolean> = {
            rule2: true,
            rule3: false,
        };

        const expectedElement2RuleResults: DictionaryStringTo<boolean> = {
            rule1: true,
            rule2: true,
            rule3: true,
        };

        const expectedElement3RuleResults: DictionaryStringTo<boolean> = {
            rule1: false,
            rule2: true,
            rule3: false,
        };

        verifyElementSelector(
            selectorMap[element1Selector],
            element1Selector,
            expectedElement1RuleResults,
        );
        verifyElementSelector(
            selectorMap[element2Selector],
            element2Selector,
            expectedElement2RuleResults,
        );
        verifyElementSelector(
            selectorMap[element3Selector],
            element3Selector,
            expectedElement3RuleResults,
        );
    });

    test('getFingerprint', () => {
        const node: AxeNodeResult = {
            any: [],
            none: [],
            all: [],
            html: 'html',
            target: ['target1', 'target2'],
        };
        const rule: RuleResult = {
            id: 'rule-id',
            nodes: [node],
            description: '',
            help: '',
        };

        const actual = ScannerUtils.getFingerprint(node, rule);

        const expected = 'fp--rule-id--target1;target2--html';
        expect(actual).toEqual(expected);
    });

    function getAxeNodeResult(
        selector: string,
        ruleId,
        status: boolean,
        includeSnippet?: boolean,
    ): DecoratedAxeNodeResult {
        const axeNodeResult = getSampleNodeResultForSelector(selector, includeSnippet);

        return {
            any: axeNodeResult.any,
            all: axeNodeResult.all,
            none: axeNodeResult.none,
            ruleId: ruleId,
            status: status,
            selector: axeNodeResult.target.join(';'),
            html: axeNodeResult.html,
            failureSummary: axeNodeResult.failureSummary,
            help: 'help',
            id: axeNodeResult.instanceId,
            guidanceLinks: [],
            helpUrl: 'help',
        };
    }

    function verifyElementSelector(
        elementResult: HtmlElementAxeResults,
        selector: string,
        ruleResultMap: DictionaryStringTo<boolean>,
        includeSnippet?: boolean,
    ): void {
        expect([selector]).toEqual(elementResult.target);

        const ruleIds = Object.keys(ruleResultMap);
        expect(ruleIds.sort()).toEqual(Object.keys(elementResult.ruleResults).sort());

        const ruleResults: DictionaryStringTo<DecoratedAxeNodeResult> = {};

        ruleIds.forEach(ruleId => {
            ruleResults[ruleId] = getAxeNodeResult(
                selector,
                ruleId,
                ruleResultMap[ruleId],
                includeSnippet,
            );
        });

        const ruleResultIds = Object.keys(ruleResults);
        ruleResultIds.forEach(ruleId => {
            expect(ruleResults[ruleId].status).toBe(elementResult.ruleResults[ruleId].status);
        });
    }

    function getSampleRule(ruleId, selectors: string[], includeSnippet?: boolean): AxeRule {
        const nodes: AxeNodeResult[] = [];

        selectors.forEach(selector => {
            nodes.push(getSampleNodeResultForSelector(selector, includeSnippet));
        });

        return {
            id: ruleId,
            nodes: nodes,
            description: 'description',
        };
    }

    function getSampleNodeResultForSelector(selector, includeSnippet?: boolean): AxeNodeResult {
        const result: AxeNodeResult = {
            any: [
                {
                    id: `any-check1 for ${selector}`,
                    message: 'message for any-check1',
                    data: null,
                },
            ],
            none: [
                {
                    id: `none-check1 for ${selector}`,
                    message: 'message for none-check1',
                    data: {},
                },
            ],
            all: [
                {
                    id: 'none-check1',
                    message: 'message for none-check1',
                    data: 'none check data',
                },
            ],
            target: [selector],
            html: `html for code ${selector}`,
            failureSummary: 'failureSummary',
        };
        if (includeSnippet) {
            result.snippet = 'snippet';
        }
        return result;
    }
});
