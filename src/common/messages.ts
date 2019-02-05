// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export interface IStateMessages {
    GetCurrentVisualizationToggleState: string;
    GetCurrentVisualizationResultState: string;
    InjectionCompleted: string;
    InjectionStarted: string;
}

export interface IDetailsViewMessages {
    Open: string;
    Select: string;
    PivotSelect: string;
    Close: string;
    SetDetailsViewRightContentPanel: string;
    GetState: string;
}

export interface IIssuesMessages {
    UpdateSelectedTargets: string;
    UpdateFocusedInstance: string;
}

export interface ITabStopsMessages {
    TabbedElementAdded: string;
    RecordingCompleted: string;
    TerminateScan: string;
}

export interface IVisualizationCommonMessages {
    Toggle: string;
    ScanCompleted: string;
    ScrollRequested: string;
}

export interface DevToolsMessages {
    DevtoolStatus: string;
    InspectElement: string;
    InspectFrameUrl: string;
    Get: string;
}

export interface IVisualizationMessages {
    Common: IVisualizationCommonMessages;
    Issues: IIssuesMessages;
    TabStops: ITabStopsMessages;
    State: IStateMessages;
    DetailsView: IDetailsViewMessages;
}

export class Messages {
    public static readonly Visualizations: IVisualizationMessages = {
        Common: {
            Toggle: 'insights/visualization/toggle',
            ScanCompleted: 'insights/visualization/scanCompleted',
            ScrollRequested: 'insights/visualization/scrollRequested',
        },
        TabStops: {
            TabbedElementAdded: 'insights/visualization/tab-stops/element-added',
            RecordingCompleted: 'insights/visualization/tab-stops/completed',
            TerminateScan: 'insights/visualization/tab-stops/terminated',
        },
        Issues: {
            UpdateSelectedTargets: 'insights/visualization/issues/targets/selected/update',
            UpdateFocusedInstance: 'insights/visualization/issues/targets/focused/update',
        },
        State: {
            GetCurrentVisualizationToggleState: 'insights/toggles/state/current',
            GetCurrentVisualizationResultState: 'insights/results/state/current',
            InjectionCompleted: 'insights/visualization/state/injectionCompleted',
            InjectionStarted: 'insights/visualization/state/InjectionStarted',
        },
        DetailsView: {
            Open: 'insights/details-view/open',
            Select: 'insights/details-view/select',
            PivotSelect: 'insights/details-view/pivot/select',
            Close: 'insights/details-view/closed',
            SetDetailsViewRightContentPanel: 'insights/details-view/setRightContentPanel',
            GetState: 'insights/details-view/state/current',
        },
    };

    public static readonly DevTools: DevToolsMessages = {
        DevtoolStatus: 'insights/devtools/status',
        InspectElement: 'insights/devtools/inspect',
        InspectFrameUrl: 'insights/devtools/inspectFrameUrl',
        Get: 'insights/devtools/get',
    };

    public static readonly Extension = {
        Updated: 'insights/extension/updated',
    };

    public static readonly Telemetry = {
        Send: 'insights/telemetry/send',
        SendExcludeUrl: 'insights/telemetry/sendExcludeUrl',
    };

    public static readonly UserConfig = {
        GetCurrentState: 'insights/userConfig/getCurrentState',
        SetTelemetryConfig: 'insights/userConfig/setTelemetryConfig',
        SetHighContrastConfig: 'insights/userConfig/setHighContrastConfig',
        SetBugServiceConfig: 'insights/userConfig/setBugServiceConfig',
    };

    public static readonly Tab = {
        Update: 'insights/tab/update',
        GetCurrent: 'insights/tab/current',
        Remove: 'insights/tab/remove',
        Change: 'insights/targetTab/changed',
        Switch: 'insights/targetTab/switch',
        VisibilityChange: 'insights/targetTab/visibilitychange',
    };

    public static readonly Command = {
        GetCommands: 'insights/command/get',
    };

    public static readonly Assessment = {
        GetCurrentState: 'insights/assessment/getCurrentState',
        SelectTestStep: 'insights/details-view/test-steps/select',
        AssessmentScanCompleted: 'insights/assessment/scanComplete',
        TabbedElementAdded: 'insights/assessment/tab-stops/element-added',
        TrackingCompleted: 'insights/assessment/tab-stops/recording-completed',
        CancelStartOver: 'insights/assessment/cancel-start-over',
        CancelStartOverAllAssessments: 'insights/assessment/cancel-start-over-all-assessments',
        StartOver: 'insights/assessment/startOver',
        StartOverAllAssessments: 'insights/assessment/startOverAllAssessments',
        EnableVisualHelper: 'insights/assessment/enableVisualHelper',
        EnableVisualHelperWithoutScan: 'insights/assessment/enableVisualHelperWithoutScan',
        DisableVisualHelperForTest: 'insights/assessment/disableVisualHelperForTest',
        DisableVisualHelper: 'insights/assessment/disableVisualHelper',
        ChangeStatus: 'insights/assessment/changeStatus',
        ChangeStepStatus: 'insights/assessment/changeManualTestStepStatus',
        ChangeVisualizationState: 'insights/assessment/changeSVisualizationState',
        Undo: 'insights/assessment/undo',
        UndoChangeStepStatus: 'insights/assessment/undoChangeManualTestStepStatus',
        AddFailureInstance: 'insights/assessment/addFailureInstance',
        RemoveFailureInstance: 'insights/assessment/removeFailureInstance',
        EditFailureInstance: 'insights/assessment/editFailureInstance',
        PassUnmarkedInstances: 'insights/assessment/passUnmarkedInstances',
        ChangeVisualizationStateForAll: 'insights/assessment/changeVisualizationStateForAll',
        UpdateInstanceVisibility: 'insights/assessment/updateInstanceVisibility',
        ScanUpdate: 'insights/assessment/scanUpdate',
        ContinuePreviousAssessment: 'insights/assessment/continuePreviousAssessment',
    };

    public static readonly FeatureFlags = {
        GetFeatureFlags: 'insights/featureFlags/get',
        SetFeatureFlag: 'insights/featureFlags/set',
        ResetFeatureFlag: 'insights/featureFlags/reset',
    };

    public static readonly ChromeFeature = {
        configureCommand: 'insights/command/configureCommand',
    };

    public static readonly LaunchPanel = {
        Get: 'insights/launchpanel/get',
        Set: 'insights/launchpanel/set',
    };

    public static readonly PreviewFeatures = {
        ClosePanel: 'insights/previewFeatures/closePanel',
        OpenPanel: 'insights/previewFeatures/openPanel',
    };

    public static readonly ContentPanel = {
        ClosePanel: 'insights/contentPanel/closePanel',
        OpenPanel: 'insights/contentPanel/openPanel',
    };

    public static readonly SettingsPanel = {
        ClosePanel: 'insights/settingsPanel/closePanel',
        OpenPanel: 'insights/settingsPanel/openPanel',
    };

    public static readonly Scoping = {
        ClosePanel: 'insights/scoping/closePanel',
        OpenPanel: 'insights/scoping/openPanel',
        GetCurrentState: 'insights/scoping/get',
        AddSelector: 'insights/scoping/addSelector',
        DeleteSelector: 'insights/scoping/deleteSelector',
    };

    public static readonly Inspect = {
        ChangeInspectMode: 'insights/inspect/changeInspectMode',
        GetCurrentState: 'insights/inspect/get',
        SetHoveredOverSelector: 'insights/inspect/setHoveredOverSelector',
    };
}
