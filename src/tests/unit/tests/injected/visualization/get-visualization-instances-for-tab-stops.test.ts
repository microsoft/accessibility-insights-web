// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    SingleTabStopRequirementState,
    TabbedElementData,
    TabStopRequirementInstance,
    TabStopRequirementState,
    TabStopsScanResultData,
} from 'common/types/store-data/visualization-scan-result-data';
import { SelectorToVisualizationMap } from 'injected/selector-to-visualization-map';
import { GetVisualizationInstancesForTabStops } from 'injected/visualization/get-visualization-instances-for-tab-stops';

describe('GetVisualizationInstancesForTabStops', () => {
    let tabbedElements: TabbedElementData[];
    let expectedResults: SelectorToVisualizationMap;

    beforeEach(() => {
        tabbedElements = [
            {
                target: ['some', 'target'],
                tabOrder: 1,
                timestamp: 123,
            },
            {
                target: ['another', 'target'],
                tabOrder: 2,
                timestamp: 124,
            },
        ] as TabbedElementData[];
        expectedResults = {
            'some;target': buildVisualizationInstance(tabbedElements[0].target, false, {
                tabOrder: tabbedElements[0].tabOrder,
                timestamp: tabbedElements[0].timestamp,
            }),
            'another;target': buildVisualizationInstance(tabbedElements[1].target, false, {
                tabOrder: tabbedElements[1].tabOrder,
                timestamp: tabbedElements[1].timestamp,
            }),
        } as SelectorToVisualizationMap;
    });

    test('GetVisualizationInstancesForTabStops', () => {
        const firstRequirementResults = [
            {
                selector: ['some', 'requirement result selector'],
            },
            {
                description: 'instance without a selector',
            },
        ] as TabStopRequirementInstance[];

        const secondRequirementResults = [
            {
                selector: ['another', 'requirement result selector'],
            },
        ] as TabStopRequirementInstance[];

        const tabStopRequirementState = {
            'some-requirement': {
                instances: firstRequirementResults,
            } as SingleTabStopRequirementState,
            'another-requirement': {
                instances: secondRequirementResults,
            } as SingleTabStopRequirementState,
        } as TabStopRequirementState;

        const tabStopScanResultData: TabStopsScanResultData = {
            tabbedElements: tabbedElements,
            requirements: tabStopRequirementState,
        } as TabStopsScanResultData;

        expectedResults['some;requirement result selector'] = buildVisualizationInstance(
            firstRequirementResults[0].selector,
            true,
            {},
        );

        expectedResults['another;requirement result selector'] = buildVisualizationInstance(
            secondRequirementResults[0].selector,
            true,
            {},
        );

        expect(GetVisualizationInstancesForTabStops(tabStopScanResultData)).toEqual(
            expectedResults,
        );
    });

    function buildVisualizationInstance(
        target: string[],
        isFailure: boolean,
        propertyBag: { tabOrder?: number; timestamp?: number },
    ) {
        return {
            isFailure,
            isVisualizationEnabled: true,
            target,
            ruleResults: null,
            propertyBag,
        };
    }
});
