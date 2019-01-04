// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { chunk } from 'lodash/index';
import * as React from 'react';

import { IAssessmentSummaryReportModel } from '../assessment-report-model';
import { OutcomeIconSet } from './outcome-icon-set';
import { OutcomeChipSet } from './outcome-chip-set';

export interface IAssessmentSummaryDetailsProps {
    testSummaries: IAssessmentSummaryReportModel[];
}

export class AssessmentSummaryDetails extends React.Component<IAssessmentSummaryDetailsProps> {
    public render(): JSX.Element {
        return (
            <div className="assessment-summary-details">
                {this.getTestDetailsColumns()}
            </div>
        );
    }

    private getTestDetailsColumns(): JSX.Element[] {
        const summaryBatches = chunk(this.props.testSummaries, Math.ceil(this.props.testSummaries.length / 2));

        return summaryBatches.map((batch, index) => {
            return (
                <div className="assessment-summary-details-column" key={index}>
                    {this.getTestDetailsList(batch, index)}
                </div>
            );
        });
    }

    private getTestDetailsList(summaries: IAssessmentSummaryReportModel[], colIndex: number): JSX.Element[] {
        return summaries.map((testSummary, index) => {
            return (
                <div key={`${colIndex}-${index}`} className="test-summary">
                    <div className="test-summary-display-name">
                        {testSummary.displayName}
                    </div>
                    <div key={`${colIndex}-${index}-status`} className="test-summary-status">
                        {
                            testSummary.pass + testSummary.incomplete + testSummary.fail > 7
                                ? <OutcomeChipSet {...testSummary} />
                                : <OutcomeIconSet {...testSummary} />
                        }
                    </div>
                </div>
            );
        });
    }
}
