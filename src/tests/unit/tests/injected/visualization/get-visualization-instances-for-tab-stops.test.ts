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
import { TabbedItemType } from 'injected/visualization/tabbed-item';

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
                undefined,
            ),
            'another;target': buildVisualizationInstance(
                tabbedElements[1].target,
                false,
                {
                    tabOrder: tabbedElements[1].tabOrder,
                    timestamp: tabbedElements[1].timestamp,
                },
                {},
                undefined,
            ),
        } as SelectorToVisualizationMap;
    });

    test('GetVisualizationInstancesForTabStops', () => {
        const firstRequirementResults = [
            {
                selector: ['some', 'requirement result selector'],
                description: 'instance description 1',
                id: 'some instance id',
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
            { ['keyboard-navigation']: { instanceId: firstRequirementResults[0].id } },
            TabbedItemType.MissingItem,
        );

        expectedResults['another;requirement result selector'] = buildVisualizationInstance(
            secondRequirementResults[0].selector,
            true,
            {},
            { ['keyboard-traps']: { instanceId: secondRequirementResults[0].id } },
            TabbedItemType.ErroredItem,
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
                id: 'some instance id',
            },
        ] as TabStopRequirementInstance[];

        const secondRequirementResults = [
            {
                selector: duplicateSelector,
                description: 'another instance description',
                id: 'another instance id',
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
                'keyboard-navigation': { instanceId: firstRequirementResults[0].id },
                'keyboard-traps': { instanceId: secondRequirementResults[0].id },
            },
            TabbedItemType.ErroredItem,
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
        itemType: TabbedItemType,
    ): TabStopVisualizationInstance {
        return {
            isFailure,
            isVisualizationEnabled: true,
            target,
            ruleResults: null,
            propertyBag,
            requirementResults,
            itemType,
        };
    }
});
