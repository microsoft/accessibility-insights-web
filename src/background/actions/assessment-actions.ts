// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SyncAction } from 'common/flux/sync-action';
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
    public readonly selectTestSubview = new SyncAction<SelectTestSubviewPayload>();
    public readonly expandTestNav = new SyncAction<ExpandTestNavPayload>();
    public readonly collapseTestNav = new SyncAction<null>();
    public readonly changeInstanceStatus = new SyncAction<ChangeInstanceStatusPayload>();
    public readonly changeRequirementStatus = new SyncAction<ChangeRequirementStatusPayload>();
    public readonly addFailureInstance = new SyncAction<AddFailureInstancePayload>();
    public readonly addResultDescription = new SyncAction<AddResultDescriptionPayload>();
    public readonly removeFailureInstance = new SyncAction<RemoveFailureInstancePayload>();
    public readonly editFailureInstance = new SyncAction<EditFailureInstancePayload>();
    public readonly passUnmarkedInstance = new SyncAction<ToggleActionPayload>();
    public readonly changeAssessmentVisualizationState =
        new SyncAction<ChangeInstanceSelectionPayload>();
    public readonly changeAssessmentVisualizationStateForAll =
        new SyncAction<ChangeInstanceSelectionPayload>();
    public readonly undoInstanceStatusChange = new SyncAction<AssessmentActionInstancePayload>();
    public readonly undoRequirementStatusChange = new SyncAction<ChangeRequirementStatusPayload>();
    public readonly getCurrentState = new SyncAction<void>();
    public readonly scanCompleted = new SyncAction<ScanCompletedPayload<null>>();
    public readonly resetData = new SyncAction<ToggleActionPayload>();
    public readonly resetAllAssessmentsData = new SyncAction<number>();
    public readonly scanUpdate = new SyncAction<ScanUpdatePayload>();
    public readonly trackingCompleted = new SyncAction<ScanBasePayload>();
    public readonly updateSelectedPivotChild = new SyncAction<UpdateSelectedDetailsViewPayload>();
    public readonly updateTargetTabId = new SyncAction<number>();
    public readonly continuePreviousAssessment = new SyncAction<number>();
    public readonly LoadAssessment = new SyncAction<LoadAssessmentPayload>();
    public readonly updateDetailsViewId = new SyncAction<OnDetailsViewInitializedPayload>();
}
