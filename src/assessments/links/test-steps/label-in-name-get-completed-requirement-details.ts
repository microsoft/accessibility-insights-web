// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { LinksTestStep } from 'assessments/links/test-steps/test-steps';
import { AssessmentData, TestStepResult } from 'common/types/store-data/assessment-result-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { forOwn } from 'lodash';

export const labelInNameGetCompletedRequirementDetails = (assessmentData: AssessmentData) => {
    let expectedPasses = 0;
    let expectedFailures = 0;
    let confirmedPasses = 0;
    let confirmedFailures = 0;

    forOwn(assessmentData.generatedAssessmentInstancesMap ?? {}, instance => {
        const testStepResult: TestStepResult = instance.testStepResults[LinksTestStep.labelInName];
        if (!testStepResult) {
            return;
        }

        const labelContainsVisibleText = instance.propertyBag?.['labelContainsVisibleText'];
        if (labelContainsVisibleText == null) {
            return;
        }

        const status = testStepResult.status;
        if (labelContainsVisibleText) {
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
