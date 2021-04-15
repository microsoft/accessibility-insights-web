// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentVisualizationInstance } from 'injected/frameCommunicators/html-element-axe-results-helper';
import { SelectorToVisualizationMap } from 'injected/selector-to-visualization-map';
import {
    TestStepVisualizationState,
    visualizationNeedsUpdate,
} from 'injected/visualization-needs-update';

describe('visualizationNeedsUpdate', () => {
    const selectorMapA: SelectorToVisualizationMap = {
        'selector-a': {} as AssessmentVisualizationInstance,
    };
    const selectorMapB: SelectorToVisualizationMap = {
        'selector-b': {} as AssessmentVisualizationInstance,
    };
    const irrelevantSelectorMap = selectorMapA;

    describe('when there is no previous state', () => {
        it.each([true, false])('should return %p if new state has enabled=%p', newEnabled => {
            const oldState: TestStepVisualizationState = undefined;
            const newState: TestStepVisualizationState = {
                enabled: newEnabled,
                selectorMap: irrelevantSelectorMap,
            };
            expect(visualizationNeedsUpdate(newState, oldState)).toBe(newEnabled);
        });
    });

    it('returns true when previously-disabled visualization is enabled', () => {
        const oldState: TestStepVisualizationState = {
            enabled: false,
            selectorMap: irrelevantSelectorMap,
        };
        const newState: TestStepVisualizationState = {
            enabled: true,
            selectorMap: irrelevantSelectorMap,
        };
        expect(visualizationNeedsUpdate(newState, oldState)).toBe(true);
    });

    it('returns true when previously-enabled visualization is disabled', () => {
        const oldState: TestStepVisualizationState = {
            enabled: true,
            selectorMap: irrelevantSelectorMap,
        };
        const newState: TestStepVisualizationState = {
            enabled: false,
            selectorMap: irrelevantSelectorMap,
        };
        expect(visualizationNeedsUpdate(newState, oldState)).toBe(true);
    });

    it('returns false when previously-disabled visualization is still disabled and selector map has not changed', () => {
        const oldState: TestStepVisualizationState = {
            enabled: false,
            selectorMap: selectorMapA,
        };
        const newState: TestStepVisualizationState = {
            enabled: false,
            selectorMap: selectorMapA,
        };
        expect(visualizationNeedsUpdate(newState, oldState)).toBe(false);
    });

    it('returns false when previously-disabled visualization is still disabled, regardless of selector map changing,', () => {
        const oldState: TestStepVisualizationState = {
            enabled: false,
            selectorMap: selectorMapA,
        };
        const newState: TestStepVisualizationState = {
            enabled: false,
            selectorMap: selectorMapB,
        };
        expect(visualizationNeedsUpdate(newState, oldState)).toBe(false);
    });

    it('returns false when previously-enabled visualization is still enabled and selector map has not changed', () => {
        const oldState: TestStepVisualizationState = {
            enabled: true,
            selectorMap: selectorMapA,
        };
        const newState: TestStepVisualizationState = {
            enabled: true,
            selectorMap: selectorMapA,
        };
        expect(visualizationNeedsUpdate(newState, oldState)).toBe(false);
    });

    it('returns true when previously-enabled visualization is still enabled, but selector map has changed', () => {
        const oldState: TestStepVisualizationState = {
            enabled: true,
            selectorMap: selectorMapA,
        };
        const newState: TestStepVisualizationState = {
            enabled: true,
            selectorMap: selectorMapB,
        };
        expect(visualizationNeedsUpdate(newState, oldState)).toBe(true);
    });
});
