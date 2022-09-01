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

const labelContainsVisibleText = (instance: GeneratedAssessmentInstance): boolean => {
    const labelContainsVisibleText = instance.propertyBag['labelContainsVisibleText'];
    return labelContainsVisibleText === true;
};

export const labelInNameGetCompletedStepDetails = (assessmentData: AssessmentData) => {
    let expectedPasses = 0;
    let expectedFailures = 0;
    let unexpectedPasses = 0;
    let unexpectedFailures = 0;
    forEach(Object.keys(assessmentData.generatedAssessmentInstancesMap), key => {
        const instance: GeneratedAssessmentInstance =
            assessmentData.generatedAssessmentInstancesMap[key];
        const testStepResult: TestStepResult = instance.testStepResults[LinksTestStep.labelInName];
        if (!testStepResult) {
            return;
        }
        const status = testStepResult.status;
        switch (status) {
            case ManualTestStatus.PASS:
                if (labelContainsVisibleText(instance)) {
                    expectedPasses++;
                } else {
                    unexpectedPasses++;
                }
                break;
            case ManualTestStatus.FAIL:
                if (!labelContainsVisibleText(instance)) {
                    expectedFailures++;
                } else {
                    unexpectedFailures++;
                }
                break;
        }
    });

    return {
        expectedPasses,
        expectedFailures,
        unexpectedPasses,
        unexpectedFailures,
    };
};
