// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { SelectorToVisualizationMap } from 'injected/selector-to-visualization-map';
import { isEqual } from 'lodash';

export type TestStepVisualizationState = {
    enabled: boolean;
    selectorMap: SelectorToVisualizationMap;
};

export type VisualizationNeedsUpdateCallback = (
    oldVisualizationState: TestStepVisualizationState,
    newVisualizationState: TestStepVisualizationState,
) => boolean;

export const visualizationNeedsUpdate: VisualizationNeedsUpdateCallback = (
    newState: TestStepVisualizationState,
    oldState: TestStepVisualizationState | undefined,
) => {
    if (oldState === undefined) {
        return newState.enabled;
    }

    if (oldState.enabled !== newState.enabled) {
        return true;
    }

    if (!oldState.enabled && !newState.enabled) {
        return false; // even if selectorMap changed
    }

    return !isEqual(oldState.selectorMap, newState.selectorMap);
};
