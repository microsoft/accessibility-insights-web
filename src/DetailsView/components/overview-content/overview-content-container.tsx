// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { AssessmentsProvider } from '../../../assessments/types/iassessments-provider';
import { NamedSFC } from '../../../common/react/named-sfc';
import { FeatureFlagStoreData } from '../../../common/types/store-data/feature-flag-store-data';
import { IAssessmentStoreData } from '../../../common/types/store-data/iassessment-result-data';
import { ITabStoreData } from '../../../common/types/store-data/itab-store-data';
import { HyperlinkDefinition } from '../../../views/content/content-page';
import { DetailsViewActionMessageCreator } from '../../actions/details-view-action-message-creator';
import { OverviewSummaryReportModel } from '../../reports/assessment-report-model';
import { AssessmentReportSummary } from '../../reports/components/assessment-report-summary';
import { GetAssessmentSummaryModelFromProviderAndStoreData } from '../../reports/get-assessment-summary-model';
import { TargetChangeDialog, TargetChangeDialogDeps } from '../target-change-dialog';
import { OverviewHeading } from './overview-heading';
import { HelpLinkDeps, OverviewHelpSection } from './overview-help-section';

const linkDataSource: HyperlinkDefinition[] = [
    {
        href: 'https://go.microsoft.com/fwlink/?linkid=2082219',
        text: 'Getting started',
    },
    {
        href: 'https://go.microsoft.com/fwlink/?linkid=2082220',
        text: 'How to complete a test',
    },
    {
        href: 'https://go.microsoft.com/fwlink/?linkid=2077941',
        text: 'Ask a question',
    },
];

export type OverviewContainerDeps = {
    assessmentsProvider: AssessmentsProvider;
    getAssessmentSummaryModelFromProviderAndStoreData: GetAssessmentSummaryModelFromProviderAndStoreData;
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    assessmentsProviderWithFeaturesEnabled: (assessmentProvider: AssessmentsProvider, flags: FeatureFlagStoreData) => AssessmentsProvider;
} & HelpLinkDeps &
    TargetChangeDialogDeps;

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

    const summaryData: OverviewSummaryReportModel = getAssessmentSummaryModelFromProviderAndStoreData(
        filteredProvider,
        assessmentStoreData,
    );

    return (
        <div className="overview">
            <TargetChangeDialog
                deps={deps}
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
