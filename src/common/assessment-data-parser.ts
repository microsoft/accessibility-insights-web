// Copyright (c) Microsoft Corporation. All rights reserved.

import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';

// Licensed under the MIT License.
export class AssessmentDataParser {
    public parseAssessmentData = (assessmentData: string): VersionedAssessmentData => {
        const uploadedAssessmentData = JSON.parse(assessmentData);
        return uploadedAssessmentData;
    };
}
