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
                instanceId: 'some instance id',
            },
            {
                target: ['another', 'target'],
                tabOrder: 2,
                timestamp: 124,
                instanceId: 'some other instance id',
            },
        ] as TabbedElementData[];
        expectedResults = {
            [tabbedElements[0].instanceId]: buildVisualizationInstance(
                tabbedElements[0].target as string[],
                false,
                {
                    tabOrder: tabbedElements[0].tabOrder,
                    timestamp: tabbedElements[0].timestamp,
                },
                {},
                undefined,
            ),
            [tabbedElements[1].instanceId]: buildVisualizationInstance(
                tabbedElements[1].target as string[],
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

        expectedResults[firstRequirementResults[0].id] = buildVisualizationInstance(
            firstRequirementResults[0].selector,
            true,
            {},
            { ['keyboard-navigation']: { instanceId: firstRequirementResults[0].id } },
            TabbedItemType.MissingItem,
        );
        expectedResults[secondRequirementResults[0].id] = buildVisualizationInstance(
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

    test('GetVisualizationInstancesForTabStops: null tabbedElements', () => {
        const tabStopRequirementState = {} as TabStopRequirementState;

        const tabStopScanResultData: TabStopsScanResultData = {
            tabbedElements: null,
            requirements: tabStopRequirementState,
        } as TabStopsScanResultData;

        expect(GetVisualizationInstancesForTabStops(tabStopScanResultData)).toEqual({});
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
