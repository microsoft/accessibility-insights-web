// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { NamedFC } from 'common/react/named-fc';
import { HyperlinkDefinition } from 'common/types/hyperlink-definition';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import * as React from 'react';

import { OverviewSummaryReportModel } from 'reports/assessment-report-model';
import { AssessmentReportSummary } from 'reports/components/assessment-report-summary';
import { GetAssessmentSummaryModelFromProviderAndStoreData } from 'reports/get-assessment-summary-model';
import { GetQuickAssessSummaryModelFromProviderAndStoreData } from 'reports/get-quick-assess-summary-model';

import { TargetChangeDialog, TargetChangeDialogDeps } from '../target-change-dialog';
import styles from './overview-content-container.scss';
import { OverviewHeading } from './overview-heading';
import { OverviewHelpSection, OverviewHelpSectionDeps } from './overview-help-section';

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
    {
        href: 'https://www.w3.org/WAI/standards-guidelines/wcag/new-in-21/',
        text: 'New WCAG 2.1 success criteria',
    },
];

export type OverviewContainerDeps = {
    assessmentsProvider: AssessmentsProvider;
    getAssessmentSummaryModelFromProviderAndStoreData: GetAssessmentSummaryModelFromProviderAndStoreData;
    getQuickAssessSummaryModelFromProviderAndStoreData: GetQuickAssessSummaryModelFromProviderAndStoreData;
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    assessmentsProviderWithFeaturesEnabled: (
        assessmentProvider: AssessmentsProvider,
        flags: FeatureFlagStoreData,
    ) => AssessmentsProvider;
    assessmentsProviderForRequirements: (
        assessmentsProvider: AssessmentsProvider,
        requirementKeys: string[],
    ) => AssessmentsProvider;
    quickAssessRequirementKeys: string[];
} & OverviewHelpSectionDeps &
    TargetChangeDialogDeps;

export interface OverviewContainerProps {
    deps: OverviewContainerDeps;
    assessmentStoreData: AssessmentStoreData;
    tabStoreData: TabStoreData;
    featureFlagStoreData: FeatureFlagStoreData;
    selectedPivot: DetailsViewPivotType;
}

export const overviewContainerAutomationId = 'overviewContainerAutomationId';

export const OverviewContainer = NamedFC<OverviewContainerProps>('OverviewContainer', props => {
    const { deps, assessmentStoreData, tabStoreData, featureFlagStoreData, selectedPivot } = props;
    const {
        assessmentsProvider,
        getAssessmentSummaryModelFromProviderAndStoreData,
        getQuickAssessSummaryModelFromProviderAndStoreData,
        assessmentsProviderWithFeaturesEnabled,
        assessmentsProviderForRequirements,
        quickAssessRequirementKeys,
    } = deps;
    const prevTarget = assessmentStoreData.persistedTabInfo;
    const currentTarget = {
        id: tabStoreData.id,
        url: tabStoreData.url,
        title: tabStoreData.title,
    };
    let filteredProvider = assessmentsProviderWithFeaturesEnabled(
        assessmentsProvider,
        featureFlagStoreData,
    );
    let summaryData: OverviewSummaryReportModel;

    if (selectedPivot === DetailsViewPivotType.assessment) {
        summaryData = getAssessmentSummaryModelFromProviderAndStoreData(
            filteredProvider,
            assessmentStoreData,
        );
    } else {
        filteredProvider = assessmentsProviderForRequirements(
            filteredProvider,
            quickAssessRequirementKeys,
        );
        summaryData = getQuickAssessSummaryModelFromProviderAndStoreData(
            filteredProvider,
            assessmentStoreData,
            quickAssessRequirementKeys,
        );
    }

    return (
        <div data-automation-id={overviewContainerAutomationId} className={styles.overview}>
            <TargetChangeDialog deps={deps} prevTab={prevTarget} newTab={currentTarget} />
            <section className={styles.overviewTextSummarySection}>
                <OverviewHeading />
                <AssessmentReportSummary summary={summaryData} selectedPivot={selectedPivot} />
            </section>
            <section className={styles.overviewHelpSection}>
                <OverviewHelpSection linkDataSource={linkDataSource} deps={deps} />
            </section>
        </div>
    );
});
