// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export const TriggeredByNotApplicable: TriggeredBy = 'N/A';
export type TriggeredBy = 'mouseclick' | 'keypress' | 'shortcut' | 'N/A';

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
    ElectronAutomatedChecksView,
}

export type BaseTelemetryData = {
    source: TelemetryEventSource;
    triggeredBy: TriggeredBy;
};
