// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FRAME_COMMUNICATION_TIMEOUT_MS } from 'common/constants/frame-timeouts';
import { RuleIncluded } from 'scanner/get-rule-inclusions';
import { Mock } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';
import { AxeOptions } from '../../../../scanner/axe-options';
import { ScanOptions } from '../../../../scanner/scan-options';
import { ScanParameterGenerator } from '../../../../scanner/scan-parameter-generator';

describe('ScanParameterGenerator', () => {
    const includedRulesStub: DictionaryStringTo<RuleIncluded> = {
        'rule-a': {
            status: 'included',
        },
        'rule-b': {
            status: 'included',
        },
    };
    const testObject = new ScanParameterGenerator(includedRulesStub);

    describe('constructor', () => {
        it('should construct the generator', () => {
            const generator = new ScanParameterGenerator(null);
            expect(generator).not.toBeNull();
        });
    });

    describe('getAxeEngineOptions', () => {
        it('should handle options being null', () => {
            const expectedAxeOptions: AxeOptions = {
                restoreScroll: true,
                runOnly: {
                    type: 'rule',
                    values: ['rule-a', 'rule-b', 'frame-tested'],
                },
                pingWaitTime: FRAME_COMMUNICATION_TIMEOUT_MS,
            };

            const scanOptions: ScanOptions = null;
            const result = testObject.getAxeEngineOptions(scanOptions);
            expect(result).toEqual(expectedAxeOptions);
        });

        it('should handle testsToRun to be null', () => {
            const expectedAxeOptions: AxeOptions = {
                restoreScroll: true,
                runOnly: {
                    type: 'rule',
                    values: ['rule-a', 'rule-b', 'frame-tested'],
                },
                pingWaitTime: FRAME_COMMUNICATION_TIMEOUT_MS,
            };

            const scanOptions: ScanOptions = {};
            const result = testObject.getAxeEngineOptions(scanOptions);

            expect(result).toEqual(expectedAxeOptions);
        });

        it('should handle testsToRun to have rules', () => {
            const expectedAxeOptions: AxeOptions = {
                restoreScroll: true,
                runOnly: {
                    type: 'rule',
                    values: ['ruleA', 'ruleB', 'frame-tested'],
                },
                pingWaitTime: FRAME_COMMUNICATION_TIMEOUT_MS,
            };

            const scanOptions: ScanOptions = {
                testsToRun: ['ruleA', 'ruleB'],
            };

            const result = testObject.getAxeEngineOptions(scanOptions);
            expect(result).toEqual(expectedAxeOptions);
        });
    });

    describe('getContext', () => {
        it('should return the dom when options are null', () => {
            const options: ScanOptions = {
                testsToRun: ['throwaway-property'],
            };
            const domStub = Mock.ofInstance(document).object;
            expect(testObject.getContext(domStub, options)).toEqual(domStub);
        });
        it('should return the dom when options are not context related', () => {
            const domStub = Mock.ofInstance(document).object;
            expect(testObject.getContext(domStub, null)).toEqual(domStub);
        });
        it('should return selector when set in options', () => {
            const options: ScanOptions = {
                selector: 'test-selector',
                testsToRun: ['throwaway-property'],
            };
            const returnedContext = 'test-selector';
            expect(testObject.getContext(null, options)).toEqual(returnedContext);
        });
        it('should return dom when set in options', () => {
            const documentStub = Mock.ofInstance(document);
            const options: ScanOptions = {
                dom: documentStub.object,
                testsToRun: ['throwaway-property'],
            };
            const returnedContext = documentStub.object;
            expect(testObject.getContext(null, options)).toEqual(returnedContext);
        });
        it('should return the include/exclude set in options', () => {
            const options: ScanOptions = {
                include: [['include']],
                exclude: [['exclude']],
                testsToRun: ['throwaway-property'],
            };
            const returnedContext = {
                include: [['include']],
                exclude: [['exclude']],
            };
            expect(testObject.getContext(null, options)).toEqual(returnedContext);
        });
        it('should check in order for contexts: dom > selector > include/exclude', () => {
            const documentNodeListStub = Mock.ofInstance(document.childNodes);

            const domFirstOptions: ScanOptions = {
                dom: documentNodeListStub.object,
                selector: 'Test',
                include: [['include']],
                exclude: [['exclude']],
            };
            const domFirstReturnedContext = documentNodeListStub.object;

            const selectorFirstOptions: ScanOptions = {
                selector: 'test-selector',
                include: [['include']],
                exclude: [['exclude']],
            };
            const selectorFirstReturnedContext = 'test-selector';

            expect(testObject.getContext(null, domFirstOptions)).toEqual(domFirstReturnedContext);
            expect(testObject.getContext(null, selectorFirstOptions)).toEqual(
                selectorFirstReturnedContext,
            );
        });
    });
});
