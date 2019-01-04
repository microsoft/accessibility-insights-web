// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from '../../common/flux/action';
import { IScanBasePayload, IScanCompletedPayload, IScanUpdatePayload } from '../../injected/analyzers/ianalyzer';
import {
    IAddFailureInstancePayload,
    IAssessmentActionInstancePayload,
    IChangeAssessmentStepStatusPayload,
    IChangeInstanceSelectionPayload,
    IChangeInstanceStatusPayload,
    IEditFailureInstancePayload,
    IRemoveFailureInstancePayload,
    ISelectTestStepPayload,
    IToggleActionPayload,
    IUpdateVisibilityPayload,
    IUpdateSelectedDetailsViewPayload,
} from './action-payloads';

export class AssessmentActions {
    public readonly selectTestStep = new Action<ISelectTestStepPayload>();
    public readonly changeInstanceStatus = new Action<IChangeInstanceStatusPayload>();
    public readonly changeStepStatus = new Action<IChangeAssessmentStepStatusPayload>();
    public readonly addFailureInstance = new Action<IAddFailureInstancePayload>();
    public readonly removeFailureInstance = new Action<IRemoveFailureInstancePayload>();
    public readonly editFailureInstance = new Action<IEditFailureInstancePayload>();
    public readonly passUnmarkedInstance = new Action<IToggleActionPayload>();
    public readonly changeAssessmentVisualizationState = new Action<IChangeInstanceSelectionPayload>();
    public readonly changeAssessmentVisualizationStateForAll = new Action<IChangeInstanceSelectionPayload>();
    public readonly updateInstanceVisibility = new Action<IUpdateVisibilityPayload>();
    public readonly undoInstanceStatusChange = new Action<IAssessmentActionInstancePayload>();
    public readonly undoStepStatusChange = new Action<IChangeAssessmentStepStatusPayload>();
    public readonly getCurrentState = new Action<void>();
    public readonly scanCompleted = new Action<IScanCompletedPayload<null>>();
    public readonly resetData = new Action<IToggleActionPayload>();
    public readonly resetAllAssessmentsData = new Action<number>();
    public readonly scanUpdate = new Action<IScanUpdatePayload>();
    public readonly trackingCompleted = new Action<IScanBasePayload>();
    public readonly updateSelectedPivotChild = new Action<IUpdateSelectedDetailsViewPayload>();
    public readonly updateTargetTabId = new Action<number>();
    public readonly continuePreviousAssessment = new Action<number>();
}
