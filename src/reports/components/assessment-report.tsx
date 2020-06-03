// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ReportModel } from '../assessment-report-model';
import { AssessmentReportBody, AssessmentReportBodyDeps } from './assessment-report-body';
import { AssessmentReportFooter } from './assessment-report-footer';
import { HeaderSection } from './report-sections/header-section';

export type AssessmentReportDeps = AssessmentReportBodyDeps;

export interface AssessmentReportProps {
    deps: AssessmentReportDeps;
    data: ReportModel;
    description: string;
    extensionVersion: string;
    axeVersion: string;
    chromeVersion: string;
    featureFlagStoreData: FeatureFlagStoreData;
}

export class AssessmentReport extends React.Component<AssessmentReportProps> {
    public render(): JSX.Element {
        const targetAppInfo = {
            name: this.props.data.scanDetails.targetPage,
            url: this.props.data.scanDetails.url,
        };

        return (
            <React.Fragment>
                <HeaderSection targetAppInfo={targetAppInfo} />
                <AssessmentReportBody
                    deps={this.props.deps}
                    data={this.props.data}
                    description={this.props.description}
                    featureFlagStoreData={this.props.featureFlagStoreData}
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
