// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { map } from 'lodash';
import * as React from 'react';

import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { OutcomeTypeSemantic } from 'reports/components/outcome-type';
import { RequirementOutcomeStats } from 'reports/components/requirement-outcome-type';
import { GetAssessmentSummaryModelFromProviderAndStatusData } from 'reports/get-assessment-summary-model';
import { VisualizationConfiguration } from '../../../common/configs/visualization-configuration';
import {
    ManualTestStatus,
    ManualTestStatusData,
} from '../../../common/types/manual-test-status';
import { VisualizationType } from '../../../common/types/visualization-type';
import { DictionaryStringTo } from '../../../types/common-types';
import {
    BaseLeftNavLink,
    onBaseLeftNavItemClick,
    onBaseLeftNavItemRender,
} from '../base-left-nav';
import { OverviewLeftNavLink } from './overview-left-nav-link';
import { TestViewLeftNavLink } from './test-view-left-nav-link';

export type LeftNavLinkBuilderDeps = OverviewLinkBuilderDeps &
    AssessmentLinkBuilderDeps &
    VisualizationConfigurationLinkBuilderDeps;

export type OverviewLinkBuilderDeps = {
    getAssessmentSummaryModelFromProviderAndStatusData: GetAssessmentSummaryModelFromProviderAndStatusData;
};

export type AssessmentLinkBuilderDeps = {
    getStatusForTest: (stats: RequirementOutcomeStats) => ManualTestStatus;
    outcomeTypeSemanticsFromTestStatus: (
        testStatus: ManualTestStatus,
    ) => OutcomeTypeSemantic;
    outcomeStatsFromManualTestStatus: (
        testStepStatus: ManualTestStatusData,
    ) => RequirementOutcomeStats;
};

export type VisualizationConfigurationLinkBuilderDeps = {};

export class LeftNavLinkBuilder {
    public buildOverviewLink(
        deps: OverviewLinkBuilderDeps,
        onLinkClick: onBaseLeftNavItemClick,
        assessmentsProvider: AssessmentsProvider,
        assessmentsData: DictionaryStringTo<ManualTestStatusData>,
        index: number,
    ): BaseLeftNavLink {
        const { getAssessmentSummaryModelFromProviderAndStatusData } = deps;

        const reportModel = getAssessmentSummaryModelFromProviderAndStatusData(
            assessmentsProvider,
            assessmentsData,
        );
        const percentComplete = 100 - reportModel.byPercentage.incomplete;

        const baselink = this.buildLink(
            'Overview',
            'Overview',
            index,
            (l, ri) => <OverviewLeftNavLink link={l} renderIcon={ri} />,
            onLinkClick,
        );

        const overviewLink = {
            ...baselink,
            title: `Overview ${percentComplete}% Completed`,
            percentComplete,
        };

        return overviewLink;
    }

    public buildAssessmentTestLinks(
        deps: AssessmentLinkBuilderDeps,
        onLinkClick: onBaseLeftNavItemClick,
        assessmentsProvider: AssessmentsProvider,
        assessmentsData: DictionaryStringTo<ManualTestStatusData>,
        startingIndex: number,
    ): BaseLeftNavLink[] {
        const {
            getStatusForTest,
            outcomeTypeSemanticsFromTestStatus,
            outcomeStatsFromManualTestStatus,
        } = deps;

        const assessments = assessmentsProvider.all();
        let index = startingIndex;

        const testLinks = map(assessments, assessment => {
            const stepStatus = assessmentsData[assessment.key];
            const stats = outcomeStatsFromManualTestStatus(stepStatus);
            const status = getStatusForTest(stats);
            const narratorTestStatus = outcomeTypeSemanticsFromTestStatus(
                status,
            ).pastTense;
            const name = assessment.title;

            const baselink = this.buildLink(
                name,
                VisualizationType[assessment.visualizationType],
                index,
                (l, ri) => <TestViewLeftNavLink link={l} renderIcon={ri} />,
                onLinkClick,
            );

            const assessmentLink = {
                ...baselink,
                status,
                title: `${index}: ${name} (${narratorTestStatus})`,
            };

            index++;
            return assessmentLink;
        });

        return testLinks;
    }

    public buildVisualizationConfigurationLink(
        configuration: VisualizationConfiguration,
        onLinkClick: onBaseLeftNavItemClick,
        visualizationType: VisualizationType,
        index: number,
    ): BaseLeftNavLink {
        const displayableData = configuration.displayableData;

        const link = this.buildLink(
            displayableData.title,
            VisualizationType[visualizationType],
            index,
            (l, ri) => <TestViewLeftNavLink link={l} renderIcon={ri} />,
            onLinkClick,
        );

        return link;
    }

    private buildLink(
        name: string,
        key: string,
        index: number,
        onRenderNavLink: onBaseLeftNavItemRender,
        onClickNavLink: onBaseLeftNavItemClick,
    ): BaseLeftNavLink {
        return {
            name: name,
            key: key,
            forceAnchor: true,
            url: '',
            index,
            onRenderNavLink: onRenderNavLink,
            iconProps: {
                className: 'hidden',
            },
            onClickNavLink: onClickNavLink,
        };
    }
}
