// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';

export class AssessmentDataParser {
    public parseAssessmentData = (assessmentData: string): VersionedAssessmentData => {
        const loadedAssessmentData = JSON.parse(assessmentData);
        return loadedAssessmentData;
    };
}
