// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import * as React from 'react';

import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { ManualTestStatus } from '../../common/types/manual-test-status';
import {
    AssessmentNavState,
    GeneratedAssessmentInstance,
    UserCapturedInstance,
} from '../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../common/types/store-data/feature-flag-store-data';
import { PathSnippetStoreData } from '../../common/types/store-data/path-snippet-store-data';
import { VisualizationType } from '../../common/types/visualization-type';
import { DictionaryStringTo } from '../../types/common-types';
import { DetailsViewActionMessageCreator } from '../actions/details-view-action-message-creator';
import { AssessmentInstanceEditAndRemoveControl } from '../components/assessment-instance-edit-and-remove-control';
import { AssessmentInstanceSelectedButton } from '../components/assessment-instance-selected-button';
import { AssessmentInstanceRowData, CapturedInstanceRowData } from '../components/assessment-instance-table';
import { AssessmentTableColumnConfigHandler } from '../components/assessment-table-column-config-handler';
import { FailureInstanceData } from '../components/failure-instance-panel-control';
import { TestStatusChoiceGroup } from '../components/test-status-choice-group';

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

    public changeRequirementStatus = (status: ManualTestStatus, test: VisualizationType, step: string): void => {
        this.actionMessageCreator.changeManualRequirementStatus(status, test, step);
    };

    public undoRequirementStatusChange = (test: VisualizationType, step: string): void => {
        this.actionMessageCreator.undoManualRequirementStatusChange(test, step);
    };

    public addFailureInstance = (instanceData: FailureInstanceData, test: VisualizationType, step: string): void => {
        this.actionMessageCreator.addFailureInstance(instanceData, test, step);
    };

    public addPathForValidation = (path: string): void => {
        this.actionMessageCreator.addPathForValidation(path);
    };

    public clearPathSnippetData = (): void => {
        this.actionMessageCreator.clearPathSnippetData();
    };

    public passUnmarkedInstances(test: VisualizationType, step: string): void {
        this.actionMessageCreator.passUnmarkedInstances(test, step);
    }

    public updateFocusedTarget(target: string[]): void {
        this.actionMessageCreator.updateFocusedInstanceTarget(target);
    }

    public createAssessmentInstanceTableItems(
        instancesMap: DictionaryStringTo<GeneratedAssessmentInstance>,
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
        instancesMap: DictionaryStringTo<GeneratedAssessmentInstance>,
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
        instances: UserCapturedInstance[],
        test: VisualizationType,
        step: string,
        featureFlagStoreData: FeatureFlagStoreData,
        pathSnippetStoreData: PathSnippetStoreData,
    ): CapturedInstanceRowData[] {
        return instances.map((instance: UserCapturedInstance) => {
            return {
                instance: instance,
                instanceActionButtons: this.renderInstanceActionButtons(instance, test, step, featureFlagStoreData, pathSnippetStoreData),
            };
        });
    }

    public getColumnConfigsForCapturedInstance(): IColumn[] {
        return this.assessmentTableColumnConfigHandler.getColumnConfigsForCapturedInstances();
    }

    private renderChoiceGroup = (
        instance: GeneratedAssessmentInstance,
        key: string,
        assessmentNavState: AssessmentNavState,
    ): JSX.Element => {
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
    };

    private renderSelectedButton = (
        instance: GeneratedAssessmentInstance,
        key: string,
        assessmentNavState: AssessmentNavState,
    ): JSX.Element => {
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
    };

    private renderInstanceActionButtons = (
        instance: UserCapturedInstance,
        test: VisualizationType,
        step: string,
        featureFlagStoreData: FeatureFlagStoreData,
        pathSnippetStoreData: PathSnippetStoreData,
    ): JSX.Element => {
        const currentInstance = {
            failureDescription: instance.description,
            path: pathSnippetStoreData.path || instance.selector,
            snippet: pathSnippetStoreData.snippet || instance.html,
        };
        return (
            <AssessmentInstanceEditAndRemoveControl
                test={test}
                step={step}
                id={instance.id}
                currentInstance={currentInstance}
                onRemove={this.actionMessageCreator.removeFailureInstance}
                onEdit={this.actionMessageCreator.editFailureInstance}
                onClearPathSnippetData={this.actionMessageCreator.clearPathSnippetData}
                onAddPath={this.actionMessageCreator.addPathForValidation}
                assessmentsProvider={this.assessmentsProvider}
                storeData={{
                    featureFlagStoreData: featureFlagStoreData,
                }}
            />
        );
    };

    private getInstanceKeys(
        instancesMap: DictionaryStringTo<GeneratedAssessmentInstance>,
        assessmentNavState: AssessmentNavState,
    ): string[] {
        return Object.keys(instancesMap).filter(key => {
            return instancesMap[key].testStepResults[assessmentNavState.selectedTestStep] != null;
        });
    }
}
