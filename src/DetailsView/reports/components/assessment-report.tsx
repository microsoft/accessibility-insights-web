// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { IReportModel } from '../assessment-report-model';
import { AssessmentReportBody, AssessmentReportBodyDeps } from './assessment-report-body';
import { AssessmentReportFooter } from './assessment-report-footer';
import { AssessmentReportHeader } from './assessment-report-header';

export type AssessmentReportDeps = AssessmentReportBodyDeps;

export interface AssessmentReportProps {
    deps: AssessmentReportDeps;
    data: IReportModel;
    description: string;
    extensionVersion: string;
    axeVersion: string;
    chromeVersion: string;
}

export class AssessmentReport extends React.Component<AssessmentReportProps> {
    public render(): JSX.Element {
        return (
            <React.Fragment>
                <AssessmentReportHeader
                    targetPageTitle={this.props.data.scanDetails.targetPage}
                    targetPageUrl={this.props.data.scanDetails.url}
                />
                <AssessmentReportBody
                    deps={this.props.deps}
                    data={this.props.data}
                    description={this.props.description}
                />

                <AssessmentReportFooter
                    extensionVersion={this.props.extensionVersion}
                    axeVersion={this.props.axeVersion}
                    chromeVersion={this.props.chromeVersion}
                />
            </React.Fragment>
        );
    }
}
