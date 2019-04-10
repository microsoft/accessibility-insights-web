// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { OverviewSummaryReportModel } from '../assessment-report-model';
import { AssessmentSummaryDetails } from './assessment-summary-details';
import { OutcomeSummaryBar } from './outcome-summary-bar';

export interface AssessmentReportSummaryProps {
    summary: OverviewSummaryReportModel;
}

export class AssessmentReportSummary extends React.Component<AssessmentReportSummaryProps> {
    public render(): JSX.Element {
        return (
            <div className="assessment-report-summary">
                <h2>Summary</h2>
                <OutcomeSummaryBar {...this.props.summary.byPercentage} units="percentage" />
                <h3 className="test-details-text">Test details</h3>
                {this.renderDetails()}
            </div>
        );
    }

    private renderDetails(): JSX.Element {
        return <AssessmentSummaryDetails testSummaries={this.props.summary.reportSummaryDetailsData} />;
    }
}
