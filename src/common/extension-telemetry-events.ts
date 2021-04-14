// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanIncompleteWarningId } from 'common/types/scan-incomplete-warnings';
import { SingleElementSelector } from './types/store-data/scoping-store-data';

export const POPUP_INITIALIZED: string = 'PopupInitialized';
export const LAUNCH_PANEL_OPEN: string = 'LaunchPanelOpen';
export const AUTOMATED_CHECKS_TOGGLE: string = 'IssuesToggled';
export const LANDMARKS_TOGGLE: string = 'LandmarksToggled';
export const TABSTOPS_TOGGLE: string = 'TabStopsToggled';
export const TABSTOPS_RECORDING_COMPLETE: string = 'TabStopsRecordingComplete';
export const COLOR_TOGGLE: string = 'ColorToggled';
export const HEADINGS_TOGGLE: string = 'HeadingsToggled';
export const SHORTCUT_MODIFIED: string = 'ShortcutModified';
export const SHORTCUT_CONFIGURE_OPEN = 'ShortcutConfigureTabOpen';
export const DETAILS_VIEW_OPEN: string = 'DetailsViewOpened';
export const PIVOT_CHILD_SELECTED: string = 'PivotChildSelected';
export const TUTORIAL_OPEN: string = 'TutorialOpen';
export const SWITCH_BACK_TO_TARGET: string = 'SwitchBackToTarget';
export const DETAILS_VIEW_PIVOT_ACTIVATED: string = 'DetailsViewPivotActivated';
export const INSPECT_OPEN: string = 'InspectOpen';
export const COPY_ISSUE_DETAILS: string = 'CopyIssueDetails';
export const FILE_ISSUE_CLICK: string = 'FileIssueClick';
export const SELECT_REQUIREMENT: string = 'selectRequirement';
export const SELECT_NEXT_REQUIREMENT: string = 'selectNextRequirement';
export const SELECT_GETTING_STARTED: string = 'selectGettingStarted';
export const START_OVER_TEST: string = 'startOverTest';
export const CANCEL_START_OVER_TEST: string = 'cancelStartOverTest';
export const START_OVER_ASSESSMENT: string = 'startOverAssessment';
export const CANCEL_START_OVER_ASSESSMENT: string = 'cancelStartOverAssessment';
export const ADD_FAILURE_INSTANCE: string = 'addFailureInstance';
export const REMOVE_FAILURE_INSTANCE: string = 'removeFailureInstance';
export const EDIT_FAILURE_INSTANCE: string = 'editFailureInstance';
export const PASS_UNMARKED_INSTANCES: string = 'passUnmarkedInstances';
export const CONTINUE_PREVIOUS_ASSESSMENT: string = 'ContinuePreviousAssessment';
export const LOAD_ASSESSMENT: string = 'loadAssessment';
export const ENABLE_VISUAL_HELPER: string = 'enableVisualHelper';
export const UNDO_TEST_STATUS_CHANGE: string = 'undoTestStatusChange';
export const UNDO_REQUIREMENT_STATUS_CHANGE: string = 'undoRequirementStatusChange';
export const CHANGE_INSTANCE_STATUS: string = 'changeInstanceStatus';
export const CHANGE_ASSESSMENT_VISUALIZATION_STATUS: string = 'changeAssessmentVisualizationState';
export const CHANGE_ASSESSMENT_VISUALIZATION_STATUS_FOR_ALL: string =
    'changeAssessmentVisualizationStateForAll';
export const DISABLE_VISUAL_HELPER: string = 'disableVisualHelper';
export const CHANGE_OVERALL_REQUIREMENT_STATUS: string = 'changeOverallRequirementStatus';
export const PREVIEW_FEATURES_CLOSE: string = 'PreviewFeaturesClose';
export const PREVIEW_FEATURES_OPEN: string = 'PreviewFeaturesOpen';
export const PREVIEW_FEATURES_TOGGLE: string = 'PreviewFeaturesToggle';
export const SETTINGS_PANEL_OPEN: string = 'SettingsPanelOpen';
export const SETTINGS_PANEL_CLOSE: string = 'SettingsPanelClose';
export const SCOPING_OPEN: string = 'ScopingOpen';
export const SCOPING_CLOSE: string = 'ScopingClose';
export const ISSUES_DIALOG_OPENED: string = 'IssuesDialogOpened';
export const CHANGE_INSPECT_MODE: string = 'changeInspectMode';
export const EXPORT_RESULTS: string = 'ExportResults';
export const ASSESSMENT_SCAN_COMPLETED: string = 'AssessmentScanCompleted';
export const ADHOC_SCAN_COMPLETED: string = 'AdhocScanCompleted';
export const CONTENT_PANEL_OPENED: string = 'contentPanelOpened';
export const CONTENT_PANEL_CLOSED: string = 'contentPanelClosed';
export const CONTENT_PAGE_OPENED: string = 'contentPageOpened';
export const CONTENT_HYPERLINK_OPENED: string = 'contentHyperLinkOpened';
export const CARD_SELECTION_TOGGLED: string = 'cardSelectionToggled';
export const RULE_EXPANSION_TOGGLED: string = 'ruleExpansionToggled';
export const VISUAL_HELPER_TOGGLED: string = 'visualHelperToggled';
export const ALL_RULES_EXPANDED: string = 'allRulesExpanded';
export const ALL_RULES_COLLAPSED: string = 'allRulesCollapsed';
export const RESCAN_VISUALIZATION: string = 'rescanVisualization';
export const EXISTING_TAB_URL_UPDATED: string = 'existingTabUrlUpdated';
export const SCAN_INCOMPLETE_WARNINGS: string = 'scanIncompleteWarnings';
export const ALL_URLS_PERMISSION_UPDATED: string = 'allUrlsPermissionUpdated';
export const LEFT_NAV_PANEL_EXPANDED: string = 'leftNavPanelExpanded';
export const NEEDS_REVIEW_TOGGLE: string = 'NeedsReviewToggled';
export const NAVIGATE_TO_NEW_CARDS_VIEW: string = 'NavigateToNewCardsView';

