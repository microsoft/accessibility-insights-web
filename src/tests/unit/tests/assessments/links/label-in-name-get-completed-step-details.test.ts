// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { labelInNameGetCompletedStepDetails } from 'assessments/links/test-steps/label-in-name-get-completed-step-details';
import { Assessment } from 'assessments/types/iassessment';
import {
    AssessmentData,
    AssessmentStoreData,
    InstanceIdToInstanceDataMap,
} from 'common/types/store-data/assessment-result-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';

describe('labelInNameGetCompletedStepDetails', () => {
    test('with only expected passes', () => {
        createAndValidateData(2, 0, 0, 0, 0, 2);
    });

    test('with only expected failures', () => {
        createAndValidateData(0, 2, 0, 0, 0, 2);
    });

    test('with only unexpected passes', () => {
        createAndValidateData(0, 0, 2, 0, 0, 2);
    });

    test('with only unexpected failures', () => {
        createAndValidateData(0, 0, 0, 2, 0, 2);
    });

    test('with only unknowns', () => {
        createAndValidateData(0, 0, 0, 0, 2, 2);
    });

    test('with a mix of all results', () => {
        createAndValidateData(3, 5, 7, 11, 13, 39);
    });

    function createAndValidateData(
        expectedPasses: number,
        expectedFailures: number,
        unexpectedPasses: number,
        unexpectedFailures: number,
        unknowns: number,
        total: number,
    ) {
        const output = labelInNameGetCompletedStepDetails(
            getAssessment(),
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
            unknowns,
            total,
        });
    }
    function getAssessment(): Assessment {
        return {
            key: 'linksAssessment',
        } as Assessment;
    }

    function getAssessmentStoreData(
        expectedPasses: number,
        expectedFailures: number,
        unexpectedPasses: number,
        unexpectedFailures: number,
        unknowns: number,
    ): AssessmentStoreData {
        const generatedAssessmentInstancesMap = generateAssessmentInstancesMap(
            expectedPasses,
            expectedFailures,
            unexpectedPasses,
            unexpectedFailures,
            unknowns,
        );
        const assessments: { [key: string]: AssessmentData } = {
            linksAssessment: {
                fullAxeResultsMap: null,
                testStepStatus: {
                    labelInName: {
                        stepFinalResult: ManualTestStatus.FAIL,
                        isStepScanned: false,
                    },
                },
                generatedAssessmentInstancesMap,
            },
        };
        const assessmentStoreMockData = {
            assessments,
            assessmentNavState: null,
            persistedTabInfo: {
                id: 1,
                url: 'url',
                title: 'title',
            },
        } as AssessmentStoreData;
        return assessmentStoreMockData;
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
        addInstances(instanceDataMap, 'expectedPass', 'View ', ManualTestStatus.PASS, count);
    }

    function addExpectedFailureInstances(
        instanceDataMap: InstanceIdToInstanceDataMap,
        count: number,
    ) {
        addInstances(instanceDataMap, 'expectedFailure', 'Foo ', ManualTestStatus.FAIL, count);
    }

    function addUnexpectedPassInstances(
        instanceDataMap: InstanceIdToInstanceDataMap,
        count: number,
    ) {
        addInstances(instanceDataMap, 'unexpectedPass', 'Foo ', ManualTestStatus.PASS, count);
    }

    function addUnexpectedFailureInstances(
        instanceDataMap: InstanceIdToInstanceDataMap,
        count: number,
    ) {
        addInstances(instanceDataMap, 'unexpectedFailure', 'View ', ManualTestStatus.FAIL, count);
    }

    function addUnknownFailureInstances(
        instanceDataMap: InstanceIdToInstanceDataMap,
        count: number,
    ) {
        addInstances(instanceDataMap, 'unknown', 'Unknown ', ManualTestStatus.UNKNOWN, count);
    }

    function addInstances(
        instanceDataMap: InstanceIdToInstanceDataMap,
        prefix: string,
        accessibleName: string,
        status: ManualTestStatus,
        count: number,
    ) {
        const propertyBag = { accessibleName };
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
