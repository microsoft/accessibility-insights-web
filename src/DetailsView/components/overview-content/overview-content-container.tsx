// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { NamedFC } from 'common/react/named-fc';
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { GetSelectedAssessmentSummaryModelFromProviderAndStoreData } from 'DetailsView/components/left-nav/get-selected-assessment-summary-model';
import { OverviewHeading } from 'DetailsView/components/overview-content/overview-heading';
import * as React from 'react';

import { OverviewSummaryReportModel } from 'reports/assessment-report-model';
import { AssessmentReportSummary } from 'reports/components/assessment-report-summary';

import { TargetChangeDialog, TargetChangeDialogDeps } from '../target-change-dialog';
import styles from './overview-content-container.scss';
import { OverviewHelpSection, OverviewHelpSectionDeps } from './overview-help-section';
import { OverviewHelpSectionAboutFactory } from 'DetailsView/components/overview-content/overview-help-section-about';
import { OverviewHeadingIntroFactory } from 'DetailsView/components/overview-content/overview-heading-intro';

export type OverviewContainerDeps = {
    getProvider: () => AssessmentsProvider;
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    assessmentsProviderWithFeaturesEnabled: (
        assessmentProvider: AssessmentsProvider,
        flags: FeatureFlagStoreData,
    ) => AssessmentsProvider;
    quickAssessRequirementKeys: string[];
    getGetAssessmentSummaryModelFromProviderAndStoreData: () => GetSelectedAssessmentSummaryModelFromProviderAndStoreData;
} & OverviewHelpSectionDeps &
    TargetChangeDialogDeps;

export interface OverviewContainerProps {
    deps: OverviewContainerDeps;
    assessmentStoreData: AssessmentStoreData;
    tabStoreData: TabStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    getOverviewHeadingIntro: OverviewHeadingIntroFactory;
    linkDataSource: HyperlinkDefinition[];
    getOverviewHelpSectionAbout: OverviewHelpSectionAboutFactory;
}

export const overviewContainerAutomationId = 'overviewContainerAutomationId';

export const OverviewContainer = NamedFC<OverviewContainerProps>('OverviewContainer', props => {
    const {
        deps,
        assessmentStoreData,
        tabStoreData,
        featureFlagStoreData,
        getOverviewHeadingIntro,
        linkDataSource,
        getOverviewHelpSectionAbout,
    } = props;
    const {
        getProvider,
        assessmentsProviderWithFeaturesEnabled,
        quickAssessRequirementKeys,
        getGetAssessmentSummaryModelFromProviderAndStoreData,
    } = deps;
    const prevTarget = assessmentStoreData.persistedTabInfo;
    const currentTarget = {
        id: tabStoreData.id,
        url: tabStoreData.url,
        title: tabStoreData.title,
    };
    const assessmentsProvider = getProvider();
    const filteredProvider = assessmentsProviderWithFeaturesEnabled(
        assessmentsProvider,
        featureFlagStoreData,
    );
    const getAssessmentSummaryModelFromProviderAndStoreData =
        getGetAssessmentSummaryModelFromProviderAndStoreData();
    const summaryData: OverviewSummaryReportModel =
        getAssessmentSummaryModelFromProviderAndStoreData(
            filteredProvider,
            assessmentStoreData,
            quickAssessRequirementKeys,
        );

    return (
        <div data-automation-id={overviewContainerAutomationId} className={styles.overview}>
            <TargetChangeDialog deps={deps} prevTab={prevTarget} newTab={currentTarget} />
            <section className={styles.overviewTextSummarySection}>
                <OverviewHeading getIntroComponent={getOverviewHeadingIntro} />
                <AssessmentReportSummary summary={summaryData} />
            </section>
            <section className={styles.overviewHelpSection}>
                <OverviewHelpSection
                    getAboutComponent={getOverviewHelpSectionAbout}
                    linkDataSource={linkDataSource}
                    deps={deps}
                />
            </section>
        </div>
    );
});
