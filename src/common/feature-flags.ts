// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash';

import { FeatureFlagStoreData } from './types/store-data/feature-flag-store-data';

export class FeatureFlags {
    public static readonly logTelemetryToConsole = 'logTelemetryToConsole';
    public static readonly newAssessmentExperience = 'newAssessmentExperience';
    public static readonly showAllAssessments = 'showAllAssessments';
    public static readonly shadowDialog = 'shadowDialog';
    public static readonly exportResult = 'exportResult';
    public static readonly showAllFeatureFlags = 'showAllFeatureFlags';
    public static readonly scoping = 'scoping';
    public static readonly showBugFiling = 'showBugFiling';
    public static readonly showInstanceVisibility = 'showInstanceVisibility';
}

export interface IFeatureFlagDetail {
    id: string;
    defaultValue: boolean;
    displayableName: string;
    displayableDescription: string;
    isPreviewFeature: boolean;
    forceDefault: boolean;
}

export function getAllFeatureFlagDetails(): IFeatureFlagDetail[] {
    return [
        {
            id: FeatureFlags.exportResult,
            defaultValue: true,
            displayableName: 'Export automated checks',
            displayableDescription: 'Allows you to export a summary of automated check results as a sharable HTML file.',
            isPreviewFeature: false,
            forceDefault: true,
        },
        {
            id: FeatureFlags.shadowDialog,
            defaultValue: false,
            displayableName: 'Improved dialog styling',
            displayableDescription:
                'Avoids styling problems in failure dialogs by rendering them in shadow DOM. ' +
                "(You'll need to refresh the target page to see the new dialog styling.)",
            isPreviewFeature: true,
            forceDefault: false,
        },
        {
            id: FeatureFlags.newAssessmentExperience,
            defaultValue: true,
            displayableName: 'New assessment experience',
            displayableDescription: 'Show new Assessment pivot and manual assisted test experiences under development.',
            isPreviewFeature: false,
            forceDefault: true,
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
            displayableDescription: 'Write telemetry payload information to the developer tools console.',
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
            displayableDescription: 'Enable scoping to limit scanning to selected portions of the webpage.',
            isPreviewFeature: false,
            forceDefault: false,
        },
        {
            id: FeatureFlags.showBugFiling,
            defaultValue: false,
            displayableName: 'Show bug filing stubs',
            displayableDescription: 'Show bug filing button stubs',
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
    ];
}

export function getDefaultFeatureFlagValues(): FeatureFlagStoreData {
    const details: IFeatureFlagDetail[] = getAllFeatureFlagDetails();
    const values: FeatureFlagStoreData = {};
    _.forEach(details, detail => {
        values[detail.id] = detail.defaultValue;
    });
    return values;
}

export function getForceDefaultFlags(): FeatureFlags[] {
    const details: IFeatureFlagDetail[] = getAllFeatureFlagDetails();
    const forceDefaultFlags: FeatureFlags[] = [];
    _.forEach(details, detail => {
        if (detail.forceDefault) {
            forceDefaultFlags.push(detail.id);
        }
    });
    return forceDefaultFlags;
}
