// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import * as React from 'react';
import { OverviewSummaryReportModel } from 'reports/assessment-report-model';
import { AssessmentReportSummary } from 'reports/components/assessment-report-summary';
import { GetAssessmentSummaryModelFromProviderAndStoreData } from 'reports/get-assessment-summary-model';
import { HyperlinkDefinition } from 'views/content/content-page';

import { NamedSFC } from '../../../common/react/named-sfc';
import { AssessmentStoreData } from '../../../common/types/store-data/assessment-result-data';
import { TabStoreData } from '../../../common/types/store-data/tab-store-data';
import { DetailsViewActionMessageCreator } from '../../actions/details-view-action-message-creator';
import { TargetChangeDialog, TargetChangeDialogDeps } from '../target-change-dialog';
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
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
} & OverviewHelpSectionDeps &
    TargetChangeDialogDeps;

export interface OverviewContainerProps {
    deps: OverviewContainerDeps;
    assessmentStoreData: AssessmentStoreData;
    tabStoreData: TabStoreData;
}

export const OverviewContainer = NamedSFC<OverviewContainerProps>('OverviewContainer', props => {
    const { deps, assessmentStoreData, tabStoreData } = props;
    const { assessmentsProvider, getAssessmentSummaryModelFromProviderAndStoreData } = deps;
    const prevTarget = assessmentStoreData.persistedTabInfo;
    const currentTarget = {
        id: tabStoreData.id,
        url: tabStoreData.url,
        title: tabStoreData.title,
    };

    const summaryData: OverviewSummaryReportModel = getAssessmentSummaryModelFromProviderAndStoreData(
        assessmentsProvider,
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
