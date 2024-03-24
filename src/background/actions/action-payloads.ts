// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as TelemetryEvents from 'common/extension-telemetry-events';
import {
    BaseTelemetryData,
    TelemetryData,
    ToggleTelemetryData,
} from 'common/extension-telemetry-events';
import { CreateIssueDetailsTextData } from 'common/types/create-issue-details-text-data';
import { FailureInstanceData } from 'common/types/failure-instance-data';
import { AssessmentStoreData } from 'common/types/store-data/assessment-result-data';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { Tab } from 'common/types/store-data/itab';
import { LaunchPanelType } from 'common/types/store-data/launch-panel-store-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { ScanIncompleteWarningId } from 'common/types/store-data/scan-incomplete-warnings';
import { TabStopEvent } from 'common/types/store-data/tab-stop-event';
import {
    PlatformData,
    ScreenshotData,
    TargetAppData,
    ToolData,
    UnifiedResult,
    UnifiedRule,
} from 'common/types/store-data/unified-data-interface';
import { IssueFilingServiceProperties } from 'common/types/store-data/user-configuration-store';
import { TabStopRequirementStatus } from 'common/types/store-data/visualization-scan-result-data';
import { VersionedAssessmentData } from 'common/types/versioned-assessment-data';
import { VisualizationType } from 'common/types/visualization-type';
import { Target } from 'scanner/iruleresults';
import { TabStopRequirementId } from 'types/tab-stop-requirement-info';

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
    detailsViewId: string | undefined;
}

export interface TransferAssessmentPayload extends BaseActionPayload {
    assessmentData: AssessmentStoreData;
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
    detailsViewType: VisualizationType | null;
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

export interface OnDetailsViewInitializedPayload extends BaseActionPayload {
    detailsViewId: string;
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

export interface ResetTabStopRequirementStatusPayload extends BaseActionPayload {
    requirementId: TabStopRequirementId;
}
export interface UpdateTabStopRequirementStatusPayload
    extends ResetTabStopRequirementStatusPayload {
    status: TabStopRequirementStatus;
}
export interface RemoveTabStopInstancePayload extends BaseActionPayload {
    id: string;
    requirementId: TabStopRequirementId;
}

export interface ToggleTabStopRequirementExpandPayload extends BaseActionPayload {
    requirementId: TabStopRequirementId;
}
export interface UpdateTabbingCompletedPayload extends BaseActionPayload {
    tabbingCompleted: boolean;
}
export interface UpdateNeedToCollectTabbingResultsPayload extends BaseActionPayload {
    needToCollectTabbingResults: boolean;
}

export interface AddTabStopInstancePayload extends BaseActionPayload {
    requirementId: TabStopRequirementId;
    description: string;
    selector?: string[];
    html?: string;
}

export interface AddTabStopInstanceArrayPayload {
    results: AddTabStopInstancePayload[];
}

export interface UpdateTabStopInstancePayload extends AddTabStopInstancePayload {
    id: string;
}

export interface SetLaunchPanelState extends BaseActionPayload {
    launchPanelType: LaunchPanelType;
}

export interface InspectElementPayload extends BaseActionPayload {
    target: Target;
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

export interface AssessmentSingleRuleExpandCollapsePayload extends RuleExpandCollapsePayload {
    testKey: string;
}

export interface AssessmentExpandCollapsePayload extends BaseActionPayload {
    testKey: string;
}

export interface CardSelectionPayload extends BaseActionPayload {
    ruleId: string;
    resultInstanceUid: string;
}

export interface AssessmentCardSelectionPayload extends CardSelectionPayload {
    testKey: string;
}

export interface PopupInitializedPayload extends BaseActionPayload {
    tab: Tab;
}

export interface SetAllUrlsPermissionStatePayload extends BaseActionPayload {
    hasAllUrlAndFilePermissions: boolean;
}

export type ExistingTabUpdatedPayload = BaseActionPayload & Tab;

export interface AutoDetectedFailuresDialogStatePayload extends BaseActionPayload {
    enabled: boolean;
}

export interface SaveAssessmentDialogStatePayload extends BaseActionPayload {
    enabled: boolean;
}

export interface InjectionFailedPayload extends BaseActionPayload {
    failedAttempts: number;
    shouldRetry: boolean;
}

export interface AssessmentCardToggleVisualHelperPayload extends BaseActionPayload {
    testKey: string;
}

export interface AssessmentResetFocusedIdentifierPayload extends BaseActionPayload {
    testKey: string;
}

export interface AssessmentNavigateToNewCardsViewPayload extends BaseActionPayload {
    testKey: string;
}
export interface RequirementToggleActionPayload extends ToggleActionPayload {
    requirement: string | undefined;
}
