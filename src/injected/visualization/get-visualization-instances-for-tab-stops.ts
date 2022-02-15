// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabStopsScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { TabStopVisualizationInstance } from 'injected/frameCommunicators/html-element-axe-results-helper';
import {
    SelectorToTabStopVisualizationMap,
    SelectorToVisualizationMap,
} from 'injected/selector-to-visualization-map';
import { forOwn } from 'lodash';
import { TabStopRequirementId } from 'types/tab-stop-requirement-info';

export const GetVisualizationInstancesForTabStops = (
    tabStopScanResultData: TabStopsScanResultData,
): SelectorToVisualizationMap => {
    const selectorToVisualizationInstanceMap: SelectorToTabStopVisualizationMap = {};

    tabStopScanResultData.tabbedElements.forEach(element => {
        const instance: TabStopVisualizationInstance = {
            isFailure: false,
            isVisualizationEnabled: true,
            ruleResults: null,
            target: element.target,
            propertyBag: {
                tabOrder: element.tabOrder,
                timestamp: element.timestamp,
            },
            requirementResults: {},
        };

        selectorToVisualizationInstanceMap[element.target.join(';')] = instance;
    });

    forOwn(tabStopScanResultData.requirements, (obj, requirementId: TabStopRequirementId) => {
        obj.instances.forEach(instance => {
            if (instance.selector == null) {
                return;
            }

            const selector = instance.selector.join(';');

            if (selectorToVisualizationInstanceMap[selector] != null) {
                selectorToVisualizationInstanceMap[selector].isFailure = true;
                selectorToVisualizationInstanceMap[selector].requirementResults[requirementId] = {
                    instanceId: instance.id,
                };
                return;
            }

            const newInstance: TabStopVisualizationInstance = {
                isFailure: true,
                isVisualizationEnabled: true,
                ruleResults: null,
                target: instance.selector,
                propertyBag: {},
                requirementResults: {
                    [requirementId]: {
                        instanceId: instance.id,
                    },
                },
            };

            selectorToVisualizationInstanceMap[selector] = newInstance;
        });
    });

    return selectorToVisualizationInstanceMap;
};
