// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SyncAction } from 'common/flux/sync-action';
import { VisualizationType } from 'common/types/visualization-type';
import {
    ToggleActionPayload,
    UpdateSelectedDetailsViewPayload,
    UpdateSelectedPivot,
} from './action-payloads';

export class VisualizationActions {
    public readonly enableVisualization = new SyncAction<ToggleActionPayload>();
    public readonly enableVisualizationWithoutScan = new SyncAction<ToggleActionPayload>();
    public readonly disableVisualization = new SyncAction<VisualizationType>();
    public readonly disableAssessmentVisualizations = new SyncAction<void>();
    public readonly resetDataForVisualization = new SyncAction<VisualizationType>();

    public readonly updateFocusedInstance = new SyncAction<string[]>();

    public readonly scanCompleted = new SyncAction<void>();
    public readonly scrollRequested = new SyncAction();
    public readonly getCurrentState = new SyncAction();

    public readonly updateSelectedPivotChild = new SyncAction<UpdateSelectedDetailsViewPayload>();
    public readonly updateSelectedPivot = new SyncAction<UpdateSelectedPivot>();

    public readonly injectionCompleted = new SyncAction();
    public readonly injectionStarted = new SyncAction();
}
