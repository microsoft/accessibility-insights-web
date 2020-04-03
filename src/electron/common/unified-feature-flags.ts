// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagDetail } from 'common/feature-flags';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { forEach } from 'lodash';

export class UnifiedFeatureFlags {
    public static readonly logTelemetryToConsole = 'logTelemetryToConsole';
    public static readonly showAllFeatureFlags = 'showAllFeatureFlags';
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
            defaultValue: false,
            displayableName: 'Show all feature flags',
            displayableDescription: 'Show all feature flags in the Preview Features panel.',
            isPreviewFeature: false,
            forceDefault: false,
        },
    ];
}

export function getDefaultFeatureFlagValuesUnified(): FeatureFlagStoreData {
    const details: FeatureFlagDetail[] = getAllFeatureFlagDetailsUnified();
    const values: FeatureFlagStoreData = {};
    forEach(details, detail => {
        values[detail.id] = detail.defaultValue;
    });
    return values;
}

export function getForceDefaultFlagsUnified(): string[] {
    const details: FeatureFlagDetail[] = getAllFeatureFlagDetailsUnified();
    const forceDefaultFlags: string[] = [];
    forEach(details, detail => {
        if (detail.forceDefault) {
            forceDefaultFlags.push(detail.id);
        }
    });
    return forceDefaultFlags;
}
