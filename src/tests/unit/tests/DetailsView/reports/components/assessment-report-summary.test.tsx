// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import {
    AssessmentReportSummary,
    IAssessmentReportSummaryProps,
} from '../../../../../../DetailsView/reports/components/assessment-report-summary';
import { AssessmentSummaryDetails } from '../../../../../../DetailsView/reports/components/assessment-summary-details';
import { OutcomeSummaryBar } from '../../../../../../DetailsView/reports/components/outcome-summary-bar';

describe('AssessmentReportSummary', () => {
    describe('render', () => {
        test('Correct composition', () => {
            const reportData: IAssessmentReportSummaryProps = {
                summary: {
                    reportSummaryDetailsData: [],
                },
            } as IAssessmentReportSummaryProps;

            const expectedResult = (
                <div className="assessment-report-summary">
                    <h2>Summary</h2>
                    <OutcomeSummaryBar {...reportData.summary.byPercentage} units="percentage" />
                    <h3>Test details</h3>
                    {<AssessmentSummaryDetails testSummaries={reportData.summary.reportSummaryDetailsData} />}
                </div>
            );

            testRender(reportData, expectedResult);
        });
    });

    function testRender(props: IAssessmentReportSummaryProps, expected: JSX.Element): void {
        const testObject = new AssessmentReportSummary(props);
        const actual = testObject.render();

        expect(actual).toEqual(expected);
    }
});
