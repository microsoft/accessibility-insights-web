// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { forOwn } from 'lodash';
import { ITestsEnabledState } from '../common/types/store-data/ivisualization-store-data';

export function isAnAssessmentSelected(testData: ITestsEnabledState): boolean {
    let selected = false;
    forOwn(testData.assessments, (data, assessmentKey) => {
        if (data.enabled) {
            selected = true;
            return false;
        }
    });

    return selected;
}
