// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { LinksTestStep } from 'assessments/links/test-steps/test-steps';
import {
    AssessmentData,
    GeneratedAssessmentInstance,
    TestStepResult,
} from 'common/types/store-data/assessment-result-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { forEach } from 'lodash';

const labelContainsVisibleText = (instance: GeneratedAssessmentInstance): boolean | undefined => {
    const labelContainsVisibleText = instance.propertyBag['labelContainsVisibleText'];
    if (labelContainsVisibleText === undefined) {
        return undefined;
    }
    return labelContainsVisibleText === true;
};

export const labelInNameGetCompletedRequirementDetails = (assessmentData: AssessmentData) => {
    let expectedPasses = 0;
    let expectedFailures = 0;
    let confirmedPasses = 0;
    let confirmedFailures = 0;
    forEach(Object.keys(assessmentData.generatedAssessmentInstancesMap), key => {
        const instance: GeneratedAssessmentInstance =
            assessmentData.generatedAssessmentInstancesMap[key];
        const testStepResult: TestStepResult = instance.testStepResults[LinksTestStep.labelInName];
        if (!testStepResult) {
            return;
        }
        const status = testStepResult.status;
        const expectedPass = labelContainsVisibleText(instance);

        if (expectedPass === undefined) {
            return;
        }

        if (expectedPass) {
            expectedPasses++;
            if (status === ManualTestStatus.PASS) {
                confirmedPasses++;
            }
        } else {
            expectedFailures++;
            if (status === ManualTestStatus.FAIL) {
                confirmedFailures++;
            }
        }
    });

    return {
        confirmedPasses,
        confirmedFailures,
        expectedPasses,
        expectedFailures,
    };
};
