// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import {
    ScanBasePayload,
    ScanCompletedPayload,
    ScanUpdatePayload,
} from '../../injected/analyzers/analyzer';
import {
    AddFailureInstancePayload,
    AddResultDescriptionPayload,
    AssessmentActionInstancePayload,
    ChangeInstanceSelectionPayload,
    ChangeInstanceStatusPayload,
    ChangeRequirementStatusPayload,
    EditFailureInstancePayload,
    ExpandTestNavPayload,
    RemoveFailureInstancePayload,
    SelectTestSubviewPayload,
    ToggleActionPayload,
    UpdateSelectedDetailsViewPayload,
    LoadAssessmentPayload,
} from './action-payloads';

export class AssessmentActions {
    public readonly selectTestSubview = new Action<SelectTestSubviewPayload>();
    public readonly expandTestNav = new Action<ExpandTestNavPayload>();
    public readonly collapseTestNav = new Action<null>();
    public readonly changeInstanceStatus = new Action<ChangeInstanceStatusPayload>();
    public readonly changeRequirementStatus = new Action<ChangeRequirementStatusPayload>();
    public readonly addFailureInstance = new Action<AddFailureInstancePayload>();
    public readonly addResultDescription = new Action<AddResultDescriptionPayload>();
    public readonly removeFailureInstance = new Action<RemoveFailureInstancePayload>();
    public readonly editFailureInstance = new Action<EditFailureInstancePayload>();
    public readonly passUnmarkedInstance = new Action<ToggleActionPayload>();
    public readonly changeAssessmentVisualizationState =
        new Action<ChangeInstanceSelectionPayload>();
    public readonly changeAssessmentVisualizationStateForAll =
        new Action<ChangeInstanceSelectionPayload>();
    public readonly undoInstanceStatusChange = new Action<AssessmentActionInstancePayload>();
    public readonly undoRequirementStatusChange = new Action<ChangeRequirementStatusPayload>();
    public readonly getCurrentState = new Action<void>();
    public readonly scanCompleted = new Action<ScanCompletedPayload<null>>();
    public readonly resetData = new Action<ToggleActionPayload>();
    public readonly resetAllAssessmentsData = new Action<number>();
    public readonly scanUpdate = new Action<ScanUpdatePayload>();
    public readonly trackingCompleted = new Action<ScanBasePayload>();
    public readonly updateSelectedPivotChild = new Action<UpdateSelectedDetailsViewPayload>();
    public readonly updateTargetTabId = new Action<number>();
    public readonly continuePreviousAssessment = new Action<number>();
    public readonly LoadAssessment = new Action<LoadAssessmentPayload>();
}
