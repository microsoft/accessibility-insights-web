// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDefaultMessageGenerator } from 'assessments/assessment-default-message-generator';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import * as styles from 'DetailsView/components/assessment-view.scss';
import * as React from 'react';
import { ContentLink, ContentLinkDeps } from 'views/content/content-link';
import { ContentPageComponent } from 'views/content/content-page';

import { AssessmentViewUpdateHandler } from 'DetailsView/components/assessment-view-update-handler';
import { AssessmentTestResult } from '../../common/assessment/assessment-test-result';
import { CollapsibleComponent } from '../../common/components/collapsible-component';
import { reactExtensionPoint } from '../../common/extensibility/react-extension-point';
import { Tab } from '../../common/itab';
import {
    AssessmentData,
    AssessmentNavState,
    PersistedTabInfo,
} from '../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { PathSnippetStoreData } from '../../common/types/store-data/path-snippet-store-data';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { detailsViewExtensionPoint } from '../extensions/details-view-extension-point';
import { AssessmentInstanceTableHandler } from '../handlers/assessment-instance-table-handler';
import { TargetChangeDialog, TargetChangeDialogDeps } from './target-change-dialog';
import { TestStepView, TestStepViewDeps } from './test-step-view';
import { TestStepNavDeps, TestStepsNav } from './test-steps-nav';

export type WithAssessmentTestResult = { assessmentTestResult: AssessmentTestResult };
export const AssessmentViewMainContentExtensionPoint = reactExtensionPoint<
    WithAssessmentTestResult
>('AssessmentViewMainContentExtensionPoint');

export type AssessmentViewDeps = ContentLinkDeps &
    TestStepViewDeps &
    TestStepNavDeps &
    TargetChangeDialogDeps & {
        detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
        assessmentsProvider: AssessmentsProvider;
        assessmentViewUpdateHandler: AssessmentViewUpdateHandler;
    };

export interface AssessmentViewProps {
    deps: AssessmentViewDeps;
    isScanning: boolean;
    isEnabled: boolean;
    assessmentNavState: AssessmentNavState;
    assessmentInstanceTableHandler: AssessmentInstanceTableHandler;
    assessmentData: AssessmentData;
    currentTarget: Tab;
    prevTarget: PersistedTabInfo;
    assessmentDefaultMessageGenerator: AssessmentDefaultMessageGenerator;
    assessmentTestResult: AssessmentTestResult;
    featureFlagStoreData: FeatureFlagStoreData;
    pathSnippetStoreData: PathSnippetStoreData;
}

export class AssessmentView extends React.Component<AssessmentViewProps> {
    public static readonly requirementsTitle: string = 'Requirements';

    private deps: AssessmentViewDeps;

    constructor(props: AssessmentViewProps) {
        super(props);
        this.deps = props.deps;
        this.state = {
            isStartOverDialogOpen: false,
        };
    }

    public render(): JSX.Element {
        const { assessmentTestResult } = this.props;
        const { extensions } = assessmentTestResult.definition;
        const extPointProps = { extensions, assessmentTestResult };

        return (
            <div className={styles.assessmentContent}>
                {this.renderTargetChangeDialog()}
                {this.renderTitle(
                    assessmentTestResult.definition.title,
                    assessmentTestResult.definition.guidance,
                )}
                {this.renderGettingStarted(assessmentTestResult.definition.gettingStarted)}
                <AssessmentViewMainContentExtensionPoint.component {...extPointProps}>
                    {this.renderRequirements()}
                    {this.renderMainContent(assessmentTestResult)}
                </AssessmentViewMainContentExtensionPoint.component>
            </div>
        );
    }

    public componentDidMount(): void {
        this.deps.assessmentViewUpdateHandler.onMount(this.props);
    }

    public componentDidUpdate(prevProps: AssessmentViewProps): void {
        this.deps.assessmentViewUpdateHandler.update(prevProps, this.props);

        const { assessmentTestResult } = this.props;
        detailsViewExtensionPoint
            .apply(assessmentTestResult.definition.extensions)
            .onAssessmentViewUpdate(prevProps, this.props);
    }

    public componentWillUnmount(): void {
        this.deps.assessmentViewUpdateHandler.onUnmount(this.props);
    }

    private renderTargetChangeDialog(): JSX.Element {
        return (
            <TargetChangeDialog
                deps={this.props.deps}
                prevTab={this.props.prevTarget}
                newTab={this.props.currentTarget}
            />
        );
    }

    private renderTitle(title: string, content?: ContentPageComponent): JSX.Element {
        return (
            <div className={styles.assessmentTitle}>
                <h1 className={styles.assessmentHeader}>
                    {title} <ContentLink deps={this.deps} reference={content} iconName="info" />
                </h1>
            </div>
        );
    }

    private renderGettingStarted(gettingStarted: JSX.Element): JSX.Element {
        return (
            <CollapsibleComponent
                header={<h2>Getting Started</h2>}
                content={gettingStarted}
                containerClassName={styles.assessmentGettingStartedContainer}
            />
        );
    }

    private renderRequirements(): JSX.Element {
        return (
            <div className={styles.assessmentRequirementsTitle}>
                <h2 className={styles.assessmentRequirements}>
                    {AssessmentView.requirementsTitle}
                </h2>
            </div>
        );
    }

    private renderMainContent(assessmentTestResult: AssessmentTestResult): JSX.Element {
        const selectedRequirement = assessmentTestResult.getRequirementResult(
            this.props.assessmentNavState.selectedTestSubview,
        );
        const isStepScanned = selectedRequirement.data.isStepScanned;

        return (
            <div className={styles.detailsViewAssessmentContent}>
                <div className={styles.testStepsNavContainer}>
                    <TestStepsNav
                        deps={this.props.deps}
                        ariaLabel={AssessmentView.requirementsTitle}
                        selectedTest={assessmentTestResult.visualizationType}
                        selectedTestStep={selectedRequirement.definition.key}
                        stepStatus={this.props.assessmentData.testStepStatus}
                    />
                </div>
                <div className={styles.testStepViewContainer}>
                    <TestStepView
                        deps={this.deps}
                        isScanning={this.props.isScanning}
                        testStep={selectedRequirement.definition}
                        renderStaticContent={selectedRequirement.definition.renderStaticContent}
                        instancesMap={this.props.assessmentData.generatedAssessmentInstancesMap}
                        assessmentNavState={this.props.assessmentNavState}
                        assessmentInstanceTableHandler={this.props.assessmentInstanceTableHandler}
                        manualTestStepResultMap={this.props.assessmentData.manualTestStepResultMap}
                        assessmentsProvider={this.props.deps.assessmentsProvider}
                        isStepEnabled={this.props.isEnabled}
                        isStepScanned={isStepScanned}
                        assessmentDefaultMessageGenerator={
                            this.props.assessmentDefaultMessageGenerator
                        }
                        featureFlagStoreData={this.props.featureFlagStoreData}
                        pathSnippetStoreData={this.props.pathSnippetStoreData}
                    />
                </div>
            </div>
        );
    }
}
