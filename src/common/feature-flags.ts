// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FeatureFlagDefaultsHelper } from 'common/feature-flag-defaults-helper';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';

export class FeatureFlags {
    public static readonly logTelemetryToConsole = 'logTelemetryToConsole';
    public static readonly showAllAssessments = 'showAllAssessments';
    public static readonly shadowDialog = 'shadowDialog';
    public static readonly showAllFeatureFlags = 'showAllFeatureFlags';
    public static readonly scoping = 'scoping';
    public static readonly showInstanceVisibility = 'showInstanceVisibility';
    public static readonly manualInstanceDetails = 'manualInstanceDetails';
    public static readonly debugTools = 'debugTools';
    public static readonly exportReportOptions = 'exportReportOptions';
    public static readonly needsReview = 'needsReview';
}

export interface FeatureFlagDetail {
    id: string;
    defaultValue: boolean;
    displayableName: string;
    displayableDescription: string;
    isPreviewFeature: boolean;
    forceDefault: boolean;
}

export function getAllFeatureFlagDetails(): FeatureFlagDetail[] {
    return [
        {
            id: FeatureFlags.shadowDialog,
            defaultValue: false,
            displayableName: 'Improved dialog styling',
            displayableDescription:
                'Avoids styling problems in failure dialogs by rendering them in shadow DOM. ' +
                "(You'll need to refresh the target page to see the new dialog styling.)",
            isPreviewFeature: false,
            forceDefault: false,
        },
        {
            id: FeatureFlags.showAllAssessments,
            defaultValue: false,
            displayableName: 'Show all assessments',
            displayableDescription: 'Show all assessments, even the in-development ones',
            isPreviewFeature: false,
            forceDefault: false,
        },
        {
            id: FeatureFlags.logTelemetryToConsole,
            defaultValue: false,
            displayableName: 'Log telemetry to console',
            displayableDescription:
                'Write telemetry payload information to the developer tools console.',
            isPreviewFeature: false,
            forceDefault: false,
        },
        {
            id: FeatureFlags.showAllFeatureFlags,
            defaultValue: false,
            displayableName: 'Show all feature flags',
            displayableDescription: 'Show all feature flags in the Preview Features panel.',
            isPreviewFeature: false,
            forceDefault: false,
        },
        {
            id: FeatureFlags.scoping,
            defaultValue: false,
            displayableName: 'Scoping experience',
            displayableDescription:
                'Enable scoping to limit scanning to selected portions of the webpage.',
            isPreviewFeature: false,
            forceDefault: false,
        },
        {
            id: FeatureFlags.showInstanceVisibility,
            defaultValue: false,
            displayableName: 'Show instance visibility in assessment',
            displayableDescription:
                'Shows visibility of instances in assessment requirement lists. May impact performance. ' +
                "(You'll need to go to a different requirement and come back for it to take effect.)",
            isPreviewFeature: false,
            forceDefault: false,
        },
        {
            id: FeatureFlags.manualInstanceDetails,
            defaultValue: false,
            displayableName: 'Enable manual instance details',
            displayableDescription:
                'Allow addition of path (CSS selector) which automatically ' +
                'populates the corresponding code snippet when adding manual failure instance.',
            isPreviewFeature: false,
            forceDefault: false,
        },
        {
            id: FeatureFlags.debugTools,
            defaultValue: false,
            displayableName: 'Enable debug tools',
            displayableDescription:
                'Click on the new icon close to the gear to open the debug tools',
            isPreviewFeature: false,
            forceDefault: false,
        },
        {
            id: FeatureFlags.exportReportOptions,
            defaultValue: false,
            displayableName: 'More export options',
            displayableDescription: 'Enables exporting reports to external services',
            isPreviewFeature: true,
            forceDefault: false,
        },
        {
            id: FeatureFlags.needsReview,
            defaultValue: false,
            displayableName: 'Needs review',
            displayableDescription:
                'Enable a new test to show automated check rules that might have an accessibility issue and need to be reviewed.',
            isPreviewFeature: false,
            forceDefault: false,
        },
    ];
}

export function getDefaultFeatureFlagsWeb(): FeatureFlagStoreData {
    return new FeatureFlagDefaultsHelper(getAllFeatureFlagDetails).getDefaultFeatureFlagValues();
}
