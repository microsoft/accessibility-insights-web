// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StoreNames } from './stores/store-names';

export interface StateMessages {
    InjectionCompleted: string;
    InjectionStarted: string;
}

export interface DetailsViewMessages {
    Open: string;
    Select: string;
    PivotSelect: string;
    Close: string;
    SetDetailsViewRightContentPanel: string;
}

export interface IssuesMessages {
    UpdateSelectedTargets: string;
    UpdateFocusedInstance: string;
}

export interface TabStopsMessages {
    TabbedElementAdded: string;
    RecordingCompleted: string;
    TerminateScan: string;
}

export interface VisualizationCommonMessages {
    Toggle: string;
    ScanCompleted: string;
    ScrollRequested: string;
    RescanVisualization: string;
}

export interface DevToolsMessages {
    DevtoolStatus: string;
    InspectElement: string;
    InspectFrameUrl: string;
}

export interface VisualizationMessages {
    Common: VisualizationCommonMessages;
    Issues: IssuesMessages;
    TabStops: TabStopsMessages;
    State: StateMessages;
    DetailsView: DetailsViewMessages;
}

const messagePrefix = 'insights';
export const getStoreStateMessage = (storeName: StoreNames): string => {
    return `${messagePrefix}/${StoreNames[storeName]}/state/current`;
};

export class Messages {
    public static readonly Visualizations: VisualizationMessages = {
        Common: {
            Toggle: `${messagePrefix}/visualization/toggle`,
            ScanCompleted: `${messagePrefix}/visualization/scanCompleted`,
            ScrollRequested: `${messagePrefix}/visualization/scrollRequested`,
            RescanVisualization: `${messagePrefix}/visualization/rescanVisualization`,
        },
        TabStops: {
            TabbedElementAdded: `${messagePrefix}/visualization/tab-stops/element-added`,
            RecordingCompleted: `${messagePrefix}/visualization/tab-stops/completed`,
            TerminateScan: `${messagePrefix}/visualization/tab-stops/terminated`,
        },
        Issues: {
            UpdateSelectedTargets: `${messagePrefix}/visualization/issues/targets/selected/update`,
            UpdateFocusedInstance: `${messagePrefix}/visualization/issues/targets/focused/update`,
        },
        State: {
            InjectionCompleted: `${messagePrefix}/visualization/state/injectionCompleted`,
            InjectionStarted: `${messagePrefix}/visualization/state/InjectionStarted`,
        },
        DetailsView: {
            Open: `${messagePrefix}/details-view/open`,
            Select: `${messagePrefix}/details-view/select`,
            PivotSelect: `${messagePrefix}/details-view/pivot/select`,
            Close: `${messagePrefix}/details-view/closed`,
            SetDetailsViewRightContentPanel: `${messagePrefix}/details-view/setRightContentPanel`,
        },
    };

    public static readonly DevTools: DevToolsMessages = {
        DevtoolStatus: `${messagePrefix}/devtools/status`,
        InspectElement: `${messagePrefix}/devtools/inspect`,
        InspectFrameUrl: `${messagePrefix}/devtools/inspectFrameUrl`,
    };

    public static readonly Telemetry = {
        Send: `${messagePrefix}/telemetry/send`,
    };

    public static readonly UserConfig = {
        SetTelemetryConfig: `${messagePrefix}/userConfig/setTelemetryConfig`,
        SetHighContrastConfig: `${messagePrefix}/userConfig/setHighContrastConfig`,
        SetNativeHighContrastConfig: `${messagePrefix}/userConfig/setNativeHighContrastConfig`,
        SetIssueFilingService: `${messagePrefix}/userConfig/setIssueFilingService`,
        SetIssueFilingServiceProperty: `${messagePrefix}/userConfig/setIssueFilingServiceProperty`,
        SaveIssueFilingSettings: `${messagePrefix}/userConfig/saveIssueFilingSettings`,
        SetAdbLocationConfig: `${messagePrefix}/userConfig/setAdbLocationConfig`,
        SaveWindowBounds: `${messagePrefix}/userConfig/saveWindowBounds`,
    };

    public static readonly Popup = {
        Initialized: `${messagePrefix}/popup/initialized`,
    };

    public static readonly Tab = {
        NewTabCreated: `${messagePrefix}/tab/newTabCreated`,
        Remove: `${messagePrefix}/tab/remove`,
        ExistingTabUpdated: `${messagePrefix}/tab/existingTabUpdated`,
        Switch: `${messagePrefix}/tab/switch`,
        VisibilityChange: `${messagePrefix}/tab/visibilitychange`,
    };

