// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationType } from 'common/types/visualization-type';
import { AssessmentVisualizationInstance } from 'injected/frameCommunicators/html-element-axe-results-helper';
import { VisualizationSelectorMapContainer } from 'injected/target-page-visualization-updater';
import { visualizationNeedsUpdate } from 'injected/visualization-needs-update';
import { DictionaryStringTo } from 'types/common-types';

describe('visualizationNeedsUpdate', () => {
    let visualizationType: VisualizationType;
    let id: string;
    let newSelectorMapState: DictionaryStringTo<AssessmentVisualizationInstance>;
    let previousVisualizationStates: DictionaryStringTo<boolean>;
    let previousVisualizationSelectorMapData: VisualizationSelectorMapContainer;

    beforeEach(() => {
        visualizationType = -1;
        id = 'some id';
        previousVisualizationStates = {};
        previousVisualizationSelectorMapData = {};
    });

    [true, false].forEach(newVisualizationEnabledState => {
        test(`config id does not exist in previous visualization state should return new visualization state ${newVisualizationEnabledState}`, () => {
            expect(
                visualizationNeedsUpdate(
                    visualizationType,
                    id,
                    newVisualizationEnabledState,
                    newSelectorMapState,
                    previousVisualizationStates,
                    previousVisualizationSelectorMapData,
                ),
            ).toEqual(newVisualizationEnabledState);
        });
    });

    it('returns true when previously-disabled visualization is enabled', () => {
        previousVisualizationStates = {
            [id]: false,
        };
        const newVisualizationEnabledState = true;

        expect(
            visualizationNeedsUpdate(
                visualizationType,
                id,
                newVisualizationEnabledState,
                newSelectorMapState,
                previousVisualizationStates,
                previousVisualizationSelectorMapData,
            ),
        ).toEqual(true);
    });

    it('returns true when previously-enabled visualization is disabled', () => {
        previousVisualizationStates = {
            [id]: true,
        };
        const newVisualizationEnabledState = false;

        expect(
            visualizationNeedsUpdate(
                visualizationType,
                id,
                newVisualizationEnabledState,
                newSelectorMapState,
                previousVisualizationStates,
                previousVisualizationSelectorMapData,
            ),
        ).toEqual(true);
    });

    it('returns false when previously-disabled visualization is still disabled and selector map has not changed', () => {
        const newVisualizationEnabledState = false;
        previousVisualizationStates = {
            [id]: false,
        };

        newSelectorMapState = {};
        previousVisualizationSelectorMapData[visualizationType] = newSelectorMapState;

        expect(
            visualizationNeedsUpdate(
                visualizationType,
                id,
                newVisualizationEnabledState,
                newSelectorMapState,
                previousVisualizationStates,
                previousVisualizationSelectorMapData,
            ),
        ).toEqual(false);
    });

    it('returns false when previously-disabled visualization is still disabled, regardless of selector map changing,', () => {
        const newVisualizationEnabledState = false;
        previousVisualizationStates = {
            [id]: false,
        };

        newSelectorMapState = { 'new-state': null };
        previousVisualizationSelectorMapData[visualizationType] = { 'old-state': null };

        expect(
            visualizationNeedsUpdate(
                visualizationType,
                id,
                newVisualizationEnabledState,
                newSelectorMapState,
                previousVisualizationStates,
                previousVisualizationSelectorMapData,
            ),
        ).toEqual(false);
    });

    it('returns false when previously-enabled visualization is still enabled and selector map has not changed', () => {
        const newVisualizationEnabledState = true;
        previousVisualizationStates = {
            [id]: newVisualizationEnabledState,
        };

        newSelectorMapState = {};
        previousVisualizationSelectorMapData[visualizationType] = newSelectorMapState;

        expect(
            visualizationNeedsUpdate(
                visualizationType,
                id,
                newVisualizationEnabledState,
                newSelectorMapState,
                previousVisualizationStates,
                previousVisualizationSelectorMapData,
            ),
        ).toEqual(false);
    });

    it('returns true when previously-enabled visualization is still enabled, but selector map has changed', () => {
        const newVisualizationEnabledState = true;
        previousVisualizationStates = {
            [id]: newVisualizationEnabledState,
        };

        newSelectorMapState = { 'new-state': null };
        previousVisualizationSelectorMapData[visualizationType] = { 'old-state': null };

        expect(
            visualizationNeedsUpdate(
                visualizationType,
                id,
                newVisualizationEnabledState,
                newSelectorMapState,
                previousVisualizationStates,
                previousVisualizationSelectorMapData,
            ),
        ).toEqual(true);
    });
});
