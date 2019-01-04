// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IAssessmentData } from '../common/types/store-data/iassessment-result-data';
import { forOwn } from 'lodash';

export function ScanUnscannedRequirement(scanStep: (step: string) => void, data: IAssessmentData) {
    forOwn(data.testStepStatus, (stepResult, step) => {
        if (stepResult.isStepScanned === false) {
            scanStep(step);
            return false;
        }
    });
}