    public static readonly Assessment = {
        SelectTestRequirement: `${messagePrefix}/details-view/requirement/select`,
        SelectGettingStarted: `${messagePrefix}/details-view/select-getting-started`,
        ExpandTestNav: `${messagePrefix}/details-view/expand-test-nav`,
        CollapseTestNav: `${messagePrefix}/details-view/collapse-test-nav`,
        AssessmentScanCompleted: `${messagePrefix}/assessment/scanComplete`,
        TabbedElementAdded: `${messagePrefix}/assessment/tab-stops/element-added`,
        TrackingCompleted: `${messagePrefix}/assessment/tab-stops/recording-completed`,
        CancelStartOver: `${messagePrefix}/assessment/cancel-start-over`,
        CancelStartOverAllAssessments: `${messagePrefix}/assessment/cancel-start-over-all-assessments`,
        StartOverTest: `${messagePrefix}/assessment/startOverTest`,
        StartOverAllAssessments: `${messagePrefix}/assessment/startOverAllAssessments`,
        EnableVisualHelper: `${messagePrefix}/assessment/enableVisualHelper`,
        EnableVisualHelperWithoutScan: `${messagePrefix}/assessment/enableVisualHelperWithoutScan`,
        DisableVisualHelperForTest: `${messagePrefix}/assessment/disableVisualHelperForTest`,
        DisableVisualHelper: `${messagePrefix}/assessment/disableVisualHelper`,
        ChangeStatus: `${messagePrefix}/assessment/changeStatus`,
        ChangeRequirementStatus: `${messagePrefix}/assessment/changeManualRequirementStatus`,
        ChangeVisualizationState: `${messagePrefix}/assessment/changeSVisualizationState`,
        Undo: `${messagePrefix}/assessment/undo`,
        UndoChangeRequirementStatus: `${messagePrefix}/assessment/undoChangeManualRequirementStatus`,
        AddFailureInstance: `${messagePrefix}/assessment/addFailureInstance`,
        AddResultDescription: `${messagePrefix}/assessment/addResultDescription`,
        RemoveFailureInstance: `${messagePrefix}/assessment/removeFailureInstance`,
        EditFailureInstance: `${messagePrefix}/assessment/editFailureInstance`,
        PassUnmarkedInstances: `${messagePrefix}/assessment/passUnmarkedInstances`,
        ChangeVisualizationStateForAll: `${messagePrefix}/assessment/changeVisualizationStateForAll`,
        ScanUpdate: `${messagePrefix}/assessment/scanUpdate`,
        ContinuePreviousAssessment: `${messagePrefix}/assessment/continuePreviousAssessment`,
    };

    public static readonly FeatureFlags = {
        SetFeatureFlag: `${messagePrefix}/featureFlags/set`,
        ResetFeatureFlag: `${messagePrefix}/featureFlags/reset`,
    };

    public static readonly Shortcuts = {
        ConfigureShortcuts: `${messagePrefix}/command/configureShortcuts`,
    };

    public static readonly LaunchPanel = {
        Set: `${messagePrefix}/launchpanel/set`,
    };

    public static readonly PreviewFeatures = {
        ClosePanel: `${messagePrefix}/previewFeatures/closePanel`,
        OpenPanel: `${messagePrefix}/previewFeatures/openPanel`,
    };

    public static readonly ContentPanel = {
        ClosePanel: `${messagePrefix}/contentPanel/closePanel`,
        OpenPanel: `${messagePrefix}/contentPanel/openPanel`,
    };

    public static readonly SettingsPanel = {
        ClosePanel: `${messagePrefix}/settingsPanel/closePanel`,
        OpenPanel: `${messagePrefix}/settingsPanel/openPanel`,
    };

    public static readonly Scoping = {
        ClosePanel: `${messagePrefix}/scoping/closePanel`,
        OpenPanel: `${messagePrefix}/scoping/openPanel`,
        AddSelector: `${messagePrefix}/scoping/addSelector`,
        DeleteSelector: `${messagePrefix}/scoping/deleteSelector`,
    };

    public static readonly Inspect = {
        ChangeInspectMode: `${messagePrefix}/inspect/changeInspectMode`,
        SetHoveredOverSelector: `${messagePrefix}/inspect/setHoveredOverSelector`,
    };

    public static readonly IssueFiling = {
        FileIssue: `${messagePrefix}/issueFiling/file`,
    };

    public static readonly PathSnippet = {
        AddPathForValidation: `${messagePrefix}/pathSnippet/addPathForValidation`,
        AddCorrespondingSnippet: `${messagePrefix}/pathSnippet/addCorrespondingSnippet`,
        ClearPathSnippetData: `${messagePrefix}/pathSnippet/clearPathSnippetData`,
    };

    public static readonly UnifiedScan = {
        ScanCompleted: `${messagePrefix}/unifiedScan/scanCompleted`,
    };

    public static readonly CardSelection = {
        CardSelectionToggled: `${messagePrefix}/cardSelection/cardSelectionToggled`,
        RuleExpansionToggled: `${messagePrefix}/cardSelection/ruleExpansionToggled`,
        CollapseAllRules: `${messagePrefix}/cardSelection/collapseAllRules`,
        ExpandAllRules: `${messagePrefix}/cardSelection/expandAllRules`,
        ToggleVisualHelper: `${messagePrefix}/cardSelection/toggleVisualHelper`,
    };

    public static readonly PermissionsState = {
        SetPermissionsState: `${messagePrefix}/permissionsState/setPermissionsState`,
    };

    public static readonly DebugTools = {
        Open: `${messagePrefix}/debugTools/open`,
    };
}
