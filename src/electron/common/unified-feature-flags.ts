// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagDetail } from 'common/feature-flags';

export class UnifiedFeatureFlags {
    public static readonly logTelemetryToConsole = 'logTelemetryToConsole';
    public static readonly showAllFeatureFlags = 'showAllFeatureFlags';
    public static readonly exportReport = 'exportReport';
    public static readonly adbSetupView = 'adbSetupView';
}

export function getAllFeatureFlagDetailsUnified(): FeatureFlagDetail[] {
    return [
        {
            id: UnifiedFeatureFlags.logTelemetryToConsole,
            defaultValue: false,
            displayableName: 'Log telemetry to console',
            displayableDescription:
                'Write telemetry payload information to the developer tools console.',
            isPreviewFeature: false,
            forceDefault: false,
        },
        {
            id: UnifiedFeatureFlags.showAllFeatureFlags,
            defaultValue: true,
            displayableName: 'Show all feature flags',
            displayableDescription: 'Show all feature flags in the Preview Features panel.',
            isPreviewFeature: false,
            forceDefault: false,
        },
        {
            id: UnifiedFeatureFlags.exportReport,
            defaultValue: true,
            displayableName: 'Show export report button',
            displayableDescription: 'Show the export report button on the automated checks window',
            isPreviewFeature: false,
            forceDefault: true,
        },
        {
            id: UnifiedFeatureFlags.adbSetupView,
            defaultValue: false,
            displayableName: 'Enable the new adb experience',
            displayableDescription: 'Enable the new adb setup and installation experience',
            isPreviewFeature: false,
            forceDefault: false,
        },
    ];
}
