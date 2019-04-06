// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { forOwn } from 'lodash';

import { TestsEnabledState } from '../common/types/store-data/visualization-store-data';

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
