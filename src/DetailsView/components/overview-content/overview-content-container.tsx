// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { AssessmentsProvider } from '../../../assessments/types/assessments-provider';
import { NamedSFC } from '../../../common/react/named-sfc';
import { AssessmentStoreData } from '../../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../../common/types/store-data/feature-flag-store-data';
import { TabStoreData } from '../../../common/types/store-data/tab-store-data';
import { HyperlinkDefinition } from '../../../views/content/content-page';
import { DetailsViewActionMessageCreator } from '../../actions/details-view-action-message-creator';
import { OverviewSummaryReportModel } from '../../reports/assessment-report-model';
import { BaseCardLayer } from '../../reports/components/base-card-layer';
import { GetAssessmentSummaryModelFromProviderAndStoreData } from '../../reports/get-assessment-summary-model';
import { TargetChangeDialog, TargetChangeDialogDeps } from '../target-change-dialog';
import { OverviewHeading } from './overview-heading';
import { OverviewHelpSectionDeps } from './overview-help-section';
import { AutomatedChecksIssueDetailsList } from '../../reports/components/automated-check-issue-details-list';
import { DecoratedAxeNodeResult } from '../../../injected/scanner-utils';

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


const sampleData = [{
    failureSummary: 'RR-failureSummary',
    guidanceLinks: [{ text: 'WCAG-1.4.1' }, { text: 'wcag-2.8.2' }],
    help: 'RR-help',
    html: 'RR-html',
    ruleId: 'RR-rule-id',
    helpUrl: 'RR-help-url',
    selector: 'RR-selector<x>',
    snippet: 'RR-snippet   space',
}] as DecoratedAxeNodeResult[];

export type OverviewContainerDeps = {
    assessmentsProvider: AssessmentsProvider;
    getAssessmentSummaryModelFromProviderAndStoreData: GetAssessmentSummaryModelFromProviderAndStoreData;
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    assessmentsProviderWithFeaturesEnabled: (assessmentProvider: AssessmentsProvider, flags: FeatureFlagStoreData) => AssessmentsProvider;
} & OverviewHelpSectionDeps &
    TargetChangeDialogDeps;

export interface OverviewContainerProps {
    deps: OverviewContainerDeps;
    assessmentStoreData: AssessmentStoreData;
    tabStoreData: TabStoreData;
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
                <AutomatedChecksIssueDetailsList nodeResults={sampleData} />
                {/* <AssessmentReportSummary summary={summaryData} /> */}
            </section>
            {/* <section className="overview-help-section">
                <OverviewHelpSection linkDataSource={linkDataSource} deps={deps} />
            </section> */}
        </div>
    );
});
