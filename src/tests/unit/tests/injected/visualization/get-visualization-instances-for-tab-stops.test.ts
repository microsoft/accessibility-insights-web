// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    SingleTabStopRequirementState,
    TabbedElementData,
    TabStopRequirementInstance,
    TabStopRequirementState,
    TabStopsScanResultData,
} from 'common/types/store-data/visualization-scan-result-data';
import {
    TabStopVisualizationInstance,
    TabStopVisualizationRequirementResults,
} from 'injected/frameCommunicators/html-element-axe-results-helper';
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
            'some;target': buildVisualizationInstance(
                tabbedElements[0].target,
                false,
                {
                    tabOrder: tabbedElements[0].tabOrder,
                    timestamp: tabbedElements[0].timestamp,
                },
                {},
            ),
            'another;target': buildVisualizationInstance(
                tabbedElements[1].target,
                false,
                {
                    tabOrder: tabbedElements[1].tabOrder,
                    timestamp: tabbedElements[1].timestamp,
                },
                {},
            ),
        } as SelectorToVisualizationMap;
    });

    test('GetVisualizationInstancesForTabStops', () => {
        const firstRequirementResults = [
            {
                selector: ['some', 'requirement result selector'],
                description: 'instance description 1',
            },
            {
                description: 'instance without a selector',
            },
        ] as TabStopRequirementInstance[];

        const secondRequirementResults = [
            {
                selector: ['another', 'requirement result selector'],
                description: 'another instance description',
            },
        ] as TabStopRequirementInstance[];

        const tabStopRequirementState = {
            'keyboard-navigation': {
                instances: firstRequirementResults,
            } as SingleTabStopRequirementState,
            'keyboard-traps': {
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
            { ['keyboard-navigation']: { description: firstRequirementResults[0].description } },
        );

        expectedResults['another;requirement result selector'] = buildVisualizationInstance(
            secondRequirementResults[0].selector,
            true,
            {},
            { ['keyboard-traps']: { description: secondRequirementResults[0].description } },
        );

        expect(GetVisualizationInstancesForTabStops(tabStopScanResultData)).toEqual(
            expectedResults,
        );
    });

    test('GetVisualizationInstancesForTabStops: multiple requirement instances for one element', () => {
        const duplicateSelector = ['some', 'requirement result selector'];
        const firstRequirementResults = [
            {
                selector: duplicateSelector,
                description: 'instance description 1',
            },
        ] as TabStopRequirementInstance[];

        const secondRequirementResults = [
            {
                selector: duplicateSelector,
                description: 'another instance description',
            },
        ] as TabStopRequirementInstance[];

        const tabStopRequirementState = {
            'keyboard-navigation': {
                instances: firstRequirementResults,
            } as SingleTabStopRequirementState,
            'keyboard-traps': {
                instances: secondRequirementResults,
            } as SingleTabStopRequirementState,
        } as TabStopRequirementState;

        const tabStopScanResultData: TabStopsScanResultData = {
            tabbedElements: [],
            requirements: tabStopRequirementState,
        } as TabStopsScanResultData;

        expectedResults = {};
        expectedResults['some;requirement result selector'] = buildVisualizationInstance(
            firstRequirementResults[0].selector,
            true,
            {},
            {
                'keyboard-navigation': { description: firstRequirementResults[0].description },
                'keyboard-traps': { description: secondRequirementResults[0].description },
            },
        );

        expect(GetVisualizationInstancesForTabStops(tabStopScanResultData)).toEqual(
            expectedResults,
        );
    });

    function buildVisualizationInstance(
        target: string[],
        isFailure: boolean,
        propertyBag: { tabOrder?: number; timestamp?: number },
        requirementResults: TabStopVisualizationRequirementResults,
    ): TabStopVisualizationInstance {
        return {
            isFailure,
            isVisualizationEnabled: true,
            target,
            ruleResults: null,
            propertyBag,
            requirementResults,
        };
    }
});
