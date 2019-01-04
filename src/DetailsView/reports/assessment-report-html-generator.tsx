// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { assessmentsProviderWithFeaturesEnabled } from '../../assessments/assessments-feature-flag-filter';
import { IAssessmentsProvider } from '../../assessments/types/iassessments-provider';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { IAssessmentStoreData } from '../../common/types/store-data/iassessment-result-data';
import { ITabStoreData } from '../../common/types/store-data/itab-store-data';
import { AssessmentReportModelBuilderFactory } from './assessment-report-model-builder-factory';
import * as reportStyles from './assessment-report.styles';
import { AssessmentReport } from './components/assessment-report';
import { ReactStaticRenderer } from './react-static-renderer';
import { AssessmentDefaultMessageGenerator } from '../../assessments/assessment-default-message-generator';



export class AssessmentReportHtmlGenerator {
    constructor(
        private renderer: ReactStaticRenderer,
        private assessmentReportModelBuilderFactory: AssessmentReportModelBuilderFactory,
        private dateGetter: () => Date,
        private extensionVersion: string,
        private axeVersion: string,
        private chromeVersion: string,
        private assessmentDefaultMessageGenerator: AssessmentDefaultMessageGenerator,
    ) {
    }

    public generateHtml(
        assessmentStoreData: IAssessmentStoreData,
        assessmentsProvider: IAssessmentsProvider,
        featureFlagStoreData: FeatureFlagStoreData,
        tabStoreData: ITabStoreData,
        description: string,
    ): string {
        const filteredProvider = assessmentsProviderWithFeaturesEnabled(
            assessmentsProvider,
            featureFlagStoreData,
        );

        const modelBuilder = this.assessmentReportModelBuilderFactory.create(
            filteredProvider,
            assessmentStoreData,
            tabStoreData,
            this.dateGetter(),
            this.assessmentDefaultMessageGenerator,
        );

        const model = modelBuilder.getReportModelData();

        const reportElement = (
            <React.Fragment>
                <head>
                    <title>Assessment report</title>
                    <style>{reportStyles.styleSheet}</style>
                </head>
                <body>
                    <AssessmentReport
                        data={model}
                        description={description}
                        extensionVersion={this.extensionVersion}
                        axeVersion={this.axeVersion}
                        chromeVersion={this.chromeVersion}
                    />
                </body>
            </React.Fragment>
        );

        const reportBody = this.renderer.renderToStaticMarkup(reportElement, 'html');

        return `<html lang="en">${reportBody}</html>`;
    }
}
