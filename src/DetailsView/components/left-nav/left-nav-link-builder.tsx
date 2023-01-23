// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { Requirement } from 'assessments/types/requirement';
import { gettingStartedSubview } from 'common/types/store-data/assessment-result-data';
import {
    AssessmentLeftNavLink,
    onTestGettingStartedClick,
    onTestRequirementClick,
    TestGettingStartedNavLink,
    TestRequirementLeftNavLink,
} from 'DetailsView/components/left-nav/assessment-left-nav';
import { GetSelectedAssessmentSummaryModelFromProviderAndStatusData } from 'DetailsView/components/left-nav/get-selected-assessment-summary-model';
import { NavLinkHandler } from 'DetailsView/components/left-nav/nav-link-handler';
import { NavLinkRenderer } from 'DetailsView/components/left-nav/nav-link-renderer';
import { map } from 'lodash';
import { OutcomeTypeSemantic } from 'reports/components/outcome-type';
import { RequirementOutcomeStats } from 'reports/components/requirement-outcome-type';

import { VisualizationConfiguration } from '../../../common/configs/visualization-configuration';
import {
    ManualTestStatus,
    ManualTestStatusData,
} from '../../../common/types/store-data/manual-test-status';
import { VisualizationType } from '../../../common/types/visualization-type';
import { DictionaryStringTo } from '../../../types/common-types';
import { BaseLeftNavLink, onBaseLeftNavItemClick, onBaseLeftNavItemRender } from '../base-left-nav';

export type LeftNavLinkBuilderDeps = OverviewLinkBuilderDeps &
    AssessmentLinkBuilderDeps &
    QuickAssessLinkBuilderDeps &
    VisualizationConfigurationLinkBuilderDeps;

export type OverviewLinkBuilderDeps = {
    getGetAssessmentSummaryModelFromProviderAndStatusData: () => GetSelectedAssessmentSummaryModelFromProviderAndStatusData;
    navLinkRenderer: NavLinkRenderer;
    quickAssessRequirementKeys: string[];
};

export type AssessmentLinkBuilderDeps = {
    getNavLinkHandler: () => NavLinkHandler;
    getStatusForTest: (stats: RequirementOutcomeStats) => ManualTestStatus;
    outcomeTypeSemanticsFromTestStatus: (testStatus: ManualTestStatus) => OutcomeTypeSemantic;
    outcomeStatsFromManualTestStatus: (
        testStepStatus: ManualTestStatusData,
    ) => RequirementOutcomeStats;
    navLinkRenderer: NavLinkRenderer;
};

export type QuickAssessLinkBuilderDeps = {
    quickAssessRequirementKeys: string[];
} & AssessmentLinkBuilderDeps;

export type VisualizationConfigurationLinkBuilderDeps = {
    navLinkRenderer: NavLinkRenderer;
};

export function generateAssessmentTestKey(
    test: VisualizationType,
    selectedSubview: string,
): string {
    return `${VisualizationType[test]}: ${selectedSubview}`;
}

export type assessmentTestKeyGenerator = typeof generateAssessmentTestKey;

