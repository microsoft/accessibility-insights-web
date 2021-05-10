// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { FailureInstanceData } from 'common/types/failure-instance-data';
import { ManualTestStatus } from 'common/types/manual-test-status';
import { ManualTestStepResult } from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { PathSnippetStoreData } from 'common/types/store-data/path-snippet-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { CheckboxVisibility, ConstrainMode, DetailsList } from 'office-ui-fabric-react';
import * as React from 'react';
import { DictionaryStringTo } from 'types/common-types';
import { AssessmentInstanceTableHandler } from '../handlers/assessment-instance-table-handler';
import {
    CapturedInstanceActionType,
    FailureInstancePanelControl,
} from './failure-instance-panel-control';
import { TestStatusChoiceGroup } from './test-status-choice-group';

export interface ManualTestStepViewProps {
    step: string;
    test: VisualizationType;
    assessmentInstanceTableHandler: AssessmentInstanceTableHandler;
    manualTestStepResultMap: DictionaryStringTo<ManualTestStepResult>;
    assessmentsProvider: AssessmentsProvider;
    featureFlagStoreData: FeatureFlagStoreData;
    pathSnippetStoreData: PathSnippetStoreData;
}

export class ManualTestStepView extends React.Component<ManualTestStepViewProps> {
    public render(): JSX.Element {
        const status = this.props.manualTestStepResultMap[this.props.step].status;
        return (
            <React.Fragment>
                <div className="test-step-choice-group-container">
                    <TestStatusChoiceGroup
                        test={this.props.test}
                        step={this.props.step}
                        status={status}
                        originalStatus={ManualTestStatus.UNKNOWN}
                        onGroupChoiceChange={
                            this.props.assessmentInstanceTableHandler.changeRequirementStatus
                        }
                        onUndoClicked={
                            this.props.assessmentInstanceTableHandler.undoRequirementStatusChange
                        }
                        isLabelVisible={true}
                    />
                </div>
                <div className="manual-test-step-table-container">{this.renderTable(status)}</div>
            </React.Fragment>
        );
    }

    private renderTable(status: ManualTestStatus): JSX.Element {
        if (status !== ManualTestStatus.FAIL) {
            return null;
        }
        const columns =
            this.props.assessmentInstanceTableHandler.getColumnConfigsForCapturedInstance();
        const items = this.props.assessmentInstanceTableHandler.createCapturedInstanceTableItems(
            this.props.manualTestStepResultMap[this.props.step].instances,
            this.props.test,
            this.props.step,
            this.props.featureFlagStoreData,
            this.props.pathSnippetStoreData,
        );
        const instance: FailureInstanceData = {
            path: this.props.pathSnippetStoreData.path,
            snippet: this.props.pathSnippetStoreData.snippet,
        };
        return (
            <React.Fragment>
                <h3 className="test-step-instances-header">Instances</h3>
                <FailureInstancePanelControl
                    step={this.props.step}
                    test={this.props.test}
                    addFailureInstance={
                        this.props.assessmentInstanceTableHandler.addFailureInstance
                    }
                    addPathForValidation={
                        this.props.assessmentInstanceTableHandler.addPathForValidation
                    }
                    clearPathSnippetData={
                        this.props.assessmentInstanceTableHandler.clearPathSnippetData
                    }
                    actionType={CapturedInstanceActionType.CREATE}
                    assessmentsProvider={this.props.assessmentsProvider}
                    featureFlagStoreData={this.props.featureFlagStoreData}
                    failureInstance={instance}
                />
                <DetailsList
                    items={items}
                    columns={columns}
                    checkboxVisibility={CheckboxVisibility.hidden}
                    constrainMode={ConstrainMode.horizontalConstrained}
                />
            </React.Fragment>
        );
    }
}
