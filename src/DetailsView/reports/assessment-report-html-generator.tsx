// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { AssessmentDefaultMessageGenerator } from '../../assessments/assessment-default-message-generator';
import { assessmentsProviderWithFeaturesEnabled } from '../../assessments/assessments-feature-flag-filter';
import { AssessmentsProvider } from '../../assessments/types/iassessments-provider';
import { ManualTestStatus } from '../../common/types/manual-test-status';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { IAssessmentStoreData } from '../../common/types/store-data/iassessment-result-data';
import { TabStoreData } from '../../common/types/store-data/tab-store-data';
import { AssessmentReportModelBuilderFactory } from './assessment-report-model-builder-factory';
import * as reportStyles from './assessment-report.styles';
import { AssessmentReport, AssessmentReportDeps } from './components/assessment-report';
import { OutcomeTypeSemantic } from './components/outcome-type';
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
        assessmentStoreData: IAssessmentStoreData,
        assessmentsProvider: AssessmentsProvider,
        featureFlagStoreData: FeatureFlagStoreData,
        tabStoreData: TabStoreData,
        description: string,
    ): string {
        const filteredProvider = assessmentsProviderWithFeaturesEnabled(assessmentsProvider, featureFlagStoreData);

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
                    <style dangerouslySetInnerHTML={{ __html: reportStyles.styleSheet }} />
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
