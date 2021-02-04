// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDefaultMessageGenerator } from 'assessments/assessment-default-message-generator';
import { assessmentsProviderWithFeaturesEnabled } from 'assessments/assessments-feature-flag-filter';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TargetAppData } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';

import * as bundledStyles from '../DetailsView/bundled-details-view-styles';
import { AssessmentReportModelBuilderFactory } from './assessment-report-model-builder-factory';
import * as reportStyles from './assessment-report.styles';
import { AssessmentReport, AssessmentReportDeps } from './components/assessment-report';
import { ReactStaticRenderer } from './react-static-renderer';

export type AssessmentReportHtmlGeneratorDeps = AssessmentReportDeps;

export class AssessmentReportHtmlGenerator {
    constructor(
        private deps: AssessmentReportHtmlGeneratorDeps,
        private renderer: ReactStaticRenderer,
        private assessmentReportModelBuilderFactory: AssessmentReportModelBuilderFactory,
        private dateGetter: () => Date,
        private extensionVersion: string,
        private axeVersion: string,
        private chromeVersion: string,
        private assessmentDefaultMessageGenerator: AssessmentDefaultMessageGenerator,
    ) {}

    public generateHtml(
        assessmentStoreData: AssessmentStoreData,
        assessmentsProvider: AssessmentsProvider,
        featureFlagStoreData: FeatureFlagStoreData,
        targetAppInfo: TargetAppData,
        description: string,
    ): string {
        const filteredProvider = assessmentsProviderWithFeaturesEnabled(
            assessmentsProvider,
            featureFlagStoreData,
        );

        const modelBuilder = this.assessmentReportModelBuilderFactory.create(
            filteredProvider,
            assessmentStoreData,
            targetAppInfo,
            this.dateGetter(),
            this.assessmentDefaultMessageGenerator,
        );

        const model = modelBuilder.getReportModelData();

        // tslint:disable: react-no-dangerous-html
        const reportElement = (
            <React.Fragment>
                <head>
                    <meta charSet="UTF-8" />
                    <title>Assessment report</title>
                    <style dangerouslySetInnerHTML={{ __html: reportStyles.styleSheet }} />
                    <style dangerouslySetInnerHTML={{ __html: bundledStyles.styleSheet }} />
                </head>
                <body>
                    <AssessmentReport
                        deps={this.deps}
                        data={model}
                        description={description}
                        extensionVersion={this.extensionVersion}
                        axeVersion={this.axeVersion}
                        chromeVersion={this.chromeVersion}
                    />
                </body>
            </React.Fragment>
        );

        const reportBody = this.renderer.renderToStaticMarkup(reportElement);

        return `<html lang="en">${reportBody}</html>`;
    }
}
