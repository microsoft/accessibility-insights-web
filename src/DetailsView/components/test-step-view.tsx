// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentDefaultMessageGenerator } from 'assessments/assessment-default-message-generator';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Requirement, VisualHelperToggleConfig } from 'assessments/types/requirement';
import { CollapsibleComponent } from 'common/components/collapsible-component';
import { GuidanceTags, GuidanceTagsDeps } from 'common/components/guidance-tags';
import {
    AssessmentNavState,
    GeneratedAssessmentInstance,
    ManualTestStepResult,
} from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { PathSnippetStoreData } from 'common/types/store-data/path-snippet-store-data';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react';
import * as React from 'react';
import { DictionaryStringTo } from 'types/common-types';
import { ContentPanelButton, ContentPanelButtonDeps } from 'views/content/content-panel-button';

import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { AssessmentInstanceTableHandler } from '../handlers/assessment-instance-table-handler';
import { AssessmentInstanceTable } from './assessment-instance-table';
import { ManualTestStepView } from './manual-test-step-view';
import * as styles from './test-step-view.scss';

export type TestStepViewDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
} & ContentPanelButtonDeps &
    GuidanceTagsDeps;

export interface TestStepViewProps {
    deps: TestStepViewDeps;
    isStepEnabled: boolean;
    isStepScanned: boolean;
    isScanning: boolean;
    testStep: Requirement;
    renderStaticContent: () => JSX.Element;
    instancesMap: DictionaryStringTo<GeneratedAssessmentInstance>;
    assessmentNavState: AssessmentNavState;
    assessmentInstanceTableHandler: AssessmentInstanceTableHandler;
    manualTestStepResultMap: DictionaryStringTo<ManualTestStepResult>;
    assessmentsProvider: AssessmentsProvider;
    assessmentDefaultMessageGenerator: AssessmentDefaultMessageGenerator;
    featureFlagStoreData: FeatureFlagStoreData;
    pathSnippetStoreData: PathSnippetStoreData;
}

export class TestStepView extends React.Component<TestStepViewProps> {
    public render(): JSX.Element {
        return (
            <div className="test-step-view">
                <div className="test-step-title-container">
                    <h3 className="test-step-view-title">
                        {this.props.testStep.name}
                        <GuidanceTags
                            deps={this.props.deps}
                            links={this.props.testStep.guidanceLinks}
                        />
                    </h3>
                    <ContentPanelButton
                        deps={this.props.deps}
                        reference={this.props.testStep.infoAndExamples}
                        iconName="info"
                    >
                        Info &amp; examples
                    </ContentPanelButton>
                </div>
                {this.renderVisualHelperToggle()}
                <CollapsibleComponent
                    header={<h4 className={styles.testStepInstructionsHeader}>How to test</h4>}
                    content={this.props.testStep.howToTest}
                    contentClassName={styles.testStepInstructions}
                />
                {this.renderTable()}
            </div>
        );
    }

    private renderTable(): JSX.Element {
        if (this.props.testStep.isManual) {
            return (
                <ManualTestStepView
                    test={this.props.assessmentNavState.selectedTestType}
                    step={this.props.assessmentNavState.selectedTestSubview}
                    manualTestStepResultMap={this.props.manualTestStepResultMap}
                    assessmentInstanceTableHandler={this.props.assessmentInstanceTableHandler}
                    assessmentsProvider={this.props.assessmentsProvider}
                    featureFlagStoreData={this.props.featureFlagStoreData}
                    pathSnippetStoreData={this.props.pathSnippetStoreData}
                />
            );
        }

        if (this.props.isScanning) {
            return (
                <Spinner
                    className="details-view-spinner"
                    size={SpinnerSize.large}
                    label={'Scanning'}
                />
            );
        }

        return (
            <React.Fragment>
                {this.renderScanCompleteAlert()}
                <h3 className="test-step-instances-header">Instances</h3>
                <AssessmentInstanceTable
                    instancesMap={this.props.instancesMap}
                    assessmentInstanceTableHandler={this.props.assessmentInstanceTableHandler}
                    assessmentNavState={this.props.assessmentNavState}
                    renderInstanceTableHeader={this.props.testStep.renderInstanceTableHeader}
                    getDefaultMessage={this.props.testStep.getDefaultMessage}
                    assessmentDefaultMessageGenerator={this.props.assessmentDefaultMessageGenerator}
                    hasVisualHelper={this.doesSelectedStepHaveVisualHelper()}
                />
            </React.Fragment>
        );
    }

    private renderScanCompleteAlert(): JSX.Element {
        if (!this.props.testStep.isManual && this.props.isStepScanned) {
            return <div role="alert" aria-live="polite" aria-label="Scan Complete" />;
        }
    }
    private getSelectedStep(): Readonly<Requirement> {
        return this.props.assessmentsProvider.getStep(
            this.props.assessmentNavState.selectedTestType,
            this.props.assessmentNavState.selectedTestSubview,
        );
    }

    private doesSelectedStepHaveVisualHelper(): boolean {
        return this.getSelectedStep().getVisualHelperToggle != null;
    }

    private renderVisualHelperToggle(): JSX.Element {
        if (!this.doesSelectedStepHaveVisualHelper()) {
            return null;
        }

        const visualHelperToggleConfig: VisualHelperToggleConfig = {
            deps: this.props.deps,
            assessmentNavState: this.props.assessmentNavState,
            instancesMap: this.props.instancesMap,
            isStepEnabled: this.props.isStepEnabled,
            isStepScanned: this.props.isStepScanned,
        };

        return this.getSelectedStep().getVisualHelperToggle(visualHelperToggleConfig);
    }
}
