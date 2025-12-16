// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import styles from 'reports/components/assessment-summary-details.scss';
import { AssessmentSummaryReportModel } from '../assessment-report-model';
import { OutcomeChipSet } from './outcome-chip-set';
import { OutcomeIconSet } from './outcome-icon-set';

export const testSummaryStatusAutomationId = (testDisplayName: string) =>
    `test-summary-status/${testDisplayName}`;

export interface AssessmentSummaryDetailsProps {
    testSummaries: AssessmentSummaryReportModel[];
}

export class AssessmentSummaryDetails extends React.Component<AssessmentSummaryDetailsProps> {
    public render(): JSX.Element {
        return (
            <ul className={styles.assessmentSummaryDetails}>
                {this.getTestDetailsList(this.props.testSummaries)}
            </ul>
        );
    }

    private getTestDetailsList(summaries: AssessmentSummaryReportModel[]): JSX.Element[] {
        return summaries.map(summary => (
            <li key={summary.displayName} className={styles.assessmentSummaryDetailsRow}>
                <div className={styles.testSummary}>
                    <div className={styles.testSummaryDisplayName}>{summary.displayName}</div>
                    <div
                        className={styles.testSummaryStatus}
                        data-automation-id={testSummaryStatusAutomationId(summary.displayName)}
                    >
                        {summary.pass + summary.incomplete + summary.fail > 7 ? (
                            <OutcomeChipSet {...summary} />
                        ) : (
                            <OutcomeIconSet {...summary} />
                        )}
                    </div>
                </div>
            </li>
        ));
    }
}
