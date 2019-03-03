// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TestsEnabledState } from '../common/types/store-data/ivisualization-store-data';
import { forOwn } from 'lodash';

export function isAnAssessmentSelected(testData: TestsEnabledState): boolean {
    let selected = false;
    forOwn(testData.assessments, (data, assessmentKey) => {
        if (data.enabled) {
            selected = true;
            return false;
        }
    });

    return selected;
}
