// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { ManualTestStatus } from '../../../common/types/manual-test-status';
import { IAssessmentDetailsReportModel } from '../assessment-report-model';
import { AssessmentReportStepList } from './assessment-report-step-list';
import { OutcomeChip } from './outcome-chip';
import { allOutcomeTypes } from './outcome-type';

export interface AssessmentReportAssessmentProps {
    status: ManualTestStatus;
    assessments: IAssessmentDetailsReportModel[];
}

export interface IconWithCountProps {
    status: ManualTestStatus;
    count: number;
}

export class AssessmentReportAssessmentList extends React.Component<AssessmentReportAssessmentProps> {
    public render(): JSX.Element {
        return <div>{this.renderAssessments()}</div>;
    }

    private renderAssessments(): JSX.Element[] {
        return this.props.assessments.map((assessment, index) => {
            return (
                <div className="assessment-details" key={assessment.key}>
                    {this.renderAssessmentHeader(assessment)}
                    <AssessmentReportStepList status={this.props.status} steps={assessment.steps} />
                </div>
            );
        });
    }

    private renderAssessmentHeader(assessment: IAssessmentDetailsReportModel): JSX.Element {
        return (
            <div className="assessment-header">
                <h3 className="assessment-header-name">{assessment.displayName}</h3>

                <OutcomeChip count={assessment.steps.length} outcomeType={allOutcomeTypes[this.props.status]} />
            </div>
        );
    }
}
