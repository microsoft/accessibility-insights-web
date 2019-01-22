// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import * as React from 'react';

import { IAssessmentsProvider } from '../../assessments/types/iassessments-provider';
import {
    IAssessmentNavState,
    IGeneratedAssessmentInstance,
    IUserCapturedInstance,
} from '../../common/types/store-data/iassessment-result-data';
import { VisualizationType } from '../../common/types/visualization-type';
import { AssessmentInstanceEditAndRemoveControl } from '../components/assessment-instance-edit-and-remove-control';
import { IAssessmentInstanceRowData, ICapturedInstanceRowData } from '../components/assessment-instance-table';
import { AssessmentTableColumnConfigHandler } from '../components/assessment-table-column-config-handler';
import { AssessmentInstanceSelectedButton } from '../components/assessment-instance-selected-button';
import { ManualTestStatus } from './../../common/types/manual-test-status';
import { DetailsViewActionMessageCreator } from './../actions/details-view-action-message-creator';
import { TestStatusChoiceGroup } from './../components/test-status-choice-group';

export class AssessmentInstanceTableHandler {
    private actionMessageCreator: DetailsViewActionMessageCreator;
    private assessmentTableColumnConfigHandler: AssessmentTableColumnConfigHandler;
    private assessmentsProvider: IAssessmentsProvider;

    constructor(
        actionMessageCreator: DetailsViewActionMessageCreator,
        assessmentTableColumnConfigHandler: AssessmentTableColumnConfigHandler,
        assessmentsProvider: IAssessmentsProvider,
    ) {
        this.actionMessageCreator = actionMessageCreator;
        this.assessmentTableColumnConfigHandler = assessmentTableColumnConfigHandler;
        this.assessmentsProvider = assessmentsProvider;
    }

    @autobind
    public changeStepStatus(status: ManualTestStatus, test: VisualizationType, step: string): void {
        this.actionMessageCreator.changeManualTestStepStatus(status, test, step);
    }

    @autobind
    public undoStepStatusChange(test: VisualizationType, step: string): void {
        this.actionMessageCreator.undoManualTestStepStatusChange(test, step);
    }

    @autobind
    public addFailureInstance(description: string, test: VisualizationType, step: string): void {
        this.actionMessageCreator.addFailureInstance(description, test, step);
    }

    public passUnmarkedInstances(test: VisualizationType, step: string): void {
        this.actionMessageCreator.passUnmarkedInstances(test, step);
    }

    public updateFocusedTarget(target: string[]): void {
        this.actionMessageCreator.updateFocusedInstanceTarget(target);
    }

    public createAssessmentInstanceTableItems(
        instancesMap: IDictionaryStringTo<IGeneratedAssessmentInstance>,
        assessmentNavState: IAssessmentNavState,
    ): IAssessmentInstanceRowData[] {
        const assessmentInstances = this.getInstanceKeys(instancesMap, assessmentNavState).map(key => {
            const instance = instancesMap[key];
            return {
                key: key,
                statusChoiceGroup: this.renderChoiceGroup(instance, key, assessmentNavState),
                visualizationButton: this.renderSelectedButton(instance, key, assessmentNavState),
                instance: instance,
            } as IAssessmentInstanceRowData;
        });
        return assessmentInstances;
    }

    public getColumnConfigs(
        instancesMap: IDictionaryStringTo<IGeneratedAssessmentInstance>,
        assessmentNavState: IAssessmentNavState,
    ): IColumn[] {
        let allEnabled: boolean = true;
        const instanceKeys = this.getInstanceKeys(instancesMap, assessmentNavState);
        for (let keyIndex = 0; keyIndex < instanceKeys.length; keyIndex++) {
            const key = instanceKeys[keyIndex];
            const instance = instancesMap[key];
            if (!instance.testStepResults[assessmentNavState.selectedTestStep].isVisualizationEnabled) {
                allEnabled = false;
                break;
            }
        }

        return this.assessmentTableColumnConfigHandler.getColumnConfigs(assessmentNavState, allEnabled);
    }

    public createCapturedInstanceTableItems(
        instances: IUserCapturedInstance[],
        test: VisualizationType,
        step: string,
    ): ICapturedInstanceRowData[] {
        return instances.map((instance: IUserCapturedInstance) => {
            return {
                instance: instance,
                instanceActionButtons: this.renderInstanceActionButtons(instance, test, step),
            };
        });
    }

    public getColumnConfigsForCapturedInstance(): IColumn[] {
        return this.assessmentTableColumnConfigHandler.getColumnConfigsForCapturedInstances();
    }

    @autobind
    private renderChoiceGroup(instance: IGeneratedAssessmentInstance, key: string, assessmentNavState: IAssessmentNavState): JSX.Element {
        const step = assessmentNavState.selectedTestStep;
        const test = assessmentNavState.selectedTestType;
        return (
            <TestStatusChoiceGroup
                test={test}
                step={step}
                selector={key}
                status={instance.testStepResults[step].status}
                originalStatus={instance.testStepResults[step].originalStatus}
                onGroupChoiceChange={this.actionMessageCreator.changeManualTestStatus}
                onUndoClicked={this.actionMessageCreator.undoManualTestStatusChange}
            />
        );
    }

    @autobind
    private renderSelectedButton(
        instance: IGeneratedAssessmentInstance,
        key: string,
        assessmentNavState: IAssessmentNavState,
    ): JSX.Element {
        const step = assessmentNavState.selectedTestStep;
        const test = assessmentNavState.selectedTestType;

        return (
            <AssessmentInstanceSelectedButton
                test={test}
                step={step}
                selector={key}
                isVisualizationEnabled={instance.testStepResults[step].isVisualizationEnabled}
                isVisible={instance.testStepResults[step].isVisible}
                onSelected={this.actionMessageCreator.changeAssessmentVisualizationState}
            />
        );
    }

    @autobind
    private renderInstanceActionButtons(instance: IUserCapturedInstance, test: VisualizationType, step: string): JSX.Element {
        return (
            <AssessmentInstanceEditAndRemoveControl
                test={test}
                step={step}
                id={instance.id}
                description={instance.description}
                onRemove={this.actionMessageCreator.removeFailureInstance}
                onEdit={this.actionMessageCreator.editFailureInstance}
                assessmentsProvider={this.assessmentsProvider}
            />
        );
    }

    private getInstanceKeys(
        instancesMap: IDictionaryStringTo<IGeneratedAssessmentInstance>,
        assessmentNavState: IAssessmentNavState,
    ): string[] {
        return Object.keys(instancesMap).filter(key => {
            return instancesMap[key].testStepResults[assessmentNavState.selectedTestStep] != null;
        });
    }
}
