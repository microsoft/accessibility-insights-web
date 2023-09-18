// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { productName } from 'content/strings/application';
import * as React from 'react';
import { ReportModel } from '../assessment-report-model';
import { AssessmentReportBody, AssessmentReportBodyDeps } from './assessment-report-body';
import { AssessmentReportFooter } from './assessment-report-footer';
import { HeaderSection } from './report-sections/header-section';

export type AssessmentReportDeps = AssessmentReportBodyDeps;

export interface AssessmentReportProps {
    deps: AssessmentReportDeps;
    bodyHeader: JSX.Element;
    data: ReportModel;
    description: string;
    extensionVersion: string;
    axeVersion: string;
    chromeVersion: string;
}

export class AssessmentReport extends React.Component<AssessmentReportProps> {
    public render(): JSX.Element {
        const targetAppInfo = {
            name: this.props.data.scanDetails.targetPage,
            url: this.props.data.scanDetails.url,
        };

        return (
            <React.Fragment>
                <HeaderSection targetAppInfo={targetAppInfo} headerText={productName} />
                <AssessmentReportBody
                    deps={this.props.deps}
                    bodyHeader={this.props.bodyHeader}
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
