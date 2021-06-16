// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { Requirement } from 'assessments/types/requirement';
import { gettingStartedSubview } from 'common/types/store-data/assessment-result-data';
import {
    onTestGettingStartedClick,
    onTestRequirementClick,
    ReflowAssessmentLeftNavLink,
    TestGettingStartedNavLink,
    TestRequirementLeftNavLink,
} from 'DetailsView/components/left-nav/assessment-left-nav';
import { NavLinkHandler } from 'DetailsView/components/left-nav/nav-link-handler';
import { NavLinkRenderer } from 'DetailsView/components/left-nav/nav-link-renderer';
import { map } from 'lodash';
import { OutcomeTypeSemantic } from 'reports/components/outcome-type';
import { RequirementOutcomeStats } from 'reports/components/requirement-outcome-type';
import { GetAssessmentSummaryModelFromProviderAndStatusData } from 'reports/get-assessment-summary-model';
import { VisualizationConfiguration } from '../../../common/configs/visualization-configuration';
import { ManualTestStatus, ManualTestStatusData } from '../../../common/types/manual-test-status';
import { VisualizationType } from '../../../common/types/visualization-type';
import { DictionaryStringTo } from '../../../types/common-types';
import { BaseLeftNavLink, onBaseLeftNavItemClick, onBaseLeftNavItemRender } from '../base-left-nav';

export type LeftNavLinkBuilderDeps = OverviewLinkBuilderDeps &
    AssessmentLinkBuilderDeps &
    VisualizationConfigurationLinkBuilderDeps;

export type OverviewLinkBuilderDeps = {
    getAssessmentSummaryModelFromProviderAndStatusData: GetAssessmentSummaryModelFromProviderAndStatusData;
    navLinkRenderer: NavLinkRenderer;
};

export type AssessmentLinkBuilderDeps = {
    navLinkHandler: NavLinkHandler;
    getStatusForTest: (stats: RequirementOutcomeStats) => ManualTestStatus;
    outcomeTypeSemanticsFromTestStatus: (testStatus: ManualTestStatus) => OutcomeTypeSemantic;
    outcomeStatsFromManualTestStatus: (
        testStepStatus: ManualTestStatusData,
    ) => RequirementOutcomeStats;
    navLinkRenderer: NavLinkRenderer;
};

export type VisualizationConfigurationLinkBuilderDeps = {
    navLinkRenderer: NavLinkRenderer;
};

export function generateReflowAssessmentTestKey(
    test: VisualizationType,
    selectedSubview: string,
): string {
    return `${VisualizationType[test]}: ${selectedSubview}`;
}

export type reflowAssessmentTestKeyGenerator = typeof generateReflowAssessmentTestKey;

