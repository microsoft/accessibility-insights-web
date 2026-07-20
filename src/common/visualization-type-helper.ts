// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { EnumHelper } from 'common/enum-helper';
import { VisualizationType } from 'common/types/visualization-type';

/**
 * Any visualisations that still exist in the enum for
 * back-compat but are no longer surfaced by the UI.
 */
export const deprecatedVisualizationTypes: VisualizationType[] = [
    VisualizationType.ParsingAssessment,
];

/**
 * Assessment keys that *used* to map to the deprecated
 * visualisations. They may still appear in persisted files.
 */
export const deprecatedAssessmentKeys: string[] = ['parsing'];

/**
 * Replacement for EnumHelper.getNumericValues(VisualizationType)
 * that silently filters out deprecated values.
 */
export const getNumericVisualizationTypeValues = (): number[] =>
    (EnumHelper.getNumericValues(VisualizationType) as number[]).filter(
        v => !deprecatedVisualizationTypes.includes(v as VisualizationType),
    );
