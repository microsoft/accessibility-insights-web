// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    convertAssessmentStoreDataToScanNodeResults,
    convertResultsToCardSelectionStoreData,
    convertUnifiedStoreDataToScanNodeResults,
    ScanNodeResult,
} from 'common/store-data-to-scan-node-result-converter';
import {
    AssessmentData,
    AssessmentStoreData,
    GeneratedAssessmentInstance,
    TestStepResult,
} from 'common/types/store-data/assessment-result-data';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import {
    UnifiedRule,
    UnifiedScanResultStoreData,
} from 'common/types/store-data/unified-data-interface';
import { cloneDeep } from 'lodash';
import { ScannerRuleInfoMap } from 'scanner/scanner-rule-info';
import {
    exampleAssessmentResult,
    exampleUnifiedResult,
} from 'tests/unit/tests/common/components/cards/sample-view-model-data';

describe('StoreDataToScanNodeResultConverter', () => {
    describe('convertUnifiedStoreDataToScanNodeResults', () => {
        test('store data is empty returns null', () => {
            const dataStub = {} as UnifiedScanResultStoreData;
            expect(convertUnifiedStoreDataToScanNodeResults(dataStub)).toBeNull();
        });

        test('unified data with no results returns null', () => {
            const storeData = {
                results: [],
                rules: [],
            } as UnifiedScanResultStoreData;
            expect(convertUnifiedStoreDataToScanNodeResults(storeData)).toEqual([]);
        });

        test('unified data is converted successfully', () => {
            const unifiedResult = exampleUnifiedResult;
            const ruleStub = { id: unifiedResult.ruleId } as UnifiedRule;
            const storeData = {
                results: [unifiedResult],
                rules: [ruleStub],
            } as UnifiedScanResultStoreData;

            const expectedResult = [{ ...unifiedResult, rule: ruleStub }];
            expect(convertUnifiedStoreDataToScanNodeResults(storeData)).toEqual(expectedResult);
        });

        test('unified data with no rules is converted successfully', () => {
            const unifiedResult = exampleUnifiedResult;
            const storeData = {
                results: [unifiedResult],
            } as UnifiedScanResultStoreData;

            const expectedResult = [{ ...unifiedResult, rule: { id: unifiedResult.ruleId } }];
            expect(convertUnifiedStoreDataToScanNodeResults(storeData)).toEqual(expectedResult);
        });

        test('unified data with multiple results is converted successfully', () => {
            const unifiedResultOne = cloneDeep(exampleUnifiedResult);
            const unifiedResultTwo = cloneDeep(exampleUnifiedResult);
            unifiedResultTwo.uid = unifiedResultTwo.uid.concat('two');
            unifiedResultTwo.ruleId = unifiedResultTwo.ruleId.concat('two');

            const ruleStubOne = { id: unifiedResultOne.ruleId } as UnifiedRule;
            const ruleStubTwo = { id: unifiedResultTwo.ruleId } as UnifiedRule;
            const unifiedRules = [ruleStubOne, ruleStubTwo];

            const storeData = {
                results: [unifiedResultOne, unifiedResultTwo],
                rules: unifiedRules,
                platformInfo: null,
            } as UnifiedScanResultStoreData;

            const expectedResult = [
                { ...unifiedResultOne, rule: ruleStubOne },
                { ...unifiedResultTwo, rule: ruleStubTwo },
            ];
            expect(convertUnifiedStoreDataToScanNodeResults(storeData)).toEqual(expectedResult);
        });
    });

    describe('convertAssessmentStoreDataToScanNodeResults', () => {
        test('assessment data with invalid selected test type returns null', () => {
            const testKey = 'test-key';
            const dataStub = {
                assessments: {},
                assessmentNavState: { selectedTestType: testKey },
            } as unknown as AssessmentStoreData;
            expect(convertAssessmentStoreDataToScanNodeResults(dataStub, testKey, null)).toBeNull();
        });

        test('assessment data with no card selection store data is converted successfully', () => {
            const testKey = 'test-key';
            const assessmentResult = exampleAssessmentResult;
            const { selector, testStepResult, ruleId } =
                getAssessmentDataProperties(assessmentResult);
            const storeData = {
                assessments: {
                    'test-key': assessmentResult,
                },
                assessmentNavState: { selectedTestType: 'test-key' },
            } as unknown as AssessmentStoreData;

            const expectedResult = [
                {
                    descriptors: { snippet: selector },
                    identifiers: {
                        conciseName: selector,
                        identifier: selector,
                        'css-selector': selector,
                        target: [selector],
                    },
                    resolution: {},
                    rule: {
                        id: ruleId,
                        description: undefined,
                        guidance: undefined,
                        url: undefined,
                    },
                    ruleId: ruleId,
                    status: 'fail',
                    uid: testStepResult.id,
                },
            ];
            expect(convertAssessmentStoreDataToScanNodeResults(storeData, testKey, null)).toEqual(
                expectedResult,
            );
        });

        test('assessment data with rule info and no card selection store data is converted successfully', () => {
            const testKey = 'test-key';
            const assessmentResult = exampleAssessmentResult;
            const { selector, testStepResult, ruleId } =
                getAssessmentDataProperties(assessmentResult);
            const storeData = {
                assessments: {
                    'test-key': assessmentResult,
                },
                assessmentNavState: { selectedTestType: 'test-key' },
            } as unknown as AssessmentStoreData;
            const ruleUrlStub = 'some url';
            const ruleHelpStub = 'some help';
            const ruleA11yCriteriaStub = [];
            const ruleInfoMap: ScannerRuleInfoMap = {
                [ruleId]: {
                    id: ruleId,
                    url: ruleUrlStub,
                    help: ruleHelpStub,
                    a11yCriteria: ruleA11yCriteriaStub,
                },
            };

            const expectedResult = [
                {
                    descriptors: { snippet: selector },
                    identifiers: {
                        conciseName: selector,
                        identifier: selector,
                        'css-selector': selector,
                        target: [selector],
                    },
                    resolution: {},
                    rule: {
                        id: ruleId,
                        description: ruleHelpStub,
                        guidance: ruleA11yCriteriaStub,
                        url: ruleUrlStub,
                    },
                    ruleId: ruleId,
                    status: 'fail',
                    uid: testStepResult.id,
                },
            ];
            expect(
                convertAssessmentStoreDataToScanNodeResults(storeData, testKey, null, ruleInfoMap),
            ).toEqual(expectedResult);
        });

        test('assessment data with card selection store data is converted successfully', () => {
            const testKey = 'test-key';
            const assessmentResult = exampleAssessmentResult;
            const { selector, testStepResult, ruleId } =
                getAssessmentDataProperties(assessmentResult);
            const storeData = {
                assessments: {
                    'test-key': assessmentResult,
                },
                assessmentNavState: { selectedTestType: 'test-key' },
            } as unknown as AssessmentStoreData;
            const cardSelectionStoreData = {
                rules: { [ruleId]: { cards: { [testStepResult.id]: true } } },
            } as unknown as CardSelectionStoreData;

            const expectedResult = [
                {
                    descriptors: { snippet: selector },
                    identifiers: {
                        conciseName: selector,
                        identifier: selector,
                        'css-selector': selector,
                        target: [selector],
                    },
                    resolution: {},
                    rule: {
                        id: ruleId,
                        description: undefined,
                        guidance: undefined,
                        url: undefined,
                    },
                    ruleId: ruleId,
                    status: 'fail',
                    uid: testStepResult.id,
                },
            ];
            expect(
                convertAssessmentStoreDataToScanNodeResults(
                    storeData,
                    testKey,
                    cardSelectionStoreData,
                ),
            ).toEqual(expectedResult);
        });

        test('assessment data with multiple failures on one element is converted successfully', () => {
            const testKey = 'test-key';
            const assessmentResult = cloneDeep(exampleAssessmentResult);
            const {
                selector,
                testStepResult: testStepResult1,
                ruleId: ruleId1,
            } = getAssessmentDataProperties(assessmentResult);

            // Add a second rule failure to this element
            const ruleId2 = 'rule-id-2';
            const testStepResult2 = cloneDeep(testStepResult1);
            testStepResult2.id = 'test-step-result-2';
            assessmentResult.generatedAssessmentInstancesMap![selector].testStepResults[ruleId2] =
                testStepResult2;

            const storeData = {
                assessments: {
                    [testKey]: assessmentResult,
                },
            } as unknown as AssessmentStoreData;

            const expectedResult = [
                {
                    descriptors: { snippet: selector },
                    identifiers: {
                        conciseName: selector,
                        identifier: selector,
                        'css-selector': selector,
                        target: [selector],
                    },
                    resolution: {},
                    rule: {
                        id: ruleId1,
                        description: undefined,
                        guidance: undefined,
                        url: undefined,
                    },
                    ruleId: ruleId1,
                    status: 'fail',
                    uid: testStepResult1.id,
                },
                {
                    descriptors: { snippet: selector },
                    identifiers: {
                        conciseName: selector,
                        identifier: selector,
                        'css-selector': selector,
                        target: [selector],
                    },
                    resolution: {},
                    rule: {
                        id: ruleId2,
                        description: undefined,
                        guidance: undefined,
                        url: undefined,
                    },
                    ruleId: ruleId2,
                    status: 'fail',
                    uid: testStepResult2.id,
                },
            ];
            expect(convertAssessmentStoreDataToScanNodeResults(storeData, testKey, null)).toEqual(
                expectedResult,
            );
        });

        test('assessment data with failures on different elements is converted successfully', () => {
            const testKey = 'test-key';
            const assessmentResult = cloneDeep(exampleAssessmentResult);
            const {
                testStepResult: testStepResult1,
                selector: selector1,
                ruleId: ruleId1,
            } = getAssessmentDataProperties(assessmentResult);

            // Add a second rule failure to a different element
            const selector2 = 'selector-2';
            const ruleId2 = 'rule-id-2';
            const testStepResult2 = cloneDeep(testStepResult1);
            testStepResult2.id = 'test-step-result-2';
            assessmentResult.generatedAssessmentInstancesMap![selector2] = {
                target: [selector2],
                html: selector2,
                testStepResults: {
                    [ruleId2]: testStepResult2,
                },
            } as GeneratedAssessmentInstance;

            const storeData = {
                assessments: {
                    [testKey]: assessmentResult,
                },
            } as unknown as AssessmentStoreData;

            const expectedResult = [
                {
                    descriptors: { snippet: selector1 },
                    identifiers: {
                        conciseName: selector1,
                        identifier: selector1,
                        'css-selector': selector1,
                        target: [selector1],
                    },
                    resolution: {},
                    rule: {
                        id: ruleId1,
                        description: undefined,
                        guidance: undefined,
                        url: undefined,
                    },
                    ruleId: ruleId1,
                    status: 'fail',
                    uid: testStepResult1.id,
                },
                {
                    descriptors: { snippet: selector2 },
                    identifiers: {
                        conciseName: selector2,
                        identifier: selector2,
                        'css-selector': selector2,
                        target: [selector2],
                    },
                    resolution: {},
                    rule: {
                        id: ruleId2,
                        description: undefined,
                        guidance: undefined,
                        url: undefined,
                    },
                    ruleId: ruleId2,
                    status: 'fail',
                    uid: testStepResult2.id,
                },
            ];
            expect(convertAssessmentStoreDataToScanNodeResults(storeData, testKey, null)).toEqual(
                expectedResult,
            );
        });

        function getAssessmentDataProperties(data: AssessmentData) {
            const selector = Object.keys(data.generatedAssessmentInstancesMap!)[0];
            const ruleId = Object.keys(
                data.generatedAssessmentInstancesMap![selector].testStepResults,
            )[0];
            const testStepResult: TestStepResult =
                data.generatedAssessmentInstancesMap![selector].testStepResults[ruleId];

            return {
                testStepResult,
                selector,
                ruleId,
            };
        }
    });

    describe('convertResultsToCardSelectionStoreData', () => {
        let stateStub: CardSelectionStoreData;
        let expectedResultStub: CardSelectionStoreData;

        beforeEach(() => {
            stateStub = { rules: {} } as CardSelectionStoreData;
            expectedResultStub = {
                rules: { 'image-alt': { cards: { 'some-guid-here': false }, isExpanded: false } },
            } as unknown as CardSelectionStoreData;
        });

        test('store data is null returns existing state', () => {
            expect(convertResultsToCardSelectionStoreData(stateStub, null)).toEqual(stateStub);
        });

        test('unified data is converted successfully', () => {
            const unifiedResult = exampleUnifiedResult;
            const ruleStub = { id: unifiedResult.ruleId } as UnifiedRule;
            const result = { ...unifiedResult, rule: ruleStub } as ScanNodeResult;

            expect(convertResultsToCardSelectionStoreData(stateStub, [result])).toEqual(
                expectedResultStub,
            );
        });
    });
});
