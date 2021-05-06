// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as styles from 'reports/components/assessment-summary-details.scss';
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
            <div role="table" className={styles.assessmentSummaryDetails}>
                <div role="rowgroup" className={styles.assessmentSummaryDetailsBody}>
                    {this.getTestDetailsList(this.props.testSummaries)}
                </div>
            </div>
        );
    }

    private getTestDetailsList(summaries: AssessmentSummaryReportModel[]): JSX.Element[] {
        return summaries.map(summary => (
            <div
                role="row"
                key={summary.displayName}
                className={styles.assessmentSummaryDetailsRow}
            >
                <div className={styles.testSummary}>
                    <div role="cell" className={styles.testSummaryDisplayName}>
                        {summary.displayName}
                    </div>
                    <div
                        role="cell"
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
            </div>
        ));
    }
}
