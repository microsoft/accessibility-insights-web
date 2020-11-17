// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export class AssessmentDataFormatter {
    public formatAssessmentData = (assessmentData: {}): string => {
        const versionedData = this.addVersionNumber(assessmentData)
        const assessmentReportData = JSON.stringify(versionedData);
        return assessmentReportData;
    };

    private addVersionNumber = (assessmentData: {}): {} => {
        const versionedAssessmentData = {
            version: 1,
            assessmentData: assessmentData}
        return versionedAssessmentData
    }
}
