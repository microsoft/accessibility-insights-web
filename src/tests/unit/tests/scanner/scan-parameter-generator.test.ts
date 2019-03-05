// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, MockBehavior } from 'typemoq';

import { ScanOptions } from '../../../../scanner/exposed-apis';
import { AxeOptions } from '../../../../scanner/launcher';
import { RuleSifter, RuleWithA11YCriteria } from '../../../../scanner/rule-sifter';
import { ScanParamaterGenerator } from '../../../../scanner/scan-parameter-generator';

describe('ScanParamaterGenerator', () => {
    describe('constructor', () => {
        it('should construct the generator', () => {
            const generator = new ScanParamaterGenerator(null);
            expect(generator).not.toBeNull();
        });
    });

    describe('getAxeEngineOptions', () => {
        let siftedRulesStub: RuleWithA11YCriteria[];
        let mockSifter: IMock<RuleSifter>;
        let testObject: ScanParamaterGenerator;

        beforeEach(() => {
            siftedRulesStub = [
                {
                    id: 'rule-a',
                    a11yCriteria: [],
                },
                {
                    id: 'rule-b',
                    a11yCriteria: [],
                },
            ];

            mockSifter = Mock.ofType(RuleSifter, MockBehavior.Strict);
            mockSifter.setup(ms => ms.getSiftedRules()).returns(() => siftedRulesStub);

            testObject = new ScanParamaterGenerator(mockSifter.object);
        });

        it('should handle options being null', () => {
            const expectedAxeOptions: AxeOptions = {
                restoreScroll: true,
                runOnly: {
                    type: 'rule',
                    values: ['rule-a', 'rule-b'],
                },
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
                    values: ['rule-a', 'rule-b'],
                },
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
                    values: ['ruleA', 'ruleB'],
                },
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
            const mockSifter = Mock.ofType(RuleSifter, MockBehavior.Strict);
            const generator = new ScanParamaterGenerator(mockSifter.object);
            const options: ScanOptions = {
                testsToRun: ['throwaway-property'],
            };
            const domStub = Mock.ofInstance(document).object;
            expect(generator.getContext(domStub, options)).toEqual(domStub);
        });
        it('should return the dom when options are not context related', () => {
            const mockSifter = Mock.ofType(RuleSifter, MockBehavior.Strict);
            const generator = new ScanParamaterGenerator(mockSifter.object);
            const domStub = Mock.ofInstance(document).object;
            expect(generator.getContext(domStub, null)).toEqual(domStub);
        });
        it('should return selector when set in options', () => {
            const mockSifter = Mock.ofType(RuleSifter, MockBehavior.Strict);
            const generator = new ScanParamaterGenerator(mockSifter.object);
            const options: ScanOptions = {
                selector: 'test-selector',
                testsToRun: ['throwaway-property'],
            };
            const returnedContext = 'test-selector';
            expect(generator.getContext(null, options)).toEqual(returnedContext);
        });
        it('should return dom when set in options', () => {
            const mockSifter = Mock.ofType(RuleSifter, MockBehavior.Strict);
            const generator = new ScanParamaterGenerator(mockSifter.object);
            const documentStub = Mock.ofInstance(document);
            const options: ScanOptions = {
                dom: documentStub.object,
                testsToRun: ['throwaway-property'],
            };
            const returnedContext = documentStub.object;
            expect(generator.getContext(null, options)).toEqual(returnedContext);
        });
        it('should return the include/exclude set in options', () => {
            const mockSifter = Mock.ofType(RuleSifter, MockBehavior.Strict);
            const generator = new ScanParamaterGenerator(mockSifter.object);
            const options: ScanOptions = {
                include: [['include']],
                exclude: [['exclude']],
                testsToRun: ['throwaway-property'],
            };
            const returnedContext = {
                include: [['include']],
                exclude: [['exclude']],
            };
            expect(generator.getContext(null, options)).toEqual(returnedContext);
        });
        it('should check in order for contexts: dom > selector > include/exclude', () => {
            const mockSifter = Mock.ofType(RuleSifter, MockBehavior.Strict);
            const generator = new ScanParamaterGenerator(mockSifter.object);
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

            expect(generator.getContext(null, domFirstOptions)).toEqual(domFirstReturnedContext);
            expect(generator.getContext(null, selectorFirstOptions)).toEqual(selectorFirstReturnedContext);
        });
    });
});
