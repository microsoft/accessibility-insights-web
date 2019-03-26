// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import * as React from 'react';

import { AssessmentsProvider } from '../../assessments/types/iassessments-provider';
import {
    AssessmentNavState,
    IGeneratedAssessmentInstance,
    IUserCapturedInstance,
} from '../../common/types/store-data/iassessment-result-data';
import { VisualizationType } from '../../common/types/visualization-type';
import { DictionaryStringTo } from '../../types/common-types';
import { AssessmentInstanceEditAndRemoveControl } from '../components/assessment-instance-edit-and-remove-control';
import { AssessmentInstanceSelectedButton } from '../components/assessment-instance-selected-button';
import { AssessmentInstanceRowData, CapturedInstanceRowData } from '../components/assessment-instance-table';
import { AssessmentTableColumnConfigHandler } from '../components/assessment-table-column-config-handler';
import { ManualTestStatus } from './../../common/types/manual-test-status';
import { DetailsViewActionMessageCreator } from './../actions/details-view-action-message-creator';
import { TestStatusChoiceGroup } from './../components/test-status-choice-group';

export class AssessmentInstanceTableHandler {
    private actionMessageCreator: DetailsViewActionMessageCreator;
    private assessmentTableColumnConfigHandler: AssessmentTableColumnConfigHandler;
    private assessmentsProvider: AssessmentsProvider;

    constructor(
        actionMessageCreator: DetailsViewActionMessageCreator,
        assessmentTableColumnConfigHandler: AssessmentTableColumnConfigHandler,
        assessmentsProvider: AssessmentsProvider,
    ) {
        this.actionMessageCreator = actionMessageCreator;
        this.assessmentTableColumnConfigHandler = assessmentTableColumnConfigHandler;
        this.assessmentsProvider = assessmentsProvider;
    }

    @autobind
    public changeRequirementStatus(status: ManualTestStatus, test: VisualizationType, step: string): void {
        this.actionMessageCreator.changeManualRequirementStatus(status, test, step);
    }

    @autobind
    public undoRequirementStatusChange(test: VisualizationType, step: string): void {
        this.actionMessageCreator.undoManualRequirementStatusChange(test, step);
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
        instancesMap: DictionaryStringTo<IGeneratedAssessmentInstance>,
        assessmentNavState: AssessmentNavState,
        hasVisualHelper: boolean,
    ): AssessmentInstanceRowData[] {
        const assessmentInstances = this.getInstanceKeys(instancesMap, assessmentNavState).map(key => {
            const instance = instancesMap[key];
            return {
                key: key,
                statusChoiceGroup: this.renderChoiceGroup(instance, key, assessmentNavState),
                visualizationButton: hasVisualHelper ? this.renderSelectedButton(instance, key, assessmentNavState) : null,
                instance: instance,
            } as AssessmentInstanceRowData;
        });
        return assessmentInstances;
    }

    public getColumnConfigs(
        instancesMap: DictionaryStringTo<IGeneratedAssessmentInstance>,
        assessmentNavState: AssessmentNavState,
        hasVisualHelper: boolean,
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

        return this.assessmentTableColumnConfigHandler.getColumnConfigs(assessmentNavState, allEnabled, hasVisualHelper);
    }

    public createCapturedInstanceTableItems(
        instances: IUserCapturedInstance[],
        test: VisualizationType,
        step: string,
    ): CapturedInstanceRowData[] {
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
    private renderChoiceGroup(instance: IGeneratedAssessmentInstance, key: string, assessmentNavState: AssessmentNavState): JSX.Element {
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
    private renderSelectedButton(instance: IGeneratedAssessmentInstance, key: string, assessmentNavState: AssessmentNavState): JSX.Element {
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
        instancesMap: DictionaryStringTo<IGeneratedAssessmentInstance>,
        assessmentNavState: AssessmentNavState,
    ): string[] {
        return Object.keys(instancesMap).filter(key => {
            return instancesMap[key].testStepResults[assessmentNavState.selectedTestStep] != null;
        });
    }
}
