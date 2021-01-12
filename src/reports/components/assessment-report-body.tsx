// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ManualTestStatus } from 'common/types/manual-test-status';
import * as React from 'react';

import { AssessmentDetailsReportModel, ReportModel } from '../assessment-report-model';
import {
    AssessmentReportAssessmentList,
    AssessmentReportAssessmentListDeps,
} from './assessment-report-assessment-list';
import { AssessmentReportBodyHeader } from './assessment-report-body-header';
import { AssessmentReportSummary } from './assessment-report-summary';
import { AssessmentScanDetails, AssessmentScanDetailsDeps } from './assessment-scan-details';
import { OutcomeChip } from './outcome-chip';
import { allRequirementOutcomeTypes } from './requirement-outcome-type';

export type AssessmentReportBodyDeps = AssessmentReportAssessmentListDeps &
    AssessmentScanDetailsDeps;

export interface AssessmentReportBodyProps {
    deps: AssessmentReportBodyDeps;
    data: ReportModel;
    description: string;
}

export class AssessmentReportBody extends React.Component<AssessmentReportBodyProps> {
    public render(): JSX.Element {
        return (
            <div className="assessment-report-body" role="main">
                <AssessmentReportBodyHeader />
                <AssessmentReportSummary summary={this.props.data.summary} />
                <AssessmentScanDetails
                    deps={this.props.deps}
                    details={this.props.data.scanDetails}
                    description={this.props.description}
                />

                {this.renderDetailsSection(
                    this.props.data.failedDetailsData,
                    'Failed tests',
                    this.props.data.summary.byRequirement.fail,
                    ManualTestStatus.FAIL,
                )}

                {this.renderDetailsSection(
                    this.props.data.incompleteDetailsData,
                    'Incomplete tests',
                    this.props.data.summary.byRequirement.incomplete,
                    ManualTestStatus.UNKNOWN,
                )}

                {this.renderDetailsSection(
                    this.props.data.passedDetailsData,
                    'Passed tests',
                    this.props.data.summary.byRequirement.pass,
                    ManualTestStatus.PASS,
                )}
            </div>
        );
    }

    private renderDetailsSection(
        detailsData: AssessmentDetailsReportModel[],
        title: string,
        count: number,
        status: ManualTestStatus,
    ): JSX.Element {
        return (
            <div className="details-section">
                {this.renderDetailsSectionHeader(title, count, status)}
                <AssessmentReportAssessmentList
                    deps={this.props.deps}
                    status={status}
                    assessments={detailsData}
                />
            </div>
        );
    }
    private renderDetailsSectionHeader(
        title: string,
        count: number,
        status: ManualTestStatus,
    ): JSX.Element {
        return (
            <h2 className="details-section-header">
                {title}
                <OutcomeChip count={count} outcomeType={allRequirementOutcomeTypes[status]} />
            </h2>
        );
    }
}
