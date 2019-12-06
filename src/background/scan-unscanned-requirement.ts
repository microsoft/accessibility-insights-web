// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { forOwn } from 'lodash';
import { AssessmentData } from '../common/types/store-data/assessment-result-data';

export function ScanUnscannedRequirement(
    scanStep: (step: string) => void,
    data: AssessmentData,
): void {
    forOwn(data.testStepStatus, (stepResult, step) => {
        if (stepResult.isStepScanned === false) {
            scanStep(step);
            return false;
        }
    });
}
