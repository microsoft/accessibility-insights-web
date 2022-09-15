// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';
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
    OnDetailsViewInitializedPayload,
} from './action-payloads';

export class AssessmentActions {
    public readonly selectTestSubview = new AsyncAction<SelectTestSubviewPayload>();
    public readonly expandTestNav = new AsyncAction<ExpandTestNavPayload>();
    public readonly collapseTestNav = new AsyncAction<null>();
    public readonly changeInstanceStatus = new AsyncAction<ChangeInstanceStatusPayload>();
    public readonly changeRequirementStatus = new AsyncAction<ChangeRequirementStatusPayload>();
    public readonly addFailureInstance = new AsyncAction<AddFailureInstancePayload>();
    public readonly addResultDescription = new AsyncAction<AddResultDescriptionPayload>();
    public readonly removeFailureInstance = new AsyncAction<RemoveFailureInstancePayload>();
    public readonly editFailureInstance = new AsyncAction<EditFailureInstancePayload>();
    public readonly passUnmarkedInstance = new AsyncAction<ToggleActionPayload>();
    public readonly changeAssessmentVisualizationState =
        new AsyncAction<ChangeInstanceSelectionPayload>();
    public readonly changeAssessmentVisualizationStateForAll =
        new AsyncAction<ChangeInstanceSelectionPayload>();
    public readonly undoInstanceStatusChange = new AsyncAction<AssessmentActionInstancePayload>();
    public readonly undoRequirementStatusChange = new AsyncAction<ChangeRequirementStatusPayload>();
    public readonly getCurrentState = new AsyncAction<void>();
    public readonly scanCompleted = new AsyncAction<ScanCompletedPayload<null>>();
    public readonly resetData = new AsyncAction<ToggleActionPayload>();
    public readonly resetAllAssessmentsData = new AsyncAction<number>();
    public readonly scanUpdate = new AsyncAction<ScanUpdatePayload>();
    public readonly trackingCompleted = new AsyncAction<ScanBasePayload>();
    public readonly updateSelectedPivotChild = new AsyncAction<UpdateSelectedDetailsViewPayload>();
    public readonly updateTargetTabId = new AsyncAction<number>();
    public readonly continuePreviousAssessment = new AsyncAction<number>();
    public readonly loadAssessment = new AsyncAction<LoadAssessmentPayload>();
    public readonly updateDetailsViewId = new AsyncAction<OnDetailsViewInitializedPayload>();
}
