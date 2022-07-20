// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';
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
