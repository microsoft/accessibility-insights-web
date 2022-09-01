// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Assessment } from 'assessments/types/iassessment';
import {
    AssessmentStoreData,
    GeneratedAssessmentInstance,
    TestStepResult,
} from 'common/types/store-data/assessment-result-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { forEach } from 'lodash';

const labelIsInName = (instance: GeneratedAssessmentInstance): boolean => {
    // TODO: Replace this placeholder with final code
    const accessibleName: string = instance.propertyBag['accessibleName'];
    return accessibleName && accessibleName.includes('View ');
};

export const labelInNameGetCompletedStepDetails = (
    assessment: Assessment,
    storeData: AssessmentStoreData,
) => {
    const key = assessment.key;
    const root = storeData.assessments[key];
    let expectedPasses = 0;
    let expectedFailures = 0;
    let unexpectedPasses = 0;
    let unexpectedFailures = 0;
    let unknowns = 0;
    forEach(Object.keys(root.generatedAssessmentInstancesMap), key => {
        const instance: GeneratedAssessmentInstance = root.generatedAssessmentInstancesMap[key];
        const testStepResult: TestStepResult = instance.testStepResults['labelInName'];
        const status = testStepResult ? testStepResult.status : ManualTestStatus.UNKNOWN;
        switch (status) {
            case ManualTestStatus.PASS:
                if (labelIsInName(instance)) {
                    expectedPasses++;
                } else {
                    unexpectedPasses++;
                }
                break;
            case ManualTestStatus.FAIL:
                if (!labelIsInName(instance)) {
                    expectedFailures++;
                } else {
                    unexpectedFailures++;
                }
                break;
            default:
                unknowns++;
                break;
        }
    });

    return {
        expectedPasses,
        expectedFailures,
        unexpectedPasses,
        unexpectedFailures,
        unknowns,
        total: expectedPasses + expectedFailures + unexpectedPasses + unexpectedFailures + unknowns,
    };
};