export class LeftNavLinkBuilder {
    public buildOverviewLink(
        deps: OverviewLinkBuilderDeps,
        onLinkClick: onBaseLeftNavItemClick,
        assessmentsProvider: AssessmentsProvider,
        assessmentsData: DictionaryStringTo<ManualTestStatusData>,
        index: number,
        onRightPanelContentSwitch: () => void,
    ): BaseLeftNavLink {
        const { navLinkRenderer, getGetAssessmentSummaryModelFromProviderAndStatusData } = deps;
        const getAssessmentSummaryModelFromProviderAndStatusData =
            getGetAssessmentSummaryModelFromProviderAndStatusData();

        const reportModel = getAssessmentSummaryModelFromProviderAndStatusData(
            assessmentsProvider,
            assessmentsData,
            deps.quickAssessRequirementKeys,
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

    public buildAutomatedChecksLinks(
        deps: AssessmentLinkBuilderDeps,
        assessmentsProvider: AssessmentsProvider,
        assessmentsData: DictionaryStringTo<ManualTestStatusData>,
        startingIndex: number,
        expandedTest: VisualizationType | undefined,
        onRightPanelContentSwitch: () => void,
    ): BaseLeftNavLink {
        const assessment = assessmentsProvider.forKey('automated-checks');

        const isExpanded = assessment.visualizationType === expandedTest;
        const test = this.buildAssessmentLink(
            deps,
            assessment,
            startingIndex,
            assessmentsData,
            isExpanded,
            onRightPanelContentSwitch,
        );

        return test;
    }

    public buildQuickAssessTestLinks(
        deps: QuickAssessLinkBuilderDeps,
        assessmentsProvider: AssessmentsProvider,
        assessmentsData: DictionaryStringTo<ManualTestStatusData>,
        startingIndex: number,
        onRightPanelContentSwitch: () => void,
    ): TestRequirementLeftNavLink[] {
        let index = startingIndex;
        const testLinks = [];
        const { getNavLinkHandler, quickAssessRequirementKeys } = deps;
        const navLinkHandler = getNavLinkHandler();
        quickAssessRequirementKeys.forEach(requirementKey => {
            const assessment = assessmentsProvider.forRequirementKey(requirementKey);
            const stepStatus = assessmentsData[assessment.key];
            const requirement = assessmentsProvider.getStep(
                assessment.visualizationType,
                requirementKey,
            );
            testLinks.push(
                this.buildQuickAssessRequirementLink(
                    deps,
                    assessment.visualizationType,
                    requirement,
                    stepStatus[requirement.key]?.stepFinalResult,
                    index,
                    this.getRightPanelContentSwitchLinkClickHandler(
                        navLinkHandler.onRequirementClick,
                        onRightPanelContentSwitch,
                    ),
                ),
            );
            index++;
        });

        return testLinks;
    }

    public buildAssessmentTestLinks(
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
    ): AssessmentLeftNavLink => {
        const {
            getStatusForTest,
            outcomeTypeSemanticsFromTestStatus,
            outcomeStatsFromManualTestStatus,
            getNavLinkHandler,
            navLinkRenderer,
        } = deps;

        const navLinkHandler = getNavLinkHandler();
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
                this.buildAssessmentRequirementLink(
                    deps,
                    assessment.visualizationType,
                    requirement,
                    stepStatus[requirement.key]?.stepFinalResult,
                    index,
                    requirementIndex + 1,
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

    private buildQuickAssessRequirementLink(
        deps: AssessmentLinkBuilderDeps,
        test: VisualizationType,
        requirement: Requirement,
        requirementStatus: ManualTestStatus,
        testIndex: number,
        onClick: onTestRequirementClick,
    ): TestRequirementLeftNavLink {
        const { outcomeTypeSemanticsFromTestStatus, navLinkRenderer } = deps;
        const name = requirement.name;
        const displayedIndex = `${testIndex}`;
        const narratorRequirementStatus =
            outcomeTypeSemanticsFromTestStatus(requirementStatus).pastTense;

        const baselink = this.buildBaseLink(
            name,
            generateAssessmentTestKey(test, requirement.key),
            testIndex,
            navLinkRenderer.renderAssessmentTestLink,
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

    private buildAssessmentRequirementLink(
        deps: AssessmentLinkBuilderDeps,
        test: VisualizationType,
        requirement: Requirement,
        requirementStatus: ManualTestStatus,
        testIndex: number,
        requirementIndex: number,
        onClick: onTestRequirementClick,
    ): TestRequirementLeftNavLink {
        const { outcomeTypeSemanticsFromTestStatus, navLinkRenderer } = deps;
        const name = requirement.name;
        const displayedIndex = `${testIndex}.${requirementIndex}`;

        const narratorRequirementStatus =
            outcomeTypeSemanticsFromTestStatus(requirementStatus).pastTense;

        const baselink = this.buildBaseLink(
            name,
            generateAssessmentTestKey(test, requirement.key),
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
                generateAssessmentTestKey(testType, gettingStartedSubview),
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
