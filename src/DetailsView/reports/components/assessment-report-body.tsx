// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { ManualTestStatus } from '../../../common/types/manual-test-status';
import { IAssessmentDetailsReportModel, IReportModel } from '../assessment-report-model';
import { AssessmentReportAssessmentList } from './assessment-report-assessment-list';
import { AssessmentReportBodyHeader } from './assessment-report-body-header';
import { AssessmentReportSummary } from './assessment-report-summary';
import { AssessmentScanDetails } from './assessment-scan-details';
import { OutcomeChip } from './outcome-chip';
import { allOutcomeTypes } from './outcome-type';

export interface IAssessmentReportBodyProps {
    data: IReportModel;
    description: string;
}

export class AssessmentReportBody extends React.Component<IAssessmentReportBodyProps> {

    public render(): JSX.Element {
        return (
            <div className="assessment-report-body" role="main">
                <AssessmentReportBodyHeader />
                <AssessmentReportSummary
                    summary={this.props.data.summary}
                />
                <AssessmentScanDetails
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
        detailsData: IAssessmentDetailsReportModel[],
        title: string,
        count: number,
        status: ManualTestStatus,
    ): JSX.Element {
        return (
            <div className="details-section">
                {this.renderDetailsSectionHeader(title, count, status)}
                <AssessmentReportAssessmentList
                    status={status}
                    assessments={detailsData}
                />
            </div>);
    }
    private renderDetailsSectionHeader(title: string, count: number, status: ManualTestStatus): JSX.Element {
        return (
            <div className="details-section-header">
                <h2 className="details-section-header-title">
                    {title}
                </h2>

                <OutcomeChip
                    count={count}
                    outcomeType={allOutcomeTypes[status]}
                />
            </div>
        );
    }
}
