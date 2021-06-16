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
    const failedDomElements: DictionaryStringTo<string> = {
        [failedSelectors[0]]: failedSelectors[0] + 'element',
        [failedSelectors[1]]: failedSelectors[1] + 'element',
    };
    const incompleteDomElements: DictionaryStringTo<string> = {
        [incompleteSelectors[0]]: incompleteSelectors[0] + 'element',
        [incompleteSelectors[1]]: incompleteSelectors[1] + 'element',
    };

    beforeEach(() => {
        scannerUtilsMock = Mock.ofType(ScannerUtils, MockBehavior.Strict);
        htmlElementUtilsMock = Mock.ofType(HTMLElementUtils, MockBehavior.Strict);
        loggerMock = Mock.ofType<Logger>();

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

        failedSelectors.forEach(selector => {
            htmlElementUtilsMock
                .setup(utils => utils.querySelector(selector))
                .returns(() => failedDomElements[selector] as any)
                .verifiable(Times.once());
        });

        loggerMock
            .setup(logger => logger.log(It.isValue(getLoggedViolationScanResult())))
            .verifiable(Times.once());

        testObject.automatedChecks();

        scannerUtilsMock.verifyAll();
        htmlElementUtilsMock.verifyAll();
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
                        ],
                    },
                    It.isAny(),
                ),
            )
            .callback((rules, handleAxeResult) => {
                handleAxeResult(scannerResultStub);
            })
            .verifiable(Times.once());

        failedSelectors.forEach(selector => {
            htmlElementUtilsMock
                .setup(utils => utils.querySelector(selector))
                .returns(() => failedDomElements[selector] as any)
                .verifiable(Times.once());
        });
        incompleteSelectors.forEach(selector => {
            htmlElementUtilsMock
                .setup(utils => utils.querySelector(selector))
                .returns(() => incompleteDomElements[selector] as any)
                .verifiable(Times.once());
        });

        loggerMock
            .setup(logger => logger.log(It.isValue(getLoggedViolationScanResult())))
            .verifiable(Times.once());
        loggerMock
            .setup(logger => logger.log(It.isValue(getLoggedIncompleteScanResult())))
            .verifiable(Times.once());

        testObject.needsReview();

        scannerUtilsMock.verifyAll();
        htmlElementUtilsMock.verifyAll();
        loggerMock.verifyAll();
    });

    function getAxeScanResult(): ScanResults {
        return {
            passes: getPassScanResult(),
            violations: getViolationScanResult(),
            incomplete: getIncompleteScanResult(),
        } as ScanResults;
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

    function getViolationScanResult(): AxeRule[] {
        const violationRules: AxeRule[] = [];

        failedSelectors.forEach((failedSelector, index) => {
            violationRules.push({
                id: 'failed-rule' + index,
                help: 'help content',
                nodes: [
                    {
                        target: [failedSelector],
                        all: [],
                        any: null,
                        none: [],
                        failureSummary: 'failure summary',
                        html: 'html data',
                    },
                ],
            } as AxeRule);
        });

        return violationRules;
    }

    function getIncompleteScanResult(): AxeRule[] {
        const incompleteRules: AxeRule[] = [];

        incompleteSelectors.forEach((incompleteSelector, index) => {
            incompleteRules.push({
                id: 'incomplete-rule' + index,
                help: 'help content',
                nodes: [
                    {
                        target: [incompleteSelector],
                        all: [],
                        any: null,
                        none: [],
                        failureSummary: 'failure summary',
                        html: 'html data',
                    },
                ],
            } as AxeRule);
        });

        return incompleteRules;
    }

    function getLoggedViolationScanResult(): LoggedRule[] {
        const violationRules = getViolationScanResult();
        const loggedViolationRules: LoggedRule[] = [];

        violationRules.forEach(rule => {
            loggedViolationRules.push({
                id: rule.id,
                description: rule.description,
                nodes: rule.nodes.map(node => {
                    return {
                        all: node.all,
                        any: node.any,
                        none: node.none,
                        target: node.target,
                        domElement: failedDomElements[node.target[0]] as any,
                    } as LoggedNode;
                }),
            });
        });

        return loggedViolationRules;
    }

    function getLoggedIncompleteScanResult(): LoggedRule[] {
        const incompleteRules = getIncompleteScanResult();
        const loggedIncompleteRules: LoggedRule[] = [];

        incompleteRules.forEach(rule => {
            loggedIncompleteRules.push({
                id: rule.id,
                description: rule.description,
                nodes: rule.nodes.map(node => {
                    return {
                        all: node.all,
                        any: node.any,
                        none: node.none,
                        target: node.target,
                        domElement: incompleteDomElements[node.target[0]] as any,
                    } as LoggedNode;
                }),
            });
        });

        return loggedIncompleteRules;
    }
});
