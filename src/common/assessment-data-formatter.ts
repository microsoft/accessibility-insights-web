// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export class AssessmentDataFormatter {

    public formatAssessmentData = (assessmentData: {}): string => {
        const assessmentReportData = JSON.stringify(assessmentData);
        // add versioning for backwards compatibility
        return assessmentReportData;
    };
}
