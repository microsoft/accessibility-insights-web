// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { IAssessmentSummaryReportModel } from '../assessment-report-model';
import { OutcomeChipSet } from './outcome-chip-set';
import { OutcomeIconSet } from './outcome-icon-set';

export interface IAssessmentSummaryDetailsProps {
    testSummaries: IAssessmentSummaryReportModel[];
}

export class AssessmentSummaryDetails extends React.Component<IAssessmentSummaryDetailsProps> {
    public render(): JSX.Element {
        return (
            <div role="table" className="assessment-summary-details">
                <div role="rowgroup" className="assessment-summary-details-body">
                    {this.getTestDetailsColumns()}
                </div>
            </div>
        );
    }

    private getTestDetailsColumns(): JSX.Element[] {
        return this.getTestDetailsList(this.props.testSummaries, 1);
    }

    private getTestDetailsList(summaries: IAssessmentSummaryReportModel[], colIndex: number): JSX.Element[] {
        return summaries.map((testSummary, index) => {
            return (
                <div role="row" key={`${colIndex}-${index}`} className="test-summary">
                    <div role="cell" className="test-summary-display-name">
                        {testSummary.displayName}
                    </div>
                    <div role="cell" key={`${colIndex}-${index}-status`} className="test-summary-status">
                        {testSummary.pass + testSummary.incomplete + testSummary.fail > 7 ? (
                            <OutcomeChipSet {...testSummary} />
                        ) : (
                            <OutcomeIconSet {...testSummary} />
                        )}
                    </div>
                </div>
            );
        });
    }
}
