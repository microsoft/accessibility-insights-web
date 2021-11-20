// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Action } from 'common/flux/action';
import { VisualizationType } from 'common/types/visualization-type';
import {
    ToggleActionPayload,
    UpdateSelectedDetailsViewPayload,
    UpdateSelectedPivot,
} from './action-payloads';

export class VisualizationActions {
    public readonly enableVisualization = new Action<ToggleActionPayload>();
    public readonly enableVisualizationWithoutScan = new Action<ToggleActionPayload>();
    public readonly disableVisualization = new Action<VisualizationType>();
    public readonly disableAssessmentVisualizations = new Action<void>();
    public readonly rescanVisualization = new Action<VisualizationType>();

    public readonly updateFocusedInstance = new Action<string[]>();

    public readonly scanCompleted = new Action<void>();
    public readonly scrollRequested = new Action();
    public readonly getCurrentState = new Action();

    public readonly updateSelectedPivotChild = new Action<UpdateSelectedDetailsViewPayload>();
    public readonly updateSelectedPivot = new Action<UpdateSelectedPivot>();

    public readonly injectionCompleted = new Action();
    public readonly injectionStarted = new Action();
}
