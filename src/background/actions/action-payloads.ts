// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DetailsViewTargetLinkClickTelemetryData, TelemetryData, ToggleTelemetryData } from '../../common/telemetry-events';
import * as TelemetryEvents from '../../common/telemetry-events';
import { DetailsViewPivotType } from '../../common/types/details-view-pivot-type';
import { VisualizationType } from '../../common/types/visualization-type';
import { LaunchPanelType } from '../../popup/scripts/components/popup-view';
import { ManualTestStatus } from './../../common/types/manual-test-status';
import { ITabStopEvent } from './../../injected/tab-stops-listener';

export interface BaseActionPayload {
    telemetry?: TelemetryData;
}

export interface ISelectTestStepPayload extends BaseActionPayload {
    selectedStep: string;
    selectedTest: VisualizationType;
}

export interface IUpdateInstanceVisibilityPayload extends IToggleActionPayload {
    selector: string;
    isVisible: boolean;
}

export interface IUpdateVisibilityPayload {
    payloadBatch: IUpdateInstanceVisibilityPayload[];
}

export interface IAssessmentToggleActionPayload extends IToggleActionPayload {
    step: string;
}

export interface IAssessmentActionInstancePayload extends IAssessmentToggleActionPayload {
    selector: string;
}

export interface IChangeAssessmentStepStatusPayload extends IAssessmentToggleActionPayload {
    status?: ManualTestStatus;
}

export interface IAddFailureInstancePayload extends IAssessmentToggleActionPayload {
    description: string;
}

export interface IRemoveFailureInstancePayload extends IAssessmentToggleActionPayload {
    id: string;
}

export interface IEditFailureInstancePayload extends IAddFailureInstancePayload {
    id: string;
}

export interface IChangeInstanceStatusPayload extends IAssessmentActionInstancePayload {
    status: ManualTestStatus;
}

export interface IChangeInstanceSelectionPayload extends IAssessmentActionInstancePayload {
    isVisualizationEnabled: boolean;
}

export interface IUpdateSelectedDetailsViewPayload extends BaseActionPayload {
    detailsViewType: VisualizationType;
    pivotType: DetailsViewPivotType;
}

export interface IUpdateSelectedPivot extends BaseActionPayload {
    pivotKey: DetailsViewPivotType;
}

export interface IPayloadWIthEventName extends BaseActionPayload {
    eventName;
}

export interface IOnDetailsViewOpenPayload extends IUpdateSelectedDetailsViewPayload {
    telemetry: TelemetryEvents.DetailsViewOpenTelemetryData;
}

export interface IOnDetailsViewPivotSelected extends BaseActionPayload {
    pivotKey: DetailsViewPivotType;
}

export interface IToggleActionPayload extends BaseActionPayload {
    test: VisualizationType;
}

export interface IVisualizationTogglePayload extends IToggleActionPayload {
    enabled: boolean;
    telemetry: ToggleTelemetryData;
}

export interface ISwitchToTargetTabPayLoad extends BaseActionPayload {
    telemetry: DetailsViewTargetLinkClickTelemetryData;
}

export interface IPageVisibilityChangeTabPayLoad extends BaseActionPayload {
    hidden: boolean;
}

export interface IAddTabbedElementPayload extends BaseActionPayload {
    tabbedElements: ITabStopEvent[];
}

export interface ISetBaseUrlPayload extends BaseActionPayload {
    url: string;
}

export interface ISetLaunchPanelState extends BaseActionPayload {
    launchPanelType: LaunchPanelType;
}

export interface IOnDevToolOpenPayload extends BaseActionPayload {
    status: boolean;
}

export interface IInspectElementPayload extends BaseActionPayload {
    target: string[];
}

export interface IInspectFrameUrlPayload extends BaseActionPayload {
    frameUrl: string;
}

export interface IToggleFeatureFlagPayload extends BaseActionPayload {
    featureFlagId: string;
    enabled: boolean;
}
export interface SetTelemetryStatePayload extends BaseActionPayload {
    enableTelemetry: boolean;
}
