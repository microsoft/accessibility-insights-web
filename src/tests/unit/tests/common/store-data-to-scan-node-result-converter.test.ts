// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    convertResultsToCardSelectionStoreData,
    convertStoreDataForScanNodeResults,
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
import {
    exampleAssessmentResult,
    exampleUnifiedResult,
} from 'tests/unit/tests/common/components/cards/sample-view-model-data';

describe('StoreDataToScanNodeResultConverter', () => {
    describe('convertStoreDataForScanNodeResults', () => {
        test('store data is empty returns null', () => {
            const dataStub = {} as UnifiedScanResultStoreData;
            expect(convertStoreDataForScanNodeResults(dataStub)).toBeNull();
        });

        test('unified data with no results returns null', () => {
            const storeData = {
                results: [],
                rules: [],
            } as UnifiedScanResultStoreData;
            expect(convertStoreDataForScanNodeResults(storeData)).toEqual([]);
        });

        test('unified data is converted successfully', () => {
            const unifiedResult = exampleUnifiedResult;
            const ruleStub = { id: unifiedResult.ruleId } as UnifiedRule;
            const storeData = {
                results: [unifiedResult],
                rules: [ruleStub],
            } as UnifiedScanResultStoreData;

            const expectedResult = [{ ...unifiedResult, rule: ruleStub }];
            expect(convertStoreDataForScanNodeResults(storeData)).toEqual(expectedResult);
        });

        test('unified data with no rules is converted successfully', () => {
            const unifiedResult = exampleUnifiedResult;
            const storeData = {
                results: [unifiedResult],
            } as UnifiedScanResultStoreData;

            const expectedResult = [{ ...unifiedResult, rule: { id: unifiedResult.ruleId } }];
            expect(convertStoreDataForScanNodeResults(storeData)).toEqual(expectedResult);
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
            expect(convertStoreDataForScanNodeResults(storeData)).toEqual(expectedResult);
        });

        test('assessment data with invalid selected test type returns null', () => {
            const dataStub = {
                assessments: {},
                assessmentNavState: { selectedTestType: 'test-key' },
            } as unknown as AssessmentStoreData;
            expect(convertStoreDataForScanNodeResults(dataStub)).toBeNull();
        });

        test('assessment data with no card selection store data is converted successfully', () => {
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
                    identifiers: { conciseName: selector, identifier: selector },
                    isSelected: false,
                    resolution: { howToFixSummary: testStepResult.failureSummary },
                    rule: { id: ruleId },
                    ruleId: ruleId,
                    status: 'fail',
                    uid: testStepResult.id,
                },
            ];
            expect(convertStoreDataForScanNodeResults(storeData)).toEqual(expectedResult);
        });

        test('assessment data with card selection store data is converted successfully', () => {
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
                    identifiers: { conciseName: selector, identifier: selector },
                    isSelected: true,
                    resolution: { howToFixSummary: testStepResult.failureSummary },
                    rule: { id: ruleId },
                    ruleId: ruleId,
                    status: 'fail',
                    uid: testStepResult.id,
                },
            ];
            expect(convertStoreDataForScanNodeResults(storeData, cardSelectionStoreData)).toEqual(
                expectedResult,
            );
        });

        test('assessment data with multiple failures on one element is converted successfully', () => {
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
                    'test-key': assessmentResult,
                },
                assessmentNavState: { selectedTestType: 'test-key' },
            } as unknown as AssessmentStoreData;

            const expectedResult = [
                {
                    descriptors: { snippet: selector },
                    identifiers: { conciseName: selector, identifier: selector },
                    isSelected: false,
                    resolution: { howToFixSummary: testStepResult1.failureSummary },
                    rule: { id: ruleId1 },
                    ruleId: ruleId1,
                    status: 'fail',
                    uid: testStepResult1.id,
                },
                {
                    descriptors: { snippet: selector },
                    identifiers: { conciseName: selector, identifier: selector },
                    isSelected: false,
                    resolution: { howToFixSummary: testStepResult2.failureSummary },
                    rule: { id: ruleId2 },
                    ruleId: ruleId2,
                    status: 'fail',
                    uid: testStepResult2.id,
                },
            ];
            expect(convertStoreDataForScanNodeResults(storeData)).toEqual(expectedResult);
        });

        test('assessment data with failures on different elements is converted successfully', () => {
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
                    'test-key': assessmentResult,
                },
                assessmentNavState: { selectedTestType: 'test-key' },
            } as unknown as AssessmentStoreData;

            const expectedResult = [
                {
                    descriptors: { snippet: selector1 },
                    identifiers: { conciseName: selector1, identifier: selector1 },
                    isSelected: false,
                    resolution: { howToFixSummary: testStepResult1.failureSummary },
                    rule: { id: ruleId1 },
                    ruleId: ruleId1,
                    status: 'fail',
                    uid: testStepResult1.id,
                },
                {
                    descriptors: { snippet: selector2 },
                    identifiers: { conciseName: selector2, identifier: selector2 },
                    isSelected: false,
                    resolution: { howToFixSummary: testStepResult2.failureSummary },
                    rule: { id: ruleId2 },
                    ruleId: ruleId2,
                    status: 'fail',
                    uid: testStepResult2.id,
                },
            ];
            expect(convertStoreDataForScanNodeResults(storeData)).toEqual(expectedResult);
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

    describe('convertStoreDataForScanNodeResults', () => {
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
            const storeData = {
                results: [unifiedResult],
                rules: [ruleStub],
            } as UnifiedScanResultStoreData;

            expect(convertResultsToCardSelectionStoreData(stateStub, storeData)).toEqual(
                expectedResultStub,
            );
        });

        test('assessment data is converted successfully', () => {
            const assessmentResult = exampleAssessmentResult;
            const storeData = {
                assessments: {
                    'test-key': assessmentResult,
                },
                assessmentNavState: { selectedTestType: 'test-key' },
            } as unknown as AssessmentStoreData;

            expect(convertResultsToCardSelectionStoreData(stateStub, storeData)).toEqual(
                expectedResultStub,
            );
        });
    });
});
