// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { AssessmentSummaryReportModel } from '../assessment-report-model';
import { OutcomeChipSet } from './outcome-chip-set';
import { OutcomeIconSet } from './outcome-icon-set';

export interface AssessmentSummaryDetailsProps {
    testSummaries: AssessmentSummaryReportModel[];
}

export class AssessmentSummaryDetails extends React.Component<AssessmentSummaryDetailsProps> {
    public render(): JSX.Element {
        return (
            <div role="table" className="assessment-summary-details">
                <div role="rowgroup" className="assessment-summary-details-body">
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
                className="assessment-summary-details-row"
            >
                <div className="test-summary">
                    <div role="cell" className="test-summary-display-name">
                        {testSummary.displayName}
                    </div>
                    <div role="cell" className="test-summary-status">
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
