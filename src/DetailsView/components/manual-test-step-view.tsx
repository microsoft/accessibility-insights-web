// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CheckboxVisibility, ConstrainMode, DetailsList } from 'office-ui-fabric-react/lib/DetailsList';
import * as React from 'react';

import { IAssessmentsProvider } from '../../assessments/types/iassessments-provider';
import { ManualTestStatus } from '../../common/types/manual-test-status';
import { IManualTestStepResult } from '../../common/types/store-data/iassessment-result-data';
import { VisualizationType } from '../../common/types/visualization-type';
import { AssessmentInstanceTableHandler } from '../handlers/assessment-instance-table-handler';
import { CapturedInstanceActionType, FailureInstancePanelControl } from './failure-instance-panel-control';
import { TestStatusChoiceGroup } from './test-status-choice-group';

export interface ManualTestStepViewProps {
    step: string;
    test: VisualizationType;
    assessmentInstanceTableHandler: AssessmentInstanceTableHandler;
    manualTestStepResultMap: IDictionaryStringTo<IManualTestStepResult>;
    assessmentsProvider: IAssessmentsProvider;
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
                        onGroupChoiceChange={this.props.assessmentInstanceTableHandler.changeStepStatus}
                        onUndoClicked={this.props.assessmentInstanceTableHandler.undoStepStatusChange}
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
        const columns = this.props.assessmentInstanceTableHandler.getColumnConfigsForCapturedInstance();
        const items = this.props.assessmentInstanceTableHandler.createCapturedInstanceTableItems(
            this.props.manualTestStepResultMap[this.props.step].instances,
            this.props.test,
            this.props.step,
        );
        return (
            <React.Fragment>
                <h3 className="test-step-instances-header">Instances</h3>
                <FailureInstancePanelControl
                    step={this.props.step}
                    test={this.props.test}
                    addFailureInstance={this.props.assessmentInstanceTableHandler.addFailureInstance}
                    actionType={CapturedInstanceActionType.CREATE}
                    assessmentsProvider={this.props.assessmentsProvider}
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