export class LeftNavLinkBuilder {
    public buildOverviewLink(
        deps: OverviewLinkBuilderDeps,
        onLinkClick: onBaseLeftNavItemClick,
        assessmentsProvider: AssessmentsProvider,
        assessmentsData: DictionaryStringTo<ManualTestStatusData>,
        index: number,
        onRightPanelContentSwitch: () => void,
    ): BaseLeftNavLink {
        const { getAssessmentSummaryModelFromProviderAndStatusData, navLinkRenderer } = deps;

        const reportModel = getAssessmentSummaryModelFromProviderAndStatusData(
            assessmentsProvider,
            assessmentsData,
        );
        const percentComplete = 100 - reportModel.byPercentage.incomplete;

        const baselink = this.buildBaseLink(
            'Overview',
            'Overview',
            index,
            navLinkRenderer.renderOverviewLink,
            this.getRightPanelContentSwitchLinkClickHandler(onLinkClick, onRightPanelContentSwitch),
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
            navLinkRenderer,
        } = deps;

        const assessments = assessmentsProvider.all();
        let index = startingIndex;

        const testLinks = map(assessments, assessment => {
            const stepStatus = assessmentsData[assessment.key];
            const stats = outcomeStatsFromManualTestStatus(stepStatus);
            const status = getStatusForTest(stats);
            const narratorTestStatus = outcomeTypeSemanticsFromTestStatus(status).pastTense;
            const name = assessment.title;

            const baselink = this.buildBaseLink(
                name,
                VisualizationType[assessment.visualizationType],
                index,
                navLinkRenderer.renderAssessmentTestLink,
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

    public buildReflowAssessmentTestLinks(
        deps: AssessmentLinkBuilderDeps,
        assessmentsProvider: AssessmentsProvider,
        assessmentsData: DictionaryStringTo<ManualTestStatusData>,
        startingIndex: number,
        expandedTest: VisualizationType | undefined,
        onRightPanelContentSwitch: () => void,
    ): BaseLeftNavLink[] {
        const assessments = assessmentsProvider.all();
        let index = startingIndex;

        const allTestLinks = map(assessments, assessment => {
            const isExpanded = assessment.visualizationType === expandedTest;
            const test = this.buildAssessmentLink(
                deps,
                assessment,
                index,
                assessmentsData,
                isExpanded,
                onRightPanelContentSwitch,
            );
            index++;
            return test;
        });

        return allTestLinks;
    }

    private buildAssessmentLink = (
        deps: AssessmentLinkBuilderDeps,
        assessment: Assessment,
        index: number,
        assessmentsData: DictionaryStringTo<ManualTestStatusData>,
        isExpanded: boolean,
        onRightPanelContentSwitch: () => void,
    ): ReflowAssessmentLeftNavLink => {
        const {
            getStatusForTest,
            outcomeTypeSemanticsFromTestStatus,
            outcomeStatsFromManualTestStatus,
            navLinkHandler,
            navLinkRenderer,
        } = deps;

        const stepStatus = assessmentsData[assessment.key];
        const stats = outcomeStatsFromManualTestStatus(stepStatus);
        const status = getStatusForTest(stats);
        const narratorTestStatus = outcomeTypeSemanticsFromTestStatus(status).pastTense;
        const name = assessment.title;

        const baselink = this.buildBaseLink(
            name,
            VisualizationType[assessment.visualizationType],
            index,
            navLinkRenderer.renderAssessmentTestLink,
            navLinkHandler.onTestHeadingClick,
        );

        const gettingStartedLink = this.buildGettingStartedLink(
            navLinkRenderer.renderGettingStartedLink,
            this.getRightPanelContentSwitchLinkClickHandler(
                navLinkHandler.onGettingStartedClick,
                onRightPanelContentSwitch,
            ),
            assessment,
        );

        const requirementLinks = assessment.requirements.map(
            (requirement: Requirement, requirementIndex: number) =>
                this.buildRequirementLink(
                    deps,
                    assessment.visualizationType,
                    requirement,
                    stepStatus[requirement.key]?.stepFinalResult,
                    requirementIndex + 1,
                    index,
                    this.getRightPanelContentSwitchLinkClickHandler(
                        navLinkHandler.onRequirementClick,
                        onRightPanelContentSwitch,
                    ),
                ),
        );

        const testLink = {
            ...baselink,
            status,
            title: `${index}: ${name} (${narratorTestStatus})`,
            links: [gettingStartedLink, ...requirementLinks],
            isExpanded: isExpanded,
            testType: assessment.visualizationType,
            forceAnchor: false,
        };

        return testLink;
    };

    private buildRequirementLink(
        deps: AssessmentLinkBuilderDeps,
        test: VisualizationType,
        requirement: Requirement,
        requirementStatus: ManualTestStatus,
        requirementIndex: number,
        testIndex: number,
        onClick: onTestRequirementClick,
    ): TestRequirementLeftNavLink {
        const { outcomeTypeSemanticsFromTestStatus, navLinkRenderer } = deps;
        const name = requirement.name;
        const displayedIndex = `${testIndex}.${requirementIndex}`;
        const narratorRequirementStatus =
            outcomeTypeSemanticsFromTestStatus(requirementStatus).pastTense;

        const baselink = this.buildBaseLink(
            name,
            generateReflowAssessmentTestKey(test, requirement.key),
            requirementIndex,
            navLinkRenderer.renderRequirementLink,
            onClick,
        );

        return {
            ...baselink,
            status: requirementStatus,
            title: `${displayedIndex}: ${name} (${narratorRequirementStatus})`,
            displayedIndex,
            testType: test,
            requirementKey: requirement.key,
        };
    }

    private buildGettingStartedLink(
        renderGettingStartedLink: onBaseLeftNavItemRender,
        onClick: onTestGettingStartedClick,
        test: Assessment,
    ): TestGettingStartedNavLink {
        const testType = test.visualizationType;
        return {
            testType,
            ...this.buildBaseLink(
                'Getting started',
                generateReflowAssessmentTestKey(testType, gettingStartedSubview),
                0,
                renderGettingStartedLink,
                onClick,
            ),
        };
    }

    public buildVisualizationConfigurationLink(
        deps: VisualizationConfigurationLinkBuilderDeps,
        configuration: VisualizationConfiguration,
        onLinkClick: onBaseLeftNavItemClick,
        visualizationType: VisualizationType,
        index: number,
        onRightPanelContentSwitch: () => void,
    ): BaseLeftNavLink {
        const displayableData = configuration.displayableData;
        const { navLinkRenderer } = deps;

        const link = this.buildBaseLink(
            displayableData.title,
            VisualizationType[visualizationType],
            index,
            navLinkRenderer.renderVisualizationLink,
            this.getRightPanelContentSwitchLinkClickHandler(onLinkClick, onRightPanelContentSwitch),
        );

        return link;
    }

    private buildBaseLink(
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

    private getRightPanelContentSwitchLinkClickHandler(
        baseOnClick: onBaseLeftNavItemClick,
        onRightPanelContentSwitch: () => void,
    ): onBaseLeftNavItemClick {
        return (
            event: React.MouseEvent<HTMLElement, MouseEvent>,
            item: TestRequirementLeftNavLink,
        ) => {
            baseOnClick(event, item);
            onRightPanelContentSwitch();
        };
    }
}
