import { map } from 'lodash';
import * as React from 'react';
import { GetAssessmentSummaryModelFromProviderAndStatusData } from '../../reports/get-assessment-summary-model';
import { OutcomeStats, OutcomeType } from '../../reports/components/outcome-type';
import { ManualTestStatus, IManualTestStatus } from '../../../common/types/manual-test-status';
import { onBaseLeftNavItemClick, BaseLeftNavLink, onBaseLeftNavItemRender } from '../base-left-nav';
import { IAssessmentsProvider } from '../../../assessments/types/iassessments-provider';
import { OverviewLeftNavLink } from './overview-left-nav-link';
import { VisualizationType } from '../../../common/types/visualization-type';
import { TestViewLeftNavLink } from './test-view-left-nav-link';
import { IVisualizationConfiguration } from '../../../common/configs/visualization-configuration-factory';


export type LeftNavLinkBuilderDeps = OverviewLinkBuilderDeps & AssessmentLinkBuilderDeps & VisualizationConfigurationLinkBuilderDeps;

export type OverviewLinkBuilderDeps = {
    getAssessmentSummaryModelFromProviderAndStatusData: GetAssessmentSummaryModelFromProviderAndStatusData,
};

export type AssessmentLinkBuilderDeps = {
    getStatusForTest: (stats: OutcomeStats) => ManualTestStatus;
    outcomeTypeFromTestStatus: (testStatus: ManualTestStatus) => OutcomeType;
    outcomeStatsFromManualTestStatus: (testStepStatus: IManualTestStatus) => OutcomeStats;
};

export type VisualizationConfigurationLinkBuilderDeps = {
};

export class LeftNavLinkBuilder {
    public buildOverviewLink(
        deps: OverviewLinkBuilderDeps,
        onLinkClick: onBaseLeftNavItemClick,
        assessmentsProvider: IAssessmentsProvider,
        assessmentsData: IDictionaryStringTo<IManualTestStatus>,
        index: number,
    ): BaseLeftNavLink {
        const {
            getAssessmentSummaryModelFromProviderAndStatusData,
        } =  deps;

        const reportModel = getAssessmentSummaryModelFromProviderAndStatusData(assessmentsProvider, assessmentsData);
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
        assessmentsProvider: IAssessmentsProvider,
        assessmentsData: IDictionaryStringTo<IManualTestStatus>,
        startingIndex: number,
    ): BaseLeftNavLink[] {
        const {
            getStatusForTest,
            outcomeTypeFromTestStatus,
            outcomeStatsFromManualTestStatus,
        } =  deps;

        const assessments = assessmentsProvider.all();
        let index = startingIndex;

        const testLinks = map(assessments, assessment => {
            const stepStatus = assessmentsData[assessment.key];
            const stats = outcomeStatsFromManualTestStatus(stepStatus);
            const status = getStatusForTest(stats);
            const narratorTestStatus = outcomeTypeFromTestStatus(status);
            const name = assessment.title;

            const baselink = this.buildLink(
                name,
                VisualizationType[assessment.type],
                index,
                (l, ri) => <TestViewLeftNavLink link={l} renderIcon={ri} />,
                onLinkClick,
            );

            const assessmentLink = {
                ...baselink,
                status,
                title: `${index} ${name} ${narratorTestStatus}`,
            };

            index++;
            return assessmentLink;
        });

        return testLinks;
    }

    public buildVisualizationConfigurationLink(
        configuration: IVisualizationConfiguration,
        onLinkClick: onBaseLeftNavItemClick,
        type: VisualizationType,
        index: number,
    ): BaseLeftNavLink {
        const displayableData = configuration.displayableData;

        const link = this.buildLink(
            displayableData.title,
            VisualizationType[type],
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
