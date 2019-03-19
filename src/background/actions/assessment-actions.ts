// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from '../../common/flux/action';
import { IScanBasePayload, IScanCompletedPayload, IScanUpdatePayload } from '../../injected/analyzers/analyzer';
import {
    AddFailureInstancePayload,
    AssessmentActionInstancePayload,
    ChangeAssessmentStepStatusPayload,
    ChangeInstanceSelectionPayload,
    ChangeInstanceStatusPayload,
    EditFailureInstancePayload,
    RemoveFailureInstancePayload,
    SelectTestStepPayload,
    ToggleActionPayload,
    UpdateSelectedDetailsViewPayload,
    UpdateVisibilityPayload,
} from './action-payloads';

export class AssessmentActions {
    public readonly selectTestStep = new Action<SelectTestStepPayload>();
    public readonly changeInstanceStatus = new Action<ChangeInstanceStatusPayload>();
    public readonly changeStepStatus = new Action<ChangeAssessmentStepStatusPayload>();
    public readonly addFailureInstance = new Action<AddFailureInstancePayload>();
    public readonly removeFailureInstance = new Action<RemoveFailureInstancePayload>();
    public readonly editFailureInstance = new Action<EditFailureInstancePayload>();
    public readonly passUnmarkedInstance = new Action<ToggleActionPayload>();
    public readonly changeAssessmentVisualizationState = new Action<ChangeInstanceSelectionPayload>();
    public readonly changeAssessmentVisualizationStateForAll = new Action<ChangeInstanceSelectionPayload>();
    public readonly updateInstanceVisibility = new Action<UpdateVisibilityPayload>();
    public readonly undoInstanceStatusChange = new Action<AssessmentActionInstancePayload>();
    public readonly undoStepStatusChange = new Action<ChangeAssessmentStepStatusPayload>();
    public readonly getCurrentState = new Action<void>();
    public readonly scanCompleted = new Action<IScanCompletedPayload<null>>();
    public readonly resetData = new Action<ToggleActionPayload>();
    public readonly resetAllAssessmentsData = new Action<number>();
    public readonly scanUpdate = new Action<IScanUpdatePayload>();
    public readonly trackingCompleted = new Action<IScanBasePayload>();
    public readonly updateSelectedPivotChild = new Action<UpdateSelectedDetailsViewPayload>();
    public readonly updateTargetTabId = new Action<number>();
    public readonly continuePreviousAssessment = new Action<number>();
}
