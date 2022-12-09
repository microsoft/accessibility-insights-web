// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    SingleTabStopRequirementState,
    TabStopsScanResultData,
} from 'common/types/store-data/visualization-scan-result-data';
import { TabStopVisualizationInstance } from 'injected/frameCommunicators/html-element-axe-results-helper';
import {
    InstanceIdToTabStopVisualizationMap,
    SelectorToVisualizationMap,
} from 'injected/selector-to-visualization-map';
import { TabbedItemType } from 'injected/visualization/tabbed-item';
import { forOwn } from 'lodash';
import { TabStopRequirementId } from 'types/tab-stop-requirement-info';

export const GetVisualizationInstancesForTabStops = (
    tabStopScanResultData: TabStopsScanResultData,
): SelectorToVisualizationMap => {
    const instanceIdToVisualizationInstanceMap: InstanceIdToTabStopVisualizationMap = {};

    if (!tabStopScanResultData.tabbedElements) {
        return instanceIdToVisualizationInstanceMap;
    }

    tabStopScanResultData.tabbedElements.forEach(element => {
        const instance: TabStopVisualizationInstance = {
            isFailure: false,
            isVisualizationEnabled: true,
            ruleResults: {},
            target: element.target,
            propertyBag: {
                tabOrder: element.tabOrder,
                timestamp: element.timestamp,
            },
            requirementResults: {},
        };

        instanceIdToVisualizationInstanceMap[element.instanceId] = instance;
    });

    forOwn(
        tabStopScanResultData.requirements,
        (obj: SingleTabStopRequirementState, requirementId: TabStopRequirementId) => {
            obj.instances.forEach(instance => {
                if (instance.selector == null) {
                    return;
                }

                const itemType =
                    requirementId === 'keyboard-navigation'
                        ? TabbedItemType.MissingItem
                        : TabbedItemType.ErroredItem;

                const newInstance: TabStopVisualizationInstance = {
                    isFailure: true,
                    isVisualizationEnabled: true,
                    ruleResults: {},
                    target: instance.selector,
                    propertyBag: {},
                    requirementResults: {
                        [requirementId]: {
                            instanceId: instance.id,
                        },
                    },
                    itemType,
                };

                instanceIdToVisualizationInstanceMap[instance.id] = newInstance;
            });
        },
    );

    return instanceIdToVisualizationInstanceMap;
};
