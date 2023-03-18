// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { StoreNames } from './stores/store-names';

const messagePrefix = 'insights';
export const getStoreStateMessage = (storeName: StoreNames): string => {
    return `${messagePrefix}/${StoreNames[storeName]}/state/current`;
};

export type AssessmentMessages = typeof Messages.Assessment | typeof Messages.QuickAssess;
export type AssessmentCardSelectionMessages =
    | typeof Messages.AssessmentCardSelection
    | typeof Messages.QuickAssessCardSelection;

export const Messages = {
    Visualizations: {
        Common: {
            Toggle: `${messagePrefix}/visualization/toggle`,
            ScanCompleted: `${messagePrefix}/visualization/scanCompleted`,
            ScrollRequested: `${messagePrefix}/visualization/scrollRequested`,
            RescanVisualization: `${messagePrefix}/visualization/rescanVisualization`,
        },
        TabStops: {
            ScanCompleted: `${messagePrefix}/visualization/tab-stops/scanCompleted`,
            TabbedElementAdded: `${messagePrefix}/visualization/tab-stops/element-added`,
            RecordingCompleted: `${messagePrefix}/visualization/tab-stops/completed`,
            TerminateScan: `${messagePrefix}/visualization/tab-stops/terminated`,
            UpdateTabStopsRequirementStatus: `${messagePrefix}/visualization/tab-stops/requirement-updated`,
            ResetTabStopsRequirementStatus: `${messagePrefix}/visualization/tab-stops/requirement-reset`,
            AddTabStopInstance: `${messagePrefix}/visualization/tab-stops/instance-added`,
            AddTabStopInstanceArray: `${messagePrefix}/visualization/tab-stops/instance-array-added`,
            UpdateTabStopInstance: `${messagePrefix}/visualization/tab-stops/instance-updated`,
            RemoveTabStopInstance: `${messagePrefix}/visualization/tab-stops/instance-removed`,
            RequirementExpansionToggled: `${messagePrefix}/visualization/tab-stops/toggleTabStopRequirementExpand`,
            TabbingCompleted: `${messagePrefix}/visualization/tab-stops/tabbingCompleted`,
            NeedToCollectTabbingResults: `${messagePrefix}/visualization/tab-stops/NeedToCollectTabbingResults`,
            AutomatedTabbingResultsCompleted: `${messagePrefix}/visualization/tab-stops/AutomatedTabbingResultsCompleted`,
        },
        Issues: {
            UpdateFocusedInstance: `${messagePrefix}/visualization/issues/targets/focused/update`,
        },
        State: {
            InjectionCompleted: `${messagePrefix}/visualization/state/injectionCompleted`,
            InjectionStarted: `${messagePrefix}/visualization/state/InjectionStarted`,
            InjectionFailed: `${messagePrefix}/visualization/state/InjectionFailed`,
        },
        DetailsView: {
            Open: `${messagePrefix}/details-view/open`,
            Initialize: `${messagePrefix}/details-view/initialize`,
            Select: `${messagePrefix}/details-view/select`,
            PivotSelect: `${messagePrefix}/details-view/pivot/select`,
            Close: `${messagePrefix}/details-view/closed`,
            SetDetailsViewRightContentPanel: `${messagePrefix}/details-view/setRightContentPanel`,
        },
    },

    DevTools: {
        StatusRequest: `${messagePrefix}/devtools/getStatus`,
        Opened: `${messagePrefix}/devtools/opened`,
        Closed: `${messagePrefix}/devtools/closed`,
        InspectElement: `${messagePrefix}/devtools/inspect`,
        InspectFrameUrl: `${messagePrefix}/devtools/inspectFrameUrl`,
    },

    Telemetry: {
        Send: `${messagePrefix}/telemetry/send`,
    },

    UserConfig: {
        SetTelemetryConfig: `${messagePrefix}/userConfig/setTelemetryConfig`,
        SetHighContrastConfig: `${messagePrefix}/userConfig/setHighContrastConfig`,
        SetNativeHighContrastConfig: `${messagePrefix}/userConfig/setNativeHighContrastConfig`,
        SetIssueFilingService: `${messagePrefix}/userConfig/setIssueFilingService`,
        SetIssueFilingServiceProperty: `${messagePrefix}/userConfig/setIssueFilingServiceProperty`,
        SaveIssueFilingSettings: `${messagePrefix}/userConfig/saveIssueFilingSettings`,
        SetAdbLocationConfig: `${messagePrefix}/userConfig/setAdbLocationConfig`,
        SaveWindowBounds: `${messagePrefix}/userConfig/saveWindowBounds`,
        SetAutoDetectedFailuresDialogState: `${messagePrefix}/userConfig/setAutoDetectedFailuresDialogState`,
        SetSaveAssessmentDialogState: `${messagePrefix}/userConfig/setSaveAssessmentDialogState`,
    },

    Popup: {
        Initialized: `${messagePrefix}/popup/initialized`,
    },

    Tab: {
        NewTabCreated: `${messagePrefix}/tab/newTabCreated`,
        Remove: `${messagePrefix}/tab/remove`,
        ExistingTabUpdated: `${messagePrefix}/tab/existingTabUpdated`,
        Switch: `${messagePrefix}/tab/switch`,
        VisibilityChange: `${messagePrefix}/tab/visibilitychange`,
    },

    Assessment: {
        SelectTestRequirement: `${messagePrefix}/details-view/requirement/select`,
        SelectNextRequirement: `${messagePrefix}/details-view/requirement/select-next`,
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
        LoadAssessment: `${messagePrefix}/assessment/loadAssessment`,
        LoadAssessmentFinishedUpload: `${messagePrefix}/assessment/loadAssessmentFinishedUpload`,
        SaveAssessment: `${messagePrefix}/assessment/saveAssessment`,
    },

    QuickAssess: {
        SelectTestRequirement: `${messagePrefix}/quickAssess/requirement/select`,
        SelectNextRequirement: `${messagePrefix}/quickAssess/requirement/select-next`,
        SelectGettingStarted: `${messagePrefix}/quickAssess/select-getting-started`,
        ExpandTestNav: `${messagePrefix}/quickAssess/expand-test-nav`,
        CollapseTestNav: `${messagePrefix}/quickAssess/collapse-test-nav`,
        AssessmentScanCompleted: `${messagePrefix}/quickAssess/scanComplete`,
        TabbedElementAdded: `${messagePrefix}/quickAssess/tab-stops/element-added`,
        TrackingCompleted: `${messagePrefix}/quickAssess/tab-stops/recording-completed`,
        CancelStartOver: `${messagePrefix}/quickAssess/cancel-start-over`,
        CancelStartOverAllAssessments: `${messagePrefix}/quickAssess/cancel-start-over-all-assessments`,
        StartOverTest: `${messagePrefix}/quickAssess/startOverTest`,
        StartOverAllAssessments: `${messagePrefix}/quickAssess/startOverAllAssessments`,
        EnableVisualHelper: `${messagePrefix}/quickAssess/enableVisualHelper`,
        EnableVisualHelperWithoutScan: `${messagePrefix}/quickAssess/enableVisualHelperWithoutScan`,
        DisableVisualHelperForTest: `${messagePrefix}/quickAssess/disableVisualHelperForTest`,
        DisableVisualHelper: `${messagePrefix}/quickAssess/disableVisualHelper`,
        ChangeStatus: `${messagePrefix}/quickAssess/changeStatus`,
        ChangeRequirementStatus: `${messagePrefix}/quickAssess/changeManualRequirementStatus`,
        ChangeVisualizationState: `${messagePrefix}/quickAssess/changeSVisualizationState`,
        Undo: `${messagePrefix}/quickAssess/undo`,
        UndoChangeRequirementStatus: `${messagePrefix}/quickAssess/undoChangeManualRequirementStatus`,
        AddFailureInstance: `${messagePrefix}/quickAssess/addFailureInstance`,
        AddResultDescription: `${messagePrefix}/quickAssess/addResultDescription`,
        RemoveFailureInstance: `${messagePrefix}/quickAssess/removeFailureInstance`,
        EditFailureInstance: `${messagePrefix}/quickAssess/editFailureInstance`,
        PassUnmarkedInstances: `${messagePrefix}/quickAssess/passUnmarkedInstances`,
        ChangeVisualizationStateForAll: `${messagePrefix}/quickAssess/changeVisualizationStateForAll`,
        ScanUpdate: `${messagePrefix}/quickAssess/scanUpdate`,
        ContinuePreviousAssessment: `${messagePrefix}/quickAssess/continuePreviousAssessment`,
        LoadAssessment: `${messagePrefix}/quickAssess/loadAssessment`,
        LoadAssessmentFinishedUpload: `${messagePrefix}/quickAssess/loadAssessmentFinishedUpload`,
        SaveAssessment: `${messagePrefix}/quickAssess/saveAssessment`,
    },

    FeatureFlags: {
        SetFeatureFlag: `${messagePrefix}/featureFlags/set`,
        ResetFeatureFlag: `${messagePrefix}/featureFlags/reset`,
    },

    Shortcuts: {
        ConfigureShortcuts: `${messagePrefix}/command/configureShortcuts`,
    },

    LaunchPanel: {
        Set: `${messagePrefix}/launchpanel/set`,
    },

    PreviewFeatures: {
        ClosePanel: `${messagePrefix}/previewFeatures/closePanel`,
        OpenPanel: `${messagePrefix}/previewFeatures/openPanel`,
    },

    ContentPanel: {
        ClosePanel: `${messagePrefix}/contentPanel/closePanel`,
        OpenPanel: `${messagePrefix}/contentPanel/openPanel`,
    },

    SettingsPanel: {
        ClosePanel: `${messagePrefix}/settingsPanel/closePanel`,
        OpenPanel: `${messagePrefix}/settingsPanel/openPanel`,
    },

    Scoping: {
        ClosePanel: `${messagePrefix}/scoping/closePanel`,
        OpenPanel: `${messagePrefix}/scoping/openPanel`,
        AddSelector: `${messagePrefix}/scoping/addSelector`,
        DeleteSelector: `${messagePrefix}/scoping/deleteSelector`,
    },

    Inspect: {
        ChangeInspectMode: `${messagePrefix}/inspect/changeInspectMode`,
        SetHoveredOverSelector: `${messagePrefix}/inspect/setHoveredOverSelector`,
    },

    IssueFiling: {
        FileIssue: `${messagePrefix}/issueFiling/file`,
    },

    PathSnippet: {
        AddPathForValidation: `${messagePrefix}/pathSnippet/addPathForValidation`,
        AddCorrespondingSnippet: `${messagePrefix}/pathSnippet/addCorrespondingSnippet`,
        ClearPathSnippetData: `${messagePrefix}/pathSnippet/clearPathSnippetData`,
    },

    UnifiedScan: {
        ScanCompleted: `${messagePrefix}/unifiedScan/scanCompleted`,
    },

    NeedsReviewScan: {
        ScanCompleted: `${messagePrefix}/needsReviewScan/scanCompleted`,
    },
    CardSelection: {
        CardSelectionToggled: `${messagePrefix}/cardSelection/cardSelectionToggled`,
        RuleExpansionToggled: `${messagePrefix}/cardSelection/ruleExpansionToggled`,
        CollapseAllRules: `${messagePrefix}/cardSelection/collapseAllRules`,
        ExpandAllRules: `${messagePrefix}/cardSelection/expandAllRules`,
        ToggleVisualHelper: `${messagePrefix}/cardSelection/toggleVisualHelper`,
        NavigateToNewCardsView: `${messagePrefix}/cardSelection/navigateToNewCardsView`,
    },
    NeedsReviewCardSelection: {
        CardSelectionToggled: `${messagePrefix}/needsReviewCardSelection/cardSelectionToggled`,
        RuleExpansionToggled: `${messagePrefix}/needsReviewCardSelection/ruleExpansionToggled`,
        CollapseAllRules: `${messagePrefix}/needsReviewCardSelection/collapseAllRules`,
        ExpandAllRules: `${messagePrefix}/needsReviewCardSelection/expandAllRules`,
        ToggleVisualHelper: `${messagePrefix}/needsReviewCardSelection/toggleVisualHelper`,
        NavigateToNewCardsView: `${messagePrefix}/needsReviewCardSelection/navigateToNewCardsView`,
    },
    AssessmentCardSelection: {
        CardSelectionToggled: `${messagePrefix}/assessmentCardSelection/cardSelectionToggled`,
        RuleExpansionToggled: `${messagePrefix}/assessmentCardSelection/ruleExpansionToggled`,
        CollapseAllRules: `${messagePrefix}/assessmentCardSelection/collapseAllRules`,
        ExpandAllRules: `${messagePrefix}/assessmentCardSelection/expandAllRules`,
        ToggleVisualHelper: `${messagePrefix}/assessmentCardSelection/toggleVisualHelper`,
        NavigateToNewCardsView: `${messagePrefix}/assessmentCardSelection/navigateToNewCardsView`,
        AssessmentStoreChanged: `${messagePrefix}/assessmentCardSelection/assessmentStoreChanged`,
    },
    QuickAssessCardSelection: {
        CardSelectionToggled: `${messagePrefix}/quickAssessCardSelection/cardSelectionToggled`,
        RuleExpansionToggled: `${messagePrefix}/quickAssessCardSelection/ruleExpansionToggled`,
        CollapseAllRules: `${messagePrefix}/quickAssessCardSelection/collapseAllRules`,
        ExpandAllRules: `${messagePrefix}/quickAssessCardSelection/expandAllRules`,
        ToggleVisualHelper: `${messagePrefix}/quickAssessCardSelection/toggleVisualHelper`,
        NavigateToNewCardsView: `${messagePrefix}/quickAssessCardSelection/navigateToNewCardsView`,
    },

    PermissionsState: {
        SetPermissionsState: `${messagePrefix}/permissionsState/setPermissionsState`,
    },

    DebugTools: {
        Open: `${messagePrefix}/debugTools/open`,
        Telemetry: `${messagePrefix}/debugTools/telemetry`,
    },

    DataTransfer: {
        InitiateTransferDataToAssessment: `${messagePrefix}/dataTransfer/initiateTransferDataToAssessment`,
        TransferDataToAssessment: `${messagePrefix}/dataTransfer/transferDataToAssessment`,
        FinalizeTransferDataToAssessment: `${messagePrefix}/dataTransfer/finalizeTransferDataToAssessment`,
    },
};
