// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as styles from 'reports/components/assessment-report-summary.scss';
import { OverviewSummaryReportModel } from '../assessment-report-model';
import { AssessmentSummaryDetails } from './assessment-summary-details';
import { OutcomeSummaryBar } from './outcome-summary-bar';
import { allRequirementOutcomeTypes } from './requirement-outcome-type';

export interface AssessmentReportSummaryProps {
    summary: OverviewSummaryReportModel;
}

export class AssessmentReportSummary extends React.Component<AssessmentReportSummaryProps> {
    public render(): JSX.Element {
        return (
            <div className={styles.assessmentReportSummary}>
                <h2>Summary</h2>
                <OutcomeSummaryBar
                    outcomeStats={this.props.summary.byPercentage}
                    countSuffix="%"
                    allOutcomeTypes={allRequirementOutcomeTypes}
                />
                <h3 className={styles.testDetailsText}>Test details</h3>
                {this.renderDetails()}
            </div>
        );
    }

    private renderDetails(): JSX.Element {
        return (
            <AssessmentSummaryDetails testSummaries={this.props.summary.reportSummaryDetailsData} />
        );
    }
}
