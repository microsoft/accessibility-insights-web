// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDefaultMessageGenerator } from 'assessments/assessment-default-message-generator';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Requirement, VisualHelperToggleConfig } from 'assessments/types/requirement';
import { Tab } from 'common/itab';
import {
    AssessmentData,
    AssessmentNavState,
    GeneratedAssessmentInstance,
    ManualTestStepResult,
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
import { DictionaryStringTo } from 'types/common-types';
import * as styles from './requirement-view.scss';

export type RequirementViewDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
    assessmentViewUpdateHandler: AssessmentViewUpdateHandler;
} & RequirementViewTitleDeps &
    AssessmentViewUpdateHandlerDeps;

export interface RequirementViewProps {
    deps: RequirementViewDeps;
    requirement: Requirement;
    assessmentsProvider: AssessmentsProvider;
    assessmentNavState: AssessmentNavState;
    instancesMap: DictionaryStringTo<GeneratedAssessmentInstance>;
    isRequirementEnabled: boolean;
    isRequirementScanned: boolean;
    assessmentInstanceTableHandler: AssessmentInstanceTableHandler;
    featureFlagStoreData: FeatureFlagStoreData;
    pathSnippetStoreData: PathSnippetStoreData;
    scanningInProgress: boolean;
    manualRequirementResultMap: DictionaryStringTo<ManualTestStepResult>;
    assessmentDefaultMessageGenerator: AssessmentDefaultMessageGenerator;
    assessmentData: AssessmentData;
    currentTarget: Tab;
    prevTarget: PersistedTabInfo;
    nextRequirement: Requirement;
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
        const requirement: Readonly<Requirement> = this.props.assessmentsProvider.getStep(
            this.props.assessmentNavState.selectedTestType,
            this.props.assessmentNavState.selectedTestSubview,
        );
        const requirementHasVisualHelper = !!requirement.getVisualHelperToggle;

        const visualHelperToggleConfig: VisualHelperToggleConfig = {
            deps: this.props.deps,
            assessmentNavState: this.props.assessmentNavState,
            instancesMap: this.props.instancesMap,
            isStepEnabled: this.props.isRequirementEnabled,
            isStepScanned: this.props.isRequirementScanned,
        };

        const visualHelperToggle = requirementHasVisualHelper
            ? requirement.getVisualHelperToggle(visualHelperToggleConfig)
            : null;

        return (
            <div className={styles.requirementView}>
                <div>
                    <RequirementViewTitle
                        deps={this.props.deps}
                        name={this.props.requirement.name}
                        guidanceLinks={this.props.requirement.guidanceLinks}
                        infoAndExamples={this.props.requirement.infoAndExamples}
                    />
                    <div className={styles.mainContent}>
                        {this.props.requirement.description}
                        {visualHelperToggle}
                        <RequirementInstructions howToTest={this.props.requirement.howToTest} />
                        <RequirementTableSection
                            requirement={requirement}
                            assessmentNavState={this.props.assessmentNavState}
                            instancesMap={this.props.instancesMap}
                            manualRequirementResultMap={this.props.manualRequirementResultMap}
                            assessmentInstanceTableHandler={
                                this.props.assessmentInstanceTableHandler
                            }
                            assessmentsProvider={this.props.assessmentsProvider}
                            featureFlagStoreData={this.props.featureFlagStoreData}
                            pathSnippetStoreData={this.props.pathSnippetStoreData}
                            scanningInProgress={this.props.scanningInProgress}
                            selectedRequirementHasVisualHelper={requirementHasVisualHelper}
                            isRequirementScanned={this.props.isRequirementScanned}
                            assessmentDefaultMessageGenerator={
                                this.props.assessmentDefaultMessageGenerator
                            }
                        />
                    </div>
                </div>
                <NextRequirementButton
                    deps={this.props.deps}
                    nextRequirement={this.props.nextRequirement}
                    currentTest={this.props.assessmentNavState.selectedTestType}
                    className={styles.nextRequirementButton}
                />
            </div>
        );
    }
}
