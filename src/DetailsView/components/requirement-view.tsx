// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDefaultMessageGenerator } from 'assessments/assessment-default-message-generator';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { Requirement, VisualHelperToggleConfig } from 'assessments/types/requirement';
import { Tab } from 'common/itab';
import {
    AssessmentData,
    AssessmentNavState,
    PersistedTabInfo,
} from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { PathSnippetStoreData } from 'common/types/store-data/path-snippet-store-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import {
    AssessmentViewUpdateHandler,
    AssessmentViewUpdateHandlerDeps,
    AssessmentViewUpdateHandlerProps,
} from 'DetailsView/components/assessment-view-update-handler';
import { RequirementTableSection } from 'DetailsView/components/left-nav/requirement-table-section';
import { NextRequirementButton } from 'DetailsView/components/next-requirement-button';
import { RequirementInstructions } from 'DetailsView/components/requirement-instructions';
import {
    RequirementViewTitle,
    RequirementViewTitleDeps,
} from 'DetailsView/components/requirement-view-title';
import { AssessmentInstanceTableHandler } from 'DetailsView/handlers/assessment-instance-table-handler';
import * as React from 'react';
import * as styles from './requirement-view.scss';

export type RequirementViewDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    assessmentViewUpdateHandler: AssessmentViewUpdateHandler;
    assessmentsProvider: AssessmentsProvider;
    assessmentDefaultMessageGenerator: AssessmentDefaultMessageGenerator;
} & RequirementViewTitleDeps &
    AssessmentViewUpdateHandlerDeps;

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

    public render(): JSX.Element {
        const { deps } = this.props;
        const assessment: Readonly<Assessment> = deps.assessmentsProvider.forType(
            this.props.assessmentNavState.selectedTestType,
        );
        const requirement: Readonly<Requirement> = deps.assessmentsProvider.getStep(
            this.props.assessmentNavState.selectedTestType,
            this.props.assessmentNavState.selectedTestSubview,
        );
        const requirementIndex = assessment.requirements.findIndex(r => r.key === requirement.key);
        const nextRequirement = assessment.requirements[requirementIndex + 1] ?? null;

        const isRequirementScanned =
            this.props.assessmentData.testStepStatus[requirement.key].isStepScanned;

        const requirementHasVisualHelper = !!requirement.getVisualHelperToggle;

        const visualHelperToggleConfig: VisualHelperToggleConfig = {
            deps: this.props.deps,
            assessmentNavState: this.props.assessmentNavState,
            instancesMap: this.props.assessmentData.generatedAssessmentInstancesMap,
            isStepEnabled: this.props.isRequirementEnabled,
            isStepScanned: isRequirementScanned,
        };

        const visualHelperToggle = requirementHasVisualHelper
            ? requirement.getVisualHelperToggle(visualHelperToggleConfig)
            : null;

        return (
            <div className={styles.requirementView}>
                <div>
                    <RequirementViewTitle
                        deps={this.props.deps}
                        name={requirement.name}
                        guidanceLinks={requirement.guidanceLinks}
                        infoAndExamples={requirement.infoAndExamples}
                    />
                    <div className={styles.mainContent}>
                        {requirement.description}
                        {visualHelperToggle}
                        <RequirementInstructions howToTest={requirement.howToTest} />
                        <RequirementTableSection
                            requirement={requirement}
                            assessmentNavState={this.props.assessmentNavState}
                            instancesMap={this.props.assessmentData.generatedAssessmentInstancesMap}
                            manualRequirementResultMap={
                                this.props.assessmentData.manualTestStepResultMap
                            }
                            assessmentInstanceTableHandler={
                                this.props.assessmentInstanceTableHandler
                            }
                            assessmentsProvider={deps.assessmentsProvider}
                            featureFlagStoreData={this.props.featureFlagStoreData}
                            pathSnippetStoreData={this.props.pathSnippetStoreData}
                            scanningInProgress={this.props.scanningInProgress}
                            selectedRequirementHasVisualHelper={requirementHasVisualHelper}
                            isRequirementScanned={isRequirementScanned}
                            assessmentDefaultMessageGenerator={
                                deps.assessmentDefaultMessageGenerator
                            }
                        />
                    </div>
                </div>
                <div className={styles.nextRequirementButtonContainer}>
                    <NextRequirementButton
                        deps={this.props.deps}
                        nextRequirement={nextRequirement}
                        currentTest={this.props.assessmentNavState.selectedTestType}
                        className={styles.nextRequirementButton}
                    />
                </div>
            </div>
        );
    }
}
