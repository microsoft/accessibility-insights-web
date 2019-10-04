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

    test('previous visualization state for given config id is not the same as the new visualization state', () => {
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
});
