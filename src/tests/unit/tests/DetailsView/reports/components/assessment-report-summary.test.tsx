// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AssessmentReportSummary,
    AssessmentReportSummaryProps,
} from '../../../../../../DetailsView/reports/components/assessment-report-summary';

describe('AssessmentReportSummary', () => {
    describe('render', () => {
        test('Correct composition', () => {
            const reportData: AssessmentReportSummaryProps = {
                summary: {
                    reportSummaryDetailsData: [],
                },
            } as AssessmentReportSummaryProps;

            const testObject = new AssessmentReportSummary(reportData);
            const actual = testObject.render();

            expect(actual).toMatchSnapshot();
        });
    });
});
