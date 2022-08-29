// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AsyncAction } from 'common/flux/async-action';
import { VisualizationType } from 'common/types/visualization-type';
import {
    ToggleActionPayload,
    UpdateSelectedDetailsViewPayload,
    UpdateSelectedPivot,
} from './action-payloads';

export class VisualizationActions {
    public readonly enableVisualization = new AsyncAction<ToggleActionPayload>();
    public readonly enableVisualizationWithoutScan = new AsyncAction<ToggleActionPayload>();
    public readonly disableVisualization = new AsyncAction<VisualizationType>();
    public readonly disableAssessmentVisualizations = new AsyncAction<void>();
    public readonly resetDataForVisualization = new AsyncAction<VisualizationType>();

    public readonly updateFocusedInstance = new AsyncAction<string[]>();

    public readonly scanCompleted = new AsyncAction<void>();
    public readonly scrollRequested = new AsyncAction();
    public readonly getCurrentState = new AsyncAction();

    public readonly updateSelectedPivotChild = new AsyncAction<UpdateSelectedDetailsViewPayload>();
    public readonly updateSelectedPivot = new AsyncAction<UpdateSelectedPivot>();

    public readonly injectionCompleted = new AsyncAction();
    public readonly injectionStarted = new AsyncAction();
}
