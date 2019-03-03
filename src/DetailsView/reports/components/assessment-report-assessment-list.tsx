// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { ManualTestStatus } from '../../../common/types/manual-test-status';
import { IAssessmentDetailsReportModel } from '../assessment-report-model';
import { AssessmentReportStepList, AssessmentReportStepListDeps } from './assessment-report-step-list';
import { OutcomeChip } from './outcome-chip';
import { allOutcomeTypes } from './outcome-type';

export type AssessmentReportAssessmentListDeps = AssessmentReportStepListDeps;

export interface AssessmentReportAssessmentListProps {
    deps: AssessmentReportAssessmentListDeps;
    status: ManualTestStatus;
    assessments: IAssessmentDetailsReportModel[];
}

// tslint:disable-next-line:interface-name
export interface IconWithCountProps {
    status: ManualTestStatus;
    count: number;
}

export class AssessmentReportAssessmentList extends React.Component<AssessmentReportAssessmentListProps> {
    public render(): JSX.Element {
        return <div>{this.renderAssessments()}</div>;
    }

    private renderAssessments(): JSX.Element[] {
        return this.props.assessments.map((assessment, index) => {
            return (
                <div className="assessment-details" key={assessment.key}>
                    {this.renderAssessmentHeader(assessment)}
                    <AssessmentReportStepList deps={this.props.deps} status={this.props.status} steps={assessment.steps} />
                </div>
            );
        });
    }

    private renderAssessmentHeader(assessment: IAssessmentDetailsReportModel): JSX.Element {
        return (
            <h3 className="assessment-header">
                {assessment.displayName}
                <OutcomeChip count={assessment.steps.length} outcomeType={allOutcomeTypes[this.props.status]} />
            </h3>
        );
    }
}
