// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ManualTestStatus } from 'common/types/manual-test-status';
import * as React from 'react';

import { AssessmentDetailsReportModel } from '../assessment-report-model';
import {
    AssessmentReportStepList,
    AssessmentReportStepListDeps,
} from './assessment-report-step-list';
import { OutcomeChip } from './outcome-chip';
import { allRequirementOutcomeTypes } from './requirement-outcome-type';

export type AssessmentReportAssessmentListDeps = AssessmentReportStepListDeps;

export interface AssessmentReportAssessmentListProps {
    deps: AssessmentReportAssessmentListDeps;
    status: ManualTestStatus;
    assessments: AssessmentDetailsReportModel[];
}

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
                    <AssessmentReportStepList
                        deps={this.props.deps}
                        status={this.props.status}
                        steps={assessment.steps}
                    />
                </div>
            );
        });
    }

    private renderAssessmentHeader(assessment: AssessmentDetailsReportModel): JSX.Element {
        return (
            <h3 className="assessment-header">
                {assessment.displayName}
                <OutcomeChip
                    count={assessment.steps.length}
                    outcomeType={allRequirementOutcomeTypes[this.props.status]}
                />
            </h3>
        );
    }
}
