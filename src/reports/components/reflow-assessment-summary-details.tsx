// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { AssessmentSummaryReportModel } from '../assessment-report-model';
import { OutcomeChipSet } from './outcome-chip-set';
import { OutcomeIconSet } from './outcome-icon-set';

export interface ReflowAssessmentSummaryDetailsProps {
    testSummaries: AssessmentSummaryReportModel[];
}

export class ReflowAssessmentSummaryDetails extends React.Component<
    ReflowAssessmentSummaryDetailsProps
> {
    public render(): JSX.Element {
        return (
            <div role="table" className="reflow-assessment-summary-details">
                <div role="rowgroup" className="reflow-assessment-summary-details-body">
                    {this.getTestDetailsList(this.props.testSummaries)}
                </div>
            </div>
        );
    }

    private getTestDetailsList(summaries: AssessmentSummaryReportModel[]): JSX.Element[] {
        return summaries.map(testSummary => (
            <div
                role="row"
                key={testSummary.displayName}
                className="reflow-assessment-summary-details-row"
            >
                <div className="reflow-test-summary">
                    <div role="cell" className="reflow-test-summary-display-name">
                        {testSummary.displayName}
                    </div>
                    <div role="cell" className="reflow-test-summary-status">
                        {testSummary.pass + testSummary.incomplete + testSummary.fail > 7 ? (
                            <OutcomeChipSet {...testSummary} />
                        ) : (
                            <OutcomeIconSet {...testSummary} />
                        )}
                    </div>
                </div>
            </div>
        ));
    }
}
