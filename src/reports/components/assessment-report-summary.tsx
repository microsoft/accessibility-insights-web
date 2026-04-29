// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import styles from 'reports/components/assessment-report-summary.scss';
import { OverviewSummaryReportModel } from '../assessment-report-model';
import { AssessmentSummaryDetails } from './assessment-summary-details';
import { OutcomeIcon } from './outcome-icon';
import { OutcomeSummaryBar } from './outcome-summary-bar';
import { outcomeTypeSemantics } from './outcome-type';
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
                    textLabel={true}
                />
                <h3 className={styles.testDetailsText}>Test details</h3>
                <div className={styles.outcomeLegend}>
                    {allRequirementOutcomeTypes.map(outcomeType => (
                        <span key={outcomeType} className={styles.outcomeLegendItem}>
                            <span
                                className={`outcome-icon outcome-icon-${outcomeType}`}
                                aria-hidden="true"
                            >
                                <OutcomeIcon outcomeType={outcomeType} />
                            </span>
                            <span>{outcomeTypeSemantics[outcomeType].pastTense}</span>
                        </span>
                    ))}
                </div>
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
