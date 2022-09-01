// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { labelInNameGetCompletedStepDetails } from 'assessments/links/test-steps/label-in-name-get-completed-step-details';
import {
    AssessmentData,
    InstanceIdToInstanceDataMap,
} from 'common/types/store-data/assessment-result-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';

describe('labelInNameGetCompletedStepDetails', () => {
    test('with only expected passes', () => {
        createAndValidateData(2, 0, 0, 0, 0);
    });

    test('with only expected failures', () => {
        createAndValidateData(0, 2, 0, 0, 0);
    });

    test('with only unexpected passes', () => {
        createAndValidateData(0, 0, 2, 0, 0);
    });

    test('with only unexpected failures', () => {
        createAndValidateData(0, 0, 0, 2, 0);
    });

    test('with only unknowns', () => {
        createAndValidateData(0, 0, 0, 0, 2);
    });

    test('with a mix of all results', () => {
        createAndValidateData(3, 5, 7, 11, 13);
    });

    function createAndValidateData(
        expectedPasses: number,
        expectedFailures: number,
        unexpectedPasses: number,
        unexpectedFailures: number,
        unknowns: number,
    ) {
        const output = labelInNameGetCompletedStepDetails(
            getAssessmentStoreData(
                expectedPasses,
                expectedFailures,
                unexpectedPasses,
                unexpectedFailures,
                unknowns,
            ),
        );

        expect(output).toStrictEqual({
            expectedPasses,
            expectedFailures,
            unexpectedPasses,
            unexpectedFailures,
        });
    }

    function getAssessmentStoreData(
        expectedPasses: number,
        expectedFailures: number,
        unexpectedPasses: number,
        unexpectedFailures: number,
        unknowns: number,
    ): AssessmentData {
        const generatedAssessmentInstancesMap = generateAssessmentInstancesMap(
            expectedPasses,
            expectedFailures,
            unexpectedPasses,
            unexpectedFailures,
            unknowns,
        );
        return {
            fullAxeResultsMap: null,
            testStepStatus: {
                labelInName: {
                    stepFinalResult: ManualTestStatus.FAIL,
                    isStepScanned: false,
                },
            },
            generatedAssessmentInstancesMap,
        };
    }

    function generateAssessmentInstancesMap(
        expectedPasses: number,
        expectedFailures: number,
        unexpectedPasses: number,
        unexpectedFailures: number,
        unknowns: number,
    ) {
        const generatedAssessmentInstancesMap: InstanceIdToInstanceDataMap = {};
        addExpectedPassInstances(generatedAssessmentInstancesMap, expectedPasses);
        addExpectedFailureInstances(generatedAssessmentInstancesMap, expectedFailures);
        addUnexpectedPassInstances(generatedAssessmentInstancesMap, unexpectedPasses);
        addUnexpectedFailureInstances(generatedAssessmentInstancesMap, unexpectedFailures);
        addUnknownFailureInstances(generatedAssessmentInstancesMap, unknowns);

        return generatedAssessmentInstancesMap;
    }
    function addExpectedPassInstances(instanceDataMap: InstanceIdToInstanceDataMap, count: number) {
        addInstances(instanceDataMap, 'expectedPass', true, ManualTestStatus.PASS, count);
    }

    function addExpectedFailureInstances(
        instanceDataMap: InstanceIdToInstanceDataMap,
        count: number,
    ) {
        addInstances(instanceDataMap, 'expectedFailure', false, ManualTestStatus.FAIL, count);
    }

    function addUnexpectedPassInstances(
        instanceDataMap: InstanceIdToInstanceDataMap,
        count: number,
    ) {
        addInstances(instanceDataMap, 'unexpectedPass', false, ManualTestStatus.PASS, count);
    }

    function addUnexpectedFailureInstances(
        instanceDataMap: InstanceIdToInstanceDataMap,
        count: number,
    ) {
        addInstances(instanceDataMap, 'unexpectedFailure', true, ManualTestStatus.FAIL, count);
    }

    function addUnknownFailureInstances(
        instanceDataMap: InstanceIdToInstanceDataMap,
        count: number,
    ) {
        addInstances(instanceDataMap, 'unknown', false, ManualTestStatus.UNKNOWN, count);
    }

    function addInstances(
        instanceDataMap: InstanceIdToInstanceDataMap,
        prefix: string,
        labelContainsVisibleText: boolean,
        status: ManualTestStatus,
        count: number,
    ) {
        const propertyBag = { labelContainsVisibleText };
        for (let item: number = 0; item < count; item++) {
            instanceDataMap[prefix + item] = {
                testStepResults: {
                    labelInName: {
                        id: 'id',
                        status,
                        isCapturedByUser: false,
                        failureSummary: '',
                        isVisualizationEnabled: true,
                        isVisible: true,
                    },
                },
                propertyBag,
                target: [],
                html: '',
            };
        }
    }
});
