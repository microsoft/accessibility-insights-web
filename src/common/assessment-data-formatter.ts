// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';

export class AssessmentDataFormatter {
    public formatAssessmentData = (assessmentData: AssessmentStoreData): string => {
        const versionedData = this.addVersionNumber(assessmentData);
        const assessmentReportData = this.stringify(versionedData);
        return assessmentReportData;
    };

    private addVersionNumber = (assessmentData: AssessmentStoreData): VersionedAssessmentData => {
        const versionedAssessmentData = {
            version: 1,
            assessmentData: assessmentData,
        };
        return versionedAssessmentData;
    };

    private stringify = (data: VersionedAssessmentData): string => {
        return JSON.stringify(data, function (key, value) {
            if (key === '_owner') {
                // Ignore inner _owner field of designPattern, which could have cycles
                return;
            }
            return value;
        });
    };
}
