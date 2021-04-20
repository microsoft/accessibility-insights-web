// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as TelemetryEvents from 'common/extension-telemetry-events';
import {
    BaseTelemetryData,
    TelemetryData,
    ToggleTelemetryData,
} from 'common/extension-telemetry-events';
import { Tab } from 'common/itab';
import { CreateIssueDetailsTextData } from 'common/types/create-issue-details-text-data';
import { DetailsViewPivotType } from 'common/types/details-view-pivot-type';
import { FailureInstanceData } from 'common/types/failure-instance-data';
import { ManualTestStatus } from 'common/types/manual-test-status';
import { ScanIncompleteWarningId } from 'common/types/scan-incomplete-warnings';
import { LaunchPanelType } from 'common/types/store-data/launch-panel-store-data';
import {
    PlatformData,
    ScreenshotData,
    TargetAppData,
    ToolData,
    UnifiedResult,
    UnifiedRule,
} from 'common/types/store-data/unified-data-interface';
import { IssueFilingServiceProperties } from 'common/types/store-data/user-configuration-store';
import { TabStopEvent } from 'common/types/tab-stop-event';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { VisualizationType } from 'common/types/visualization-type';
import { Rectangle } from 'electron';
import { WindowState } from 'electron/flux/types/window-state';

export interface BaseActionPayload {
    telemetry?: TelemetryData;
}

export interface SelectTestSubviewPayload extends BaseActionPayload {
    selectedTestSubview: string;
    selectedTest: VisualizationType;
}

export interface SelectGettingStartedPayload extends BaseActionPayload {
    selectedTest: VisualizationType;
}

export interface ExpandTestNavPayload extends BaseActionPayload {
    selectedTest: VisualizationType;
}

export interface AssessmentToggleActionPayload extends ToggleActionPayload {
    requirement: string;
}

export interface AssessmentActionInstancePayload extends AssessmentToggleActionPayload {
    selector: string;
}

export interface LoadAssessmentPayload extends BaseActionPayload {
    versionedAssessmentData: VersionedAssessmentData;
    tabId: number;
}
export interface ChangeRequirementStatusPayload extends AssessmentToggleActionPayload {
    status?: ManualTestStatus;
}

export interface AddFailureInstancePayload extends AssessmentToggleActionPayload {
    instanceData: FailureInstanceData;
}

export interface AddResultDescriptionPayload extends BaseActionPayload {
    description: string;
}

export interface RemoveFailureInstancePayload extends AssessmentToggleActionPayload {
    id: string;
}

export interface EditFailureInstancePayload extends AddFailureInstancePayload {
    id: string;
}

export interface ChangeInstanceStatusPayload extends AssessmentActionInstancePayload {
    status: ManualTestStatus;
}

export interface ChangeInstanceSelectionPayload extends AssessmentActionInstancePayload {
    isVisualizationEnabled: boolean;
}

export interface UpdateSelectedDetailsViewPayload extends BaseActionPayload {
    detailsViewType: VisualizationType;
    pivotType: DetailsViewPivotType;
}

export interface UpdateSelectedPivot extends BaseActionPayload {
    pivotKey: DetailsViewPivotType;
}

export interface PayloadWithEventName extends BaseActionPayload {
    eventName: string;
}

export interface OnDetailsViewOpenPayload extends UpdateSelectedDetailsViewPayload {
    telemetry: TelemetryEvents.DetailsViewOpenTelemetryData;
}

export interface OnDetailsViewPivotSelected extends BaseActionPayload {
    pivotKey: DetailsViewPivotType;
}

export interface ToggleActionPayload extends BaseActionPayload {
    test: VisualizationType;
}

export type RescanVisualizationPayload = ToggleActionPayload;

export interface VisualizationTogglePayload extends ToggleActionPayload {
    enabled: boolean;
    telemetry: ToggleTelemetryData;
}

export interface SwitchToTargetTabPayload extends BaseActionPayload {
    telemetry: BaseTelemetryData;
}

export interface PageVisibilityChangeTabPayload extends BaseActionPayload {
    hidden: boolean;
}

export interface AddTabbedElementPayload extends BaseActionPayload {
    tabbedElements: TabStopEvent[];
}

export interface SetLaunchPanelState extends BaseActionPayload {
    launchPanelType: LaunchPanelType;
}

export interface OnDevToolOpenPayload extends BaseActionPayload {
    status: boolean;
}

export interface InspectElementPayload extends BaseActionPayload {
    target: string[];
}

export interface InspectFrameUrlPayload extends BaseActionPayload {
    frameUrl: string;
}

export interface SetTelemetryStatePayload extends BaseActionPayload {
    enableTelemetry: boolean;
}

export interface SetHighContrastModePayload extends BaseActionPayload {
    enableHighContrast: boolean;
}

export interface SetNativeHighContrastModePayload extends BaseActionPayload {
    enableHighContrast: boolean;
}

export interface SetIssueFilingServicePayload extends BaseActionPayload {
    issueFilingServiceName: string;
}

export interface SaveIssueFilingSettingsPayload extends SetIssueFilingServicePayload {
    issueFilingSettings: IssueFilingServiceProperties;
}

export interface SetIssueFilingServicePropertyPayload extends BaseActionPayload {
    issueFilingServiceName: string;
    propertyName: string;
    propertyValue: string;
}

export interface FileIssuePayload extends BaseActionPayload {
    issueData: CreateIssueDetailsTextData;
    service: string;
    toolData: ToolData;
}

export interface SetAdbLocationPayload extends BaseActionPayload {
    adbLocation: string;
}

export interface UnifiedScanCompletedPayload extends BaseActionPayload {
    scanResult: UnifiedResult[];
    rules: UnifiedRule[];
    toolInfo: ToolData;
    targetAppInfo: TargetAppData;
    timestamp?: string;
    scanIncompleteWarnings: ScanIncompleteWarningId[];
    screenshotData?: ScreenshotData;
    platformInfo?: PlatformData;
    notificationText?: string;
}

export interface RuleExpandCollapsePayload extends BaseActionPayload {
    ruleId: string;
}

export interface CardSelectionPayload extends BaseActionPayload {
    ruleId: string;
    resultInstanceUid: string;
}

export interface PopupInitializedPayload extends BaseActionPayload {
    tab: Tab;
}

export interface SetAllUrlsPermissionStatePayload extends BaseActionPayload {
    hasAllUrlAndFilePermissions: boolean;
}

export type ExistingTabUpdatedPayload = BaseActionPayload & Tab;

export interface SaveWindowBoundsPayload extends BaseActionPayload {
    windowState: WindowState;
    windowBounds: Rectangle;
}
