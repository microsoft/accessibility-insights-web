// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { IAssessmentsProvider } from '../../../assessments/types/iassessments-provider';
import { NamedSFC } from '../../../common/react/named-sfc';
import { IAssessmentStoreData } from '../../../common/types/store-data/iassessment-result-data';
import { ITabStoreData } from '../../../common/types/store-data/itab-store-data';
import { HyperlinkDefinition } from '../../../views/content/content-page';
import { DetailsViewActionMessageCreator } from '../../actions/details-view-action-message-creator';
import { IOverviewSummaryReportModel } from '../../reports/assessment-report-model';
import { AssessmentReportSummary } from '../../reports/components/assessment-report-summary';
import { GetAssessmentSummaryModelFromProviderAndStoreData } from '../../reports/get-assessment-summary-model';
import { TargetChangeDialog } from '../target-change-dialog';
import { OverviewHeading } from './overview-heading';
import { HelpLinkDeps, OverviewHelpSection } from './overview-help-section';
import { FeatureFlagStoreData } from '../../../common/types/store-data/feature-flag-store-data';

const linkDataSource: HyperlinkDefinition[] = [
    {
        href: 'https://msit.microsoftstream.com/video/7fa02042-3b76-408d-b70b-334ffc269aab?channelId=66d47e66-d99c-488b-b9ea-98a153d2a4d4',
        text: 'Getting started',
    },
    {
        href: 'https://msit.microsoftstream.com/video/8f1183cb-434e-4d0c-8a31-7b277eb7a004',
        text: 'How to complete a test',
    },
    {
        href: 'https://stackoverflow.microsoft.com/questions/ask?tags=accessibility-insights',
        text: 'Ask a question',
    },
];

export type OverviewContainerDeps = {
    assessmentsProvider: IAssessmentsProvider;
    getAssessmentSummaryModelFromProviderAndStoreData: GetAssessmentSummaryModelFromProviderAndStoreData;
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    assessmentsProviderWithFeaturesEnabled: (assessmentProvider: IAssessmentsProvider, flags: FeatureFlagStoreData) => IAssessmentsProvider;
} & HelpLinkDeps;

export interface OverviewContainerProps {
    deps: OverviewContainerDeps;
    assessmentStoreData: IAssessmentStoreData;
    tabStoreData: ITabStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
}

export const OverviewContainer = NamedSFC<OverviewContainerProps>('OverviewContainer', props => {
    const { deps, assessmentStoreData, tabStoreData, featureFlagStoreData } = props;
    const { assessmentsProvider, getAssessmentSummaryModelFromProviderAndStoreData, assessmentsProviderWithFeaturesEnabled } = deps;
    const prevTarget = assessmentStoreData.persistedTabInfo;
    const currentTarget = {
        id: tabStoreData.id,
        url: tabStoreData.url,
        title: tabStoreData.title,
    };
    const filteredProvider = assessmentsProviderWithFeaturesEnabled(assessmentsProvider, featureFlagStoreData);

    const summaryData: IOverviewSummaryReportModel = getAssessmentSummaryModelFromProviderAndStoreData(
        filteredProvider,
        assessmentStoreData,
    );

    return (
        <div className="overview">
            <TargetChangeDialog
                prevTab={prevTarget}
                newTab={currentTarget}
                actionMessageCreator={props.deps.detailsViewActionMessageCreator}
            />
            <section className="overview-text-summary-section">
                <OverviewHeading />
                <AssessmentReportSummary summary={summaryData} />
            </section>
            <section className="overview-help-section">
                <OverviewHelpSection linkDataSource={linkDataSource} deps={deps} />
            </section>
        </div>
    );
});