export const TriggeredByNotApplicable: TriggeredBy = 'N/A';
export type TriggeredBy = 'mouseclick' | 'keypress' | 'shortcut' | 'N/A';

export type ReportExportFormat = 'Assessment' | 'AutomatedChecks';

export enum TelemetryEventSource {
    LaunchPad,
    LaunchPadFastPass,
    LaunchPadAllTests,
    LaunchPadAssessment,
    AdHocTools,
    HamburgerMenu,
    DetailsView,
    FastPassBanner,
    OldLaunchPanel,
    ShortcutCommand,
    IssueDetailsDialog,
    NewBugButton,
    TargetPage,
    ContentPage,
    ElectronDeviceConnect,
    ElectronResultsView,
}

export type BaseTelemetryData = {
    source: TelemetryEventSource;
    triggeredBy: TriggeredBy;
};

export type ToggleTelemetryData = {
    enabled: boolean;
} & BaseTelemetryData;

export type FeatureFlagToggleTelemetryData = {
    enabled: boolean;
    featureFlagId: string;
} & BaseTelemetryData;

export type ExportResultsTelemetryData = {
    exportResultsType: string;
    exportResultsData: number;
} & BaseTelemetryData;

export type DetailsViewOpenTelemetryData = {
    selectedTest: string;
} & BaseTelemetryData;

export type DetailsViewOpenedTelemetryData = {
    selectedDetailsViewPivot: string;
} & BaseTelemetryData;

export type SettingsOpenTelemetryData = {
    sourceItem: SettingsOpenSourceItem;
} & BaseTelemetryData;
export type SettingsOpenSourceItem = 'fileIssueSettingsPrompt' | 'menu';

export type FileIssueClickTelemetryData = {
    service: string;
} & BaseTelemetryData;

export type RequirementSelectTelemetryData = {
    selectedTest: string;
    selectedRequirement: string;
} & BaseTelemetryData;

export type SelectGettingStartedTelemetryData = {
    selectedTest: string;
} & BaseTelemetryData;

export type RequirementStatusTelemetryData = {
    passed: boolean;
    numInstances: number;
} & RequirementSelectTelemetryData;

export type DetailsViewPivotSelectedTelemetryData = {
    pivotKey: string;
} & BaseTelemetryData;

export type AssessmentTelemetryData = {
    selectedTest: string;
} & BaseTelemetryData;

export type RequirementActionTelemetryData = {
    selectedRequirement: string;
} & BaseTelemetryData;

export type ModifiedCommandsTelemetryData = {
    modifiedCommands: string;
};

export type InspectTelemetryData = {
    frameUrl?: string;
    target?: string[];
} & BaseTelemetryData;

export type ScopingTelemetryData = {
    inputType: string;
} & BaseTelemetryData;

export type AssessmentRequirementScanTelemetryData = {
    requirementName?: string;
} & RuleAnalyzerScanTelemetryData;

export type RuleAnalyzerScanTelemetryData = {
    scanDuration: number;
    NumberOfElementsScanned: number;
    include?: SingleElementSelector[];
    exclude?: SingleElementSelector[];
    testName: string;
};

export type IssuesAnalyzerScanTelemetryData = {
    passedRuleResults: string;
    failedRuleResults: string;
} & RuleAnalyzerScanTelemetryData;

export type NeedsReviewAnalyzerScanTelemetryData = {
    passedRuleResults: string;
    failedRuleResults: string;
    incompleteRuleResults: string;
} & RuleAnalyzerScanTelemetryData;

export type PortTelemetryData = {
    port: number;
};

export type AndroidScanCompletedTelemetryData = {
    port: number;
    scanDuration: number;
} & InstanceCount;

export type InstanceCount = {
    PASS: {
        [ruleId: string]: number;
    };
    FAIL: {
        [ruleId: string]: number;
    };
    INCOMPLETE: {
        [ruleId: string]: number;
    };
};

export type AndroidScanFailedTelemetryData = {
    port: number;
    scanDuration: number;
};

export type SetAllUrlsPermissionTelemetryData = {
    permissionState: boolean;
} & BaseTelemetryData;

export type ScanIncompleteWarningsTelemetryData = {
    scanIncompleteWarnings: ScanIncompleteWarningId[];
};

export type DeviceFocusKeyEventTelemetryData = {
    keyEventCode: number;
};

export type TelemetryData =
    | BaseTelemetryData
    | ToggleTelemetryData
    | FeatureFlagToggleTelemetryData
    | ExportResultsTelemetryData
    | DetailsViewOpenTelemetryData
    | DetailsViewOpenedTelemetryData
    | SettingsOpenTelemetryData
    | FileIssueClickTelemetryData
    | DetailsViewPivotSelectedTelemetryData
    | RequirementSelectTelemetryData
    | ModifiedCommandsTelemetryData
    | InspectTelemetryData
    | AssessmentTelemetryData
    | ScopingTelemetryData
    | RequirementActionTelemetryData
    | RuleAnalyzerScanTelemetryData
    | IssuesAnalyzerScanTelemetryData
    | AssessmentRequirementScanTelemetryData
    | RequirementStatusTelemetryData
    | PortTelemetryData
    | AndroidScanCompletedTelemetryData
    | AndroidScanFailedTelemetryData
    | DeviceFocusKeyEventTelemetryData
    | ScanIncompleteWarningsTelemetryData
    | SetAllUrlsPermissionTelemetryData;
