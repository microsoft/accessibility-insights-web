// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabStopsScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { AssessmentVisualizationInstance } from 'injected/frameCommunicators/html-element-axe-results-helper';
import { SelectorToVisualizationMap } from 'injected/selector-to-visualization-map';
import { forOwn } from 'lodash';

export const GetVisualizationInstancesForTabStops = (
    tabStopScanResultData: TabStopsScanResultData,
): SelectorToVisualizationMap => {
    const selectorToVisualizationInstanceMap: SelectorToVisualizationMap = {};

    tabStopScanResultData.tabbedElements.forEach(element => {
        const instance = {
            isFailure: false,
            isVisualizationEnabled: true,
            ruleResults: null,
            target: element.target,
            propertyBag: {
                tabOrder: element.tabOrder,
                timestamp: element.timestamp,
            },
        } as AssessmentVisualizationInstance;

        selectorToVisualizationInstanceMap[element.target.join(';')] = instance;
    });

    forOwn(tabStopScanResultData.requirements, obj => {
        obj.instances.forEach(instance => {
            if (instance.selector == null) {
                return;
            }

            const newInstance = {
                isFailure: true,
                isVisualizationEnabled: true,
                ruleResults: null,
                target: instance.selector,
                propertyBag: {},
            };

            selectorToVisualizationInstanceMap[newInstance.target.join(';')] = newInstance;
        });
    });

    return selectorToVisualizationInstanceMap;
};
