// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HTMLElementUtils } from 'common/html-element-utils';
import { Logger } from 'common/logging/logger';
import { SelfFastPass, LoggedNode, LoggedRule } from 'common/self-fast-pass';
import { ScannerUtils } from 'injected/scanner-utils';
import { ScanResults } from 'scanner/iruleresults';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';

describe('SelfFastPass', () => {
    let scannerUtilsMock: IMock<ScannerUtils>;
    let htmlElementUtilsMock: IMock<HTMLElementUtils>;
    let loggerMock: IMock<Logger>;
    let testObject: SelfFastPass;

    const failedSelectors: string[] = ['failed-div1', 'failed-div2'];
    const incompleteSelectors: string[] = ['incomplete-div1', 'incomplete-div2'];
    const domElements: DictionaryStringTo<string> = {
        [failedSelectors[0]]: failedSelectors[0] + 'element',
        [failedSelectors[1]]: failedSelectors[1] + 'element',
        [incompleteSelectors[0]]: incompleteSelectors[0] + 'element',
        [incompleteSelectors[1]]: incompleteSelectors[1] + 'element',
    };

    beforeEach(() => {
        scannerUtilsMock = Mock.ofType(ScannerUtils, MockBehavior.Strict);
        htmlElementUtilsMock = Mock.ofType(HTMLElementUtils);
        loggerMock = Mock.ofType<Logger>();

        htmlElementUtilsMock
            .setup(utils => utils.querySelector(It.isAnyString()))
            .returns(selector => domElements[selector] as any);

        testObject = new SelfFastPass(
            scannerUtilsMock.object,
            htmlElementUtilsMock.object,
            loggerMock.object,
        );
    });

    test('automatedChecks', () => {
        const scannerResultStub = getAxeScanResult();

        scannerUtilsMock
            .setup(ksu => ksu.scan({ testsToRun: null }, It.isAny()))
            .callback((rules, handleAxeResult) => {
                handleAxeResult(scannerResultStub);
            })
            .verifiable(Times.once());

        const expectedViolationLog = getExpectedLoggedResults(getViolationScanResult());
        loggerMock
            .setup(logger => logger.log(It.isValue(expectedViolationLog)))
            .verifiable(Times.once());

        testObject.automatedChecks();

        scannerUtilsMock.verifyAll();
        loggerMock.verifyAll();
    });

    test('needsReview', () => {
        const scannerResultStub = getAxeScanResult();

        scannerUtilsMock
            .setup(ksu =>
                ksu.scan(
                    {
                        testsToRun: [
                            'aria-input-field-name',
                            'color-contrast',
                            'th-has-data-cells',
                            'link-in-text-block',
                            'scrollable-region-focusable',
                            'label-content-name-mismatch',
                        ],
                    },
                    It.isAny(),
                ),
            )
            .callback((rules, handleAxeResult) => {
                handleAxeResult(scannerResultStub);
            })
            .verifiable(Times.once());

        const expectedViolationLog = getExpectedLoggedResults(getViolationScanResult());
        const expectedIncompleteLog = getExpectedLoggedResults(getIncompleteScanResult());

        loggerMock
            .setup(logger => logger.log(It.isValue(expectedViolationLog)))
            .verifiable(Times.once());
        loggerMock
            .setup(logger => logger.log(It.isValue(expectedIncompleteLog)))
            .verifiable(Times.once());

        testObject.needsReview();

        scannerUtilsMock.verifyAll();
        loggerMock.verifyAll();
    });

    test('customScan for violations of one rule', () => {
        const selectedRuleId = 'rule0';
        const expectedSelector = failedSelectors[0];

        scannerUtilsMock
            .setup(ksu => ksu.scan({ testsToRun: [selectedRuleId] }, It.isAny()))
            .callback((rules, handleAxeResult) => {
                const customResult = {
                    violations: getStubScanResults([expectedSelector]),
                } as ScanResults;
                handleAxeResult(customResult);
            })
            .verifiable(Times.once());

        const expectedLogOutput = getExpectedLoggedResults(getStubScanResults([expectedSelector]));
        loggerMock
            .setup(logger => logger.log(It.isValue(expectedLogOutput)))
            .verifiable(Times.once());

        testObject.customScan([selectedRuleId], ['violations']);

        scannerUtilsMock.verifyAll();
        loggerMock.verifyAll();
    });

    function getAxeScanResult(): ScanResults {
        return {
            passes: getPassScanResult(),
            violations: getViolationScanResult(),
            incomplete: getIncompleteScanResult(),
        } as ScanResults;
    }

    function getViolationScanResult(): AxeRule[] {
        return getStubScanResults(failedSelectors);
    }

    function getIncompleteScanResult(): AxeRule[] {
        return getStubScanResults(incompleteSelectors);
    }

    function getPassScanResult(): AxeRule[] {
        return [
            {
                id: 'passed-rule1',
                nodes: [
                    {
                        target: ['head'],
                    },
                ],
            },
        ] as AxeRule[];
    }

    function getStubScanResults(selectors: string[]) {
        return selectors.map(
            (selector, index) =>
                ({
                    id: 'rule' + index,
                    help: 'help content',
                    nodes: [
                        {
                            target: [selector],
                            all: [],
                            any: null,
                            none: [],
                            failureSummary: 'failure summary',
                            html: 'html data',
                        },
                    ],
                } as AxeRule),
        );
    }

    function getExpectedLoggedResults(rules: AxeRule[]): LoggedRule[] {
        const loggedIncompleteRules: LoggedRule[] = [];

        for (const rule of rules) {
            loggedIncompleteRules.push({
                id: rule.id,
                description: rule.description,
                nodes: rule.nodes.map(node => {
                    return {
                        all: node.all,
                        any: node.any,
                        none: node.none,
                        target: node.target,
                        domElement: domElements[node.target[0] as string] as any,
                    } as LoggedNode;
                }),
            });
        }

        return loggedIncompleteRules;
    }
});
