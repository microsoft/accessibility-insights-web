// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDefaultMessageGenerator } from 'assessments/assessment-default-message-generator';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { Requirement, VisualHelperToggleConfig } from 'assessments/types/requirement';
import {
    AssessmentData,
    AssessmentNavState,
    PersistedTabInfo,
} from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { Tab } from 'common/types/store-data/itab';
import { PathSnippetStoreData } from 'common/types/store-data/path-snippet-store-data';
import {
    AssessmentViewUpdateHandler,
    AssessmentViewUpdateHandlerDeps,
    AssessmentViewUpdateHandlerProps,
} from 'DetailsView/components/assessment-view-update-handler';
import { RequirementTableSection } from 'DetailsView/components/left-nav/requirement-table-section';
import { RequirementContextSectionDeps } from 'DetailsView/components/requirement-context-section';
import { RequirementInstructions } from 'DetailsView/components/requirement-instructions';
import { RequirementViewComponentConfiguration } from 'DetailsView/components/requirement-view-component-configuration';
import { RequirementContextSectionFactoryProps } from 'DetailsView/components/requirement-view-context-section-factory';
import { GetNextRequirementConfigurationDeps } from 'DetailsView/components/requirement-view-next-requirement-configuration';
import {
    RequirementViewTitleDeps,
    RequirementViewTitleFactoryProps,
} from 'DetailsView/components/requirement-view-title-factory';
import { AssessmentInstanceTableHandler } from 'DetailsView/handlers/assessment-instance-table-handler';
import * as React from 'react';
import styles from './requirement-view.scss';

export type RequirementViewDeps = {
    assessmentViewUpdateHandler: AssessmentViewUpdateHandler;
    getProvider: () => AssessmentsProvider;
    assessmentDefaultMessageGenerator: AssessmentDefaultMessageGenerator;
    quickAssessRequirementKeys: string[];
} & RequirementViewTitleDeps &
    AssessmentViewUpdateHandlerDeps &
    GetNextRequirementConfigurationDeps &
    RequirementContextSectionDeps;

export interface RequirementViewProps {
    deps: RequirementViewDeps;
    assessmentNavState: AssessmentNavState;
    isRequirementEnabled: boolean;
    assessmentInstanceTableHandler: AssessmentInstanceTableHandler;
    featureFlagStoreData: FeatureFlagStoreData;
    pathSnippetStoreData: PathSnippetStoreData;
    scanningInProgress: boolean;
    assessmentData: AssessmentData;
    currentTarget: Tab;
    prevTarget: PersistedTabInfo;
    requirementViewComponentConfiguration: RequirementViewComponentConfiguration;
}

export class RequirementView extends React.Component<RequirementViewProps> {
    public componentDidMount(): void {
        this.props.deps.assessmentViewUpdateHandler.onMount(this.getUpdateHandlerProps(this.props));
    }

    public componentDidUpdate(prevProps: RequirementViewProps): void {
        this.props.deps.assessmentViewUpdateHandler.update(
            this.getUpdateHandlerProps(prevProps),
            this.getUpdateHandlerProps(this.props),
        );
    }

    public componentWillUnmount(): void {
        this.props.deps.assessmentViewUpdateHandler.onUnmount(
            this.getUpdateHandlerProps(this.props),
        );
    }

    private getUpdateHandlerProps(props: RequirementViewProps): AssessmentViewUpdateHandlerProps {
        return {
            deps: props.deps,
            selectedRequirementIsEnabled: props.isRequirementEnabled,
            assessmentNavState: props.assessmentNavState,
            assessmentData: props.assessmentData,
            prevTarget: props.prevTarget,
            currentTarget: props.currentTarget,
        };
    }

    private renderNextRequirementButton(
        assessment: Assessment,
        requirement: Requirement,
    ): JSX.Element {
        const nextRequirementButton =
            this.props.requirementViewComponentConfiguration.getNextRequirementButton({
                deps: this.props.deps,
                currentAssessment: assessment,
                currentRequirement: requirement,
                assessmentNavState: this.props.assessmentNavState,
                className: styles.nextRequirementButton,
            });
        return <div className={styles.nextRequirementButtonContainer}>{nextRequirementButton}</div>;
    }

    public render(): JSX.Element {
        const { deps } = this.props;
        const assessment: Readonly<Assessment> = deps
            .getProvider()
            .forType(this.props.assessmentNavState.selectedTestType)!;
        const requirement: Readonly<Requirement> = deps
            .getProvider()
            .getStep(
                this.props.assessmentNavState.selectedTestType,
                this.props.assessmentNavState.selectedTestSubview,
            )!;
        const isRequirementScanned =
            this.props.assessmentData.testStepStatus[requirement.key].isStepScanned;
        const requirementHasVisualHelper = !!requirement.getVisualHelperToggle;

        const visualHelperToggleConfig: VisualHelperToggleConfig = {
            deps: this.props.deps,
            assessmentNavState: this.props.assessmentNavState,
            instancesMap: this.props.assessmentData.generatedAssessmentInstancesMap!,
            isStepEnabled: this.props.isRequirementEnabled,
            isStepScanned: isRequirementScanned,
        };

        const visualHelperToggle = requirementHasVisualHelper
            ? requirement.getVisualHelperToggle(visualHelperToggleConfig)
            : null;

        const assessmentKey = assessment.key;
        const requirementTitleConfig: RequirementViewTitleFactoryProps = {
            assessmentKey,
            deps: this.props.deps,
            name: requirement.name,
            guidanceLinks: requirement.guidanceLinks,
            infoAndExamples: requirement.infoAndExamples,
        };

        const requirementContextSectionConfig: RequirementContextSectionFactoryProps = {
            assessmentKey,
            className: styles.requirementContextBox,
            deps: this.props.deps,
            whyItMatters: requirement.whyItMatters,
            helpfulResourceLinks: requirement.helpfulResourceLinks,
            infoAndExamples: requirement.infoAndExamples,
        };

        const { getRequirementContextSection, getRequirementViewTitle } =
            this.props.requirementViewComponentConfiguration;
        return (
            <div className={styles.requirementView}>
                <div>
                    {getRequirementViewTitle({ ...requirementTitleConfig })}
                    <div className={styles.requirementContent}>
                        <div className={styles.mainContent}>
                            <>
                                {requirement.description}
                                {visualHelperToggle}
                                <RequirementInstructions howToTest={requirement.howToTest} />
                                <RequirementTableSection
                                    requirement={requirement}
                                    assessmentNavState={this.props.assessmentNavState}
                                    instancesMap={
                                        this.props.assessmentData.generatedAssessmentInstancesMap!
                                    }
                                    manualRequirementResultMap={
                                        this.props.assessmentData.manualTestStepResultMap!
                                    }
                                    assessmentInstanceTableHandler={
                                        this.props.assessmentInstanceTableHandler
                                    }
                                    assessmentsProvider={deps.getProvider()}
                                    featureFlagStoreData={this.props.featureFlagStoreData}
                                    pathSnippetStoreData={this.props.pathSnippetStoreData}
                                    scanningInProgress={this.props.scanningInProgress}
                                    selectedRequirementHasVisualHelper={requirementHasVisualHelper}
                                    isRequirementScanned={isRequirementScanned}
                                    assessmentDefaultMessageGenerator={
                                        deps.assessmentDefaultMessageGenerator
                                    }
                                />
                            </>
                        </div>
                        {getRequirementContextSection({ ...requirementContextSectionConfig })}
                    </div>
                </div>
                {this.renderNextRequirementButton(assessment, requirement)}
            </div>
        );
    }
}
