// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { labelInNameGetCompletedRequirementDetails } from 'assessments/links/test-steps/label-in-name-get-completed-requirement-details';
import {
    AssessmentData,
    InstanceIdToInstanceDataMap,
} from 'common/types/store-data/assessment-result-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';

describe('labelInNameGetCompletedRequirementDetails', () => {
    test('with only confirmed passes', () => {
        createAndValidateData(2, 0, 0, 0, 0, 0);
    });

    test('with only confirmed failures', () => {
        createAndValidateData(0, 2, 0, 0, 0, 0);
    });

    test('with only failures marked as pass', () => {
        createAndValidateData(0, 0, 2, 0, 0, 0);
    });

    test('with only passes marked as failure', () => {
        createAndValidateData(0, 0, 0, 2, 0, 0);
    });

    test('with only unknowns', () => {
        createAndValidateData(0, 0, 0, 0, 2, 0);
    });

    test('with only instances from other tests', () => {
        createAndValidateData(0, 0, 0, 0, 0, 2);
    });

    test('with a mix of all results', () => {
        createAndValidateData(3, 5, 7, 11, 13, 17);
    });

    function createAndValidateData(
        confirmedPasses: number,
        confirmedFailures: number,
        expectedFailuresMarkedAsPass: number,
        expectedPassesMarkedAsFailures: number,
        unknowns: number,
        instancesFromAnotherTest: number,
    ) {
        const output = labelInNameGetCompletedRequirementDetails(
            getAssessmentTestData(
                confirmedPasses,
                confirmedFailures,
                expectedFailuresMarkedAsPass,
                expectedPassesMarkedAsFailures,
                unknowns,
                instancesFromAnotherTest,
            ),
        );

        expect(output).toStrictEqual({
            confirmedPasses: confirmedPasses,
            confirmedFailures: confirmedFailures,
            expectedPasses: confirmedPasses + expectedPassesMarkedAsFailures,
            expectedFailures: confirmedFailures + expectedFailuresMarkedAsPass,
        });
    }

    function getAssessmentTestData(
        confirmedPasses: number,
        confirmedFailures: number,
        expectedFailuresMarkedAsPass: number,
        expectedPassesMarkedAsFailures: number,
        unknowns: number,
        instancesFromAnotherTest: number,
    ): AssessmentData {
        const generatedAssessmentInstancesMap = generateAssessmentInstancesMap(
            confirmedPasses,
            confirmedFailures,
            expectedFailuresMarkedAsPass,
            expectedPassesMarkedAsFailures,
            unknowns,
            instancesFromAnotherTest,
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
        confirmedPasses: number,
        confirmedFailures: number,
        expectedFailuresMarkedAsPass: number,
        expectedPassesMarkedAsFailures: number,
        unknowns: number,
        instancesFromAnotherTest: number,
    ) {
        const generatedAssessmentInstancesMap: InstanceIdToInstanceDataMap = {};
        addConfirmedPassInstances(generatedAssessmentInstancesMap, confirmedPasses);
        addConfirmedFailureInstances(generatedAssessmentInstancesMap, confirmedFailures);
        addUnexpectedFailureInstancesMarkedAsPass(
            generatedAssessmentInstancesMap,
            expectedFailuresMarkedAsPass,
        );
        addUnexpectedPassInstancesMarkedAsFailure(
            generatedAssessmentInstancesMap,
            expectedPassesMarkedAsFailures,
        );
        addInstancesWithNoSignal(generatedAssessmentInstancesMap, unknowns);
        addInstancesFromAnotherRequirement(
            generatedAssessmentInstancesMap,
            instancesFromAnotherTest,
        );

        return generatedAssessmentInstancesMap;
    }
    function addConfirmedPassInstances(
        instanceDataMap: InstanceIdToInstanceDataMap,
        count: number,
    ) {
        addInstances(instanceDataMap, 'expectedPass', true, ManualTestStatus.PASS, count);
    }

    function addConfirmedFailureInstances(
        instanceDataMap: InstanceIdToInstanceDataMap,
        count: number,
    ) {
        addInstances(instanceDataMap, 'expectedFailure', false, ManualTestStatus.FAIL, count);
    }

    function addUnexpectedFailureInstancesMarkedAsPass(
        instanceDataMap: InstanceIdToInstanceDataMap,
        count: number,
    ) {
        addInstances(instanceDataMap, 'unexpectedPass', false, ManualTestStatus.PASS, count);
    }

    function addUnexpectedPassInstancesMarkedAsFailure(
        instanceDataMap: InstanceIdToInstanceDataMap,
        count: number,
    ) {
        addInstances(instanceDataMap, 'unexpectedFailure', true, ManualTestStatus.FAIL, count);
    }

    function addInstancesWithNoSignal(instanceDataMap: InstanceIdToInstanceDataMap, count: number) {
        addInstances(instanceDataMap, 'unknown', undefined, ManualTestStatus.UNKNOWN, count);
    }

    function addInstancesFromAnotherRequirement(
        instanceDataMap: InstanceIdToInstanceDataMap,
        count: number,
    ) {
        addInstances(instanceDataMap, 'anotherTest', true, ManualTestStatus.PASS, count, false);
    }

    function addInstances(
        instanceDataMap: InstanceIdToInstanceDataMap,
        prefix: string,
        labelContainsVisibleText: boolean | undefined,
        status: ManualTestStatus,
        count: number,
        testStepResultsMatchRequirement: boolean = true,
    ) {
        const propertyBag = { labelContainsVisibleText };
        const requirementName = testStepResultsMatchRequirement ? 'labelInName' : 'notOurTest';
        for (let item: number = 0; item < count; item++) {
            const itemData = {
                testStepResults: {},
                propertyBag,
                target: [],
                html: '',
            };
            itemData.testStepResults[requirementName] = {
                id: 'id',
                status,
                isCapturedByUser: false,
                failureSummary: '',
                isVisualizationEnabled: true,
                isVisible: true,
            };
            instanceDataMap[prefix + item] = itemData;
        }
    }
});
