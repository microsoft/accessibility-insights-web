// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { A11YSelfValidator, LoggedNode, LoggedRule } from '../../../../common/a11y-self-validator';
import { HTMLElementUtils } from '../../../../common/html-element-utils';
import { Logger } from '../../../../common/logging/logger';
import { ScannerUtils } from '../../../../injected/scanner-utils';
import { ScanResults } from '../../../../scanner/iruleresults';
import { DictionaryStringTo } from '../../../../types/common-types';

describe('A11YAutoCheckTest', () => {
    let scannerUtilsMock: IMock<ScannerUtils>;
    let htmlElementUtilsMock: IMock<HTMLElementUtils>;
    let loggerMock: IMock<Logger>;
    let testObject: A11YSelfValidator;

    const failedSelectors: string[] = ['failed-div1', 'failed-div2'];
    const failedDomElements: DictionaryStringTo<string> = {
        [failedSelectors[0]]: failedSelectors[0] + 'element',
        [failedSelectors[1]]: failedSelectors[1] + 'element',
    };

    beforeEach(() => {
        scannerUtilsMock = Mock.ofType(ScannerUtils, MockBehavior.Strict);
        htmlElementUtilsMock = Mock.ofType(HTMLElementUtils, MockBehavior.Strict);
        loggerMock = Mock.ofType<Logger>();

        testObject = new A11YSelfValidator(
            scannerUtilsMock.object,
            htmlElementUtilsMock.object,
            loggerMock.object,
        );
    });

    test('scan', () => {
        const scannerResultStub = getAxeScanResult();

        scannerUtilsMock
            .setup(ksu =>
                ksu.scan(
                    null,
                    It.is(param => typeof param === 'function'),
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

        loggerMock
            .setup(logger => logger.log(It.isValue(getLoggedViolationScanResult())))
            .verifiable(Times.once());

        testObject.validate();

        scannerUtilsMock.verifyAll();
        htmlElementUtilsMock.verifyAll();
        loggerMock.verifyAll();
    });

    function getAxeScanResult(): ScanResults {
        return {
            passes: getPassScanResult(),
            violations: getViolationScanResult(),
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
});
