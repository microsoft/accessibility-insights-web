// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ISingleElementSelector } from './types/store-data/scoping-store-data';

export const POPUP_INITIALIZED: string = 'PopupInitialized';
export const LAUNCH_PANEL_OPEN: string = 'LaunchPanelOpen';
export const SCAN_HEADINGS_ASSESSMENT: string = 'ScanHeadingsAssessment';
export const AUTOMATED_CHECKS_TOGGLE: string = 'IssuesToggled';
export const LANDMARKS_TOGGLE: string = 'LandmarksToggled';
export const TABSTOPS_TOGGLE: string = 'TabStopsToggled';
export const TABSTOPS_RECORDING_COMPLETE: string = 'TabStopsRecordingComplete';
export const COLOR_TOGGLE: string = 'ColorToggled';
export const HEADINGS_TOGGLE: string = 'HeadingsToggled';
export const FEEDBACK_SUBMITTED: string = 'FeedbackSubmitted';
export const SHORTCUT_MODIFIED: string = 'ShortcutModified';
export const SHORTCUT_CONFIGURE_OPEN = 'ShortcutConfigureTabOpen';
export const DETAILS_VIEW_OPEN: string = 'DetailsViewOpened';
export const PIVOT_CHILD_SELECTED: string = 'PivotChildSelected';
export const TUTORIAL_OPEN: string = 'TutorialOpen';
export const SWITCH_BACK_TO_TARGET: string = 'SwitchBackToTarget';
export const DETAILS_VIEW_PIVOT_ACTIVATED: string = 'DetailsViewPivotActivated';
export const FRAME_URL_SET: string = 'FrameUrlSet';
export const INSPECT_OPEN: string = 'InspectOpen';
export const COPY_ISSUE_DETAILS: string = 'CopyIssueDetails';
export const SELECT_TEST_STEP: string = 'selectTestStep';
export const START_OVER_ASSESSMENT: string = 'startOverAssessment';
export const CANCEL_START_OVER_ASSESSMENT: string = 'cancelStartOverAssessment';
export const START_OVER_ALL_ASSESSMENTS: string = 'startOverAllAssessments';
export const CANCEL_START_OVER_ALL_ASSESSMENTS: string = 'cancelStartOverAllAssessments';
export const ADD_FAILURE_INSTANCE: string = 'addFailureInstance';
export const REMOVE_FAILURE_INSTANCE: string = 'removeFailureInstance';
export const EDIT_FAILURE_INSTANCE: string = 'editFailureInstance';
export const PASS_UNMARKED_INSTANCES: string = 'passUnmarkedInstances';
export const CONTINUE_PREVIOUS_ASSESSMENT: string = 'ContinuePreviousAssessment';
export const ENABLE_VISUAL_HELPER: string = 'enableVisualHelper';
export const UNDO_ASSESSMENT_STATUS_CHANGE: string = 'undoAssessmentStatusChange';
export const UNDO_ASSESSMENT_STEP_STATUS_CHANGE: string = 'undoAssessmentStatusStepChange';
export const CHANGE_INSTANCE_STATUS: string = 'changeInstanceStatus';
export const CHANGE_ASSESSMENT_VISUALIZATION_STATUS: string = 'changeAssessmentVisualizationState';
export const CHANGE_ASSESSMENT_VISUALIZATION_STATUS_FOR_ALL: string = 'changeAssessmentVisualizationStateForAll';
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

export const TriggeredByNotApplicable: string = 'N/A';

export type ExportResultType = 'Assessment' | 'AutomatedChecks';

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
}

export interface BaseTelemetryData {
    url?: string;
    source: TelemetryEventSource;
    triggeredBy?: string;
}

export interface FeedbackTelemetryData extends BaseTelemetryData {
    satisfactionLevel: number;
    feedback: string;
}

export interface ToggleTelemetryData extends BaseTelemetryData {
    enabled?: boolean;
}

export interface FeatureFlagToggleTelemetryData extends ToggleTelemetryData {
    featureFlagId: string;
}

export interface ExportResultsTelemetryData extends BaseTelemetryData {
    exportResultsType: string;
    exportResultsData: number;
}

export interface DetailsViewOpenTelemetryData extends BaseTelemetryData {
    detailsView: string;
}

export interface DetailsViewOpenedTelemetryData extends BaseTelemetryData {
    selectedDetailsViewPivot: string;
}

export interface TestStepSelectTelemetryData extends BaseTelemetryData {
    selectedTest: string;
    selectedStep: string;
}

export interface RequirementStatusTelemetryData extends TestStepSelectTelemetryData {
    passed: boolean;
    numInstances: number;
}

export interface DetailsViewPivotSelectedTelemetryData extends BaseTelemetryData {
    pivotKey: string;
}

export interface DetailsViewTargetLinkClickTelemetryData extends BaseTelemetryData {
    triggeredBy: string;
}

export interface AssessmentTelemetryData extends BaseTelemetryData {
    selectedTest: string;
}

export interface TestStepActionTelemetryData extends AssessmentTelemetryData {
    selectedStep: string;
}

export interface ModifiedCommandsTelemetryData {
    modifiedCommands: string;
}

export interface InspectTelemetryData extends BaseTelemetryData {
    frameUrl?: string;
    target?: string[];
}

export interface CreateBugTelemetryData extends BaseTelemetryData {
    rule: string;
}

export interface ScopingTelemetryData extends BaseTelemetryData {
    inputType: string;
}

export interface AssessmentRequirementScanTelemetryData extends RuleAnalyzerScanTelemetryData {
    requirementName: string;
}

export interface RuleAnalyzerScanTelemetryData {
    scanDuration: number;
    NumberOfElementsScanned: number;
    include: ISingleElementSelector[];
    exclude: ISingleElementSelector[];
    testName: string;
}

export interface IssuesAnalyzerScanTelemetryData extends RuleAnalyzerScanTelemetryData {
    passedRuleResults: string;
    failedRuleResults: string;
}

export type IAnalyzerTelemetryData =
    RuleAnalyzerScanTelemetryData |
    IssuesAnalyzerScanTelemetryData;

export type TelemetryData =
    FeedbackTelemetryData |
    ToggleTelemetryData |
    FeatureFlagToggleTelemetryData |
    DetailsViewOpenTelemetryData |
    DetailsViewPivotSelectedTelemetryData |
    DetailsViewTargetLinkClickTelemetryData |
    ModifiedCommandsTelemetryData |
    InspectTelemetryData |
    AssessmentTelemetryData |
    TestStepActionTelemetryData |
    RequirementStatusTelemetryData |
    CreateBugTelemetryData;
